import uuid
import logging
import bcrypt
import jwt
import requests

from datetime import datetime, timezone, timedelta
from typing import List, Optional

from fastapi import (
    FastAPI,
    APIRouter,
    HTTPException,
    Request,
    Response,
    Depends,
    UploadFile,
    File,
)
from fastapi.responses import Response as FileResponse
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr

from app.config import settings
from app.database import db, close_database_connection


app = FastAPI(title="Factor Dopamina API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


# ===== Object Storage =====

storage_key: Optional[str] = None


def init_storage() -> Optional[str]:
    global storage_key

    if storage_key:
        return storage_key

    if not settings.EMERGENT_LLM_KEY:
        logger.warning("EMERGENT_LLM_KEY not set, storage disabled")
        return None

    try:
        resp = requests.post(
            f"{settings.STORAGE_URL}/init",
            json={"emergent_key": settings.EMERGENT_LLM_KEY},
            timeout=30,
        )
        resp.raise_for_status()
        storage_key = resp.json()["storage_key"]
        logger.info("Object storage initialized")
        return storage_key
    except Exception as e:
        logger.error(f"Storage init failed: {e}")
        return None


def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()

    if not key:
        raise HTTPException(status_code=503, detail="Storage no disponible")

    resp = requests.put(
        f"{settings.STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data,
        timeout=120,
    )
    resp.raise_for_status()

    return resp.json()


def get_object(path: str):
    key = init_storage()

    if not key:
        raise HTTPException(status_code=503, detail="Storage no disponible")

    resp = requests.get(
        f"{settings.STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key},
        timeout=60,
    )

    if resp.status_code == 404:
        raise HTTPException(status_code=404, detail="Archivo no encontrado")

    resp.raise_for_status()

    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")


# ===== Auth helpers =====

def hash_password(password: str) -> str:
    return bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt(),
    ).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(
        plain.encode("utf-8"),
        hashed.encode("utf-8"),
    )


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=12),
        "type": "access",
    }

    return jwt.encode(
        payload,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM,
    )


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")

    if not token:
        auth_header = request.headers.get("Authorization", "")

        if auth_header.startswith("Bearer "):
            token = auth_header[7:]

    if not token:
        raise HTTPException(status_code=401, detail="No autenticado")

    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM],
        )

        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Token inválido")

        user = await db.users.find_one(
            {"id": payload["sub"]},
            {"_id": 0, "password_hash": 0},
        )

        if not user:
            raise HTTPException(status_code=401, detail="Usuario no encontrado")

        return user

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")


# ===== Models =====

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class Module(BaseModel):
    title: str
    description: Optional[str] = ""


class CourseCreate(BaseModel):
    title: str
    short_description: str
    description: str
    thumbnail: str = ""
    hotmart_link: str = ""
    modules: List[Module] = []
    status: str = "draft"
    featured: bool = False
    price_label: Optional[str] = ""


class CourseUpdate(BaseModel):
    title: Optional[str] = None
    short_description: Optional[str] = None
    description: Optional[str] = None
    thumbnail: Optional[str] = None
    hotmart_link: Optional[str] = None
    modules: Optional[List[Module]] = None
    status: Optional[str] = None
    featured: Optional[bool] = None
    price_label: Optional[str] = None


class Course(CourseCreate):
    id: str
    slug: str
    created_at: str
    updated_at: str


class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    message: str


# ===== Utility =====

def make_slug(title: str) -> str:
    import re
    import unicodedata

    normalized_title = unicodedata.normalize("NFKD", title)
    ascii_title = normalized_title.encode("ascii", "ignore").decode("ascii")

    slug = re.sub(r"[^a-zA-Z0-9\s-]", "", ascii_title).strip().lower()
    slug = re.sub(r"[\s-]+", "-", slug)

    return slug or str(uuid.uuid4())[:8]


# ===== Auth Routes =====

@api_router.post("/auth/login")
async def login(payload: LoginRequest, response: Response):
    email = payload.email.lower().strip()

    user = await db.users.find_one({"email": email})

    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    token = create_access_token(user["id"], user["email"])

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=12 * 3600,
        path="/",
    )

    return {
        "id": user["id"],
        "email": user["email"],
        "name": user.get("name", ""),
        "role": user.get("role", "admin"),
        "token": token,
    }


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    return {"ok": True}


@api_router.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return user


# ===== Public Course Routes =====

@api_router.get("/courses")
async def list_public_courses(featured: Optional[bool] = None):
    query = {"status": "published"}

    if featured is not None:
        query["featured"] = featured

    items = await db.courses.find(
        query,
        {"_id": 0},
    ).sort("created_at", -1).to_list(200)

    return items


@api_router.get("/courses/{slug}")
async def get_course_by_slug(slug: str):
    course = await db.courses.find_one(
        {"slug": slug, "status": "published"},
        {"_id": 0},
    )

    if not course:
        raise HTTPException(status_code=404, detail="Curso no encontrado")

    return course


# ===== Admin Course Routes =====

@api_router.get("/admin/courses")
async def list_all_courses(user: dict = Depends(get_current_user)):
    items = await db.courses.find(
        {},
        {"_id": 0},
    ).sort("created_at", -1).to_list(500)

    return items


@api_router.post("/admin/courses")
async def create_course(data: CourseCreate, user: dict = Depends(get_current_user)):
    now = datetime.now(timezone.utc).isoformat()

    base_slug = make_slug(data.title)
    slug = base_slug
    counter = 1

    while await db.courses.find_one({"slug": slug}):
        counter += 1
        slug = f"{base_slug}-{counter}"

    course = data.model_dump()
    course.update(
        {
            "id": str(uuid.uuid4()),
            "slug": slug,
            "created_at": now,
            "updated_at": now,
        }
    )

    await db.courses.insert_one(course)

    course.pop("_id", None)

    return course


@api_router.get("/admin/courses/{course_id}")
async def get_admin_course(course_id: str, user: dict = Depends(get_current_user)):
    course = await db.courses.find_one(
        {"id": course_id},
        {"_id": 0},
    )

    if not course:
        raise HTTPException(status_code=404, detail="Curso no encontrado")

    return course


@api_router.put("/admin/courses/{course_id}")
async def update_course(
    course_id: str,
    data: CourseUpdate,
    user: dict = Depends(get_current_user),
):
    existing = await db.courses.find_one({"id": course_id})

    if not existing:
        raise HTTPException(status_code=404, detail="Curso no encontrado")

    update = {
        key: value
        for key, value in data.model_dump(exclude_unset=True).items()
        if value is not None
    }

    if "title" in update and update["title"] != existing["title"]:
        base_slug = make_slug(update["title"])
        slug = base_slug
        counter = 1

        while await db.courses.find_one({"slug": slug, "id": {"$ne": course_id}}):
            counter += 1
            slug = f"{base_slug}-{counter}"

        update["slug"] = slug

    update["updated_at"] = datetime.now(timezone.utc).isoformat()

    await db.courses.update_one(
        {"id": course_id},
        {"$set": update},
    )

    course = await db.courses.find_one(
        {"id": course_id},
        {"_id": 0},
    )

    return course


@api_router.delete("/admin/courses/{course_id}")
async def delete_course(course_id: str, user: dict = Depends(get_current_user)):
    result = await db.courses.delete_one({"id": course_id})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Curso no encontrado")

    return {"ok": True}


# ===== Upload =====

@api_router.post("/admin/upload")
async def upload_image(
    file: UploadFile = File(...),
    user: dict = Depends(get_current_user),
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Solo se permiten imágenes")

    ext = (
        (file.filename or "").rsplit(".", 1)[-1].lower()
        if "." in (file.filename or "")
        else "bin"
    )

    path = f"{settings.APP_NAME}/uploads/{user['id']}/{uuid.uuid4()}.{ext}"

    data = await file.read()

    if len(data) > 8 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="Imagen demasiado grande (máx 8MB)",
        )

    result = put_object(path, data, file.content_type)

    await db.files.insert_one(
        {
            "id": str(uuid.uuid4()),
            "storage_path": result["path"],
            "original_filename": file.filename,
            "content_type": file.content_type,
            "size": result.get("size", len(data)),
            "uploaded_by": user["id"],
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
    )

    return {
        "path": result["path"],
        "url": f"/api/files/{result['path']}",
    }


@api_router.get("/files/{path:path}")
async def download_file(path: str):
    data, content_type = get_object(path)

    return FileResponse(
        content=data,
        media_type=content_type,
        headers={"Cache-Control": "public, max-age=86400"},
    )


# ===== Contact =====

@api_router.post("/contact")
async def send_contact(msg: ContactMessage):
    doc = {
        "id": str(uuid.uuid4()),
        "name": msg.name.strip(),
        "email": msg.email.lower().strip(),
        "message": msg.message.strip(),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "read": False,
    }

    await db.contact_messages.insert_one(doc)

    return {"ok": True}


@api_router.get("/admin/contact")
async def list_contact(user: dict = Depends(get_current_user)):
    items = await db.contact_messages.find(
        {},
        {"_id": 0},
    ).sort("created_at", -1).to_list(500)

    return items


# ===== Health =====

@api_router.get("/")
async def root():
    return {
        "app": "Factor Dopamina",
        "status": "ok",
    }


# ===== Startup =====

@app.on_event("startup")
async def startup_event():
    await db.users.create_index("email", unique=True)
    await db.courses.create_index("slug", unique=True)
    await db.courses.create_index("status")

    existing = await db.users.find_one({"email": settings.ADMIN_EMAIL.lower()})

    if existing is None:
        await db.users.insert_one(
            {
                "id": str(uuid.uuid4()),
                "email": settings.ADMIN_EMAIL.lower(),
                "password_hash": hash_password(settings.ADMIN_PASSWORD),
                "name": "Administrador",
                "role": "admin",
                "created_at": datetime.now(timezone.utc).isoformat(),
            }
        )

        logger.info(f"Admin seeded: {settings.ADMIN_EMAIL}")

    elif not verify_password(settings.ADMIN_PASSWORD, existing["password_hash"]):
        await db.users.update_one(
            {"email": settings.ADMIN_EMAIL.lower()},
            {
                "$set": {
                    "password_hash": hash_password(settings.ADMIN_PASSWORD),
                }
            },
        )

        logger.info(f"Admin password updated: {settings.ADMIN_EMAIL}")

    if await db.courses.count_documents({}) == 0:
        seed_courses = [
            {
                "title": "Disciplina Absoluta",
                "short_description": "Construye la disciplina inquebrantable que separa a los hombres comunes de los que dominan su vida.",
                "description": "Un programa intensivo para forjar disciplina real, no la versión de Instagram. Aprenderás los protocolos diarios, los rituales de alto rendimiento y el sistema mental para mantener tu palabra contigo mismo, incluso cuando nadie te ve. Este curso no es para curiosos: es para hombres que están listos para dejar de negociar consigo mismos.",
                "thumbnail": "https://static.prod-images.emergentagent.com/jobs/8ae7974f-7e96-40cd-96ba-4518b7997b9b/images/625e3d9aa8ca582c0f4154fa52dc7088b18977534242809b612d77844d983539.png",
                "hotmart_link": "https://hotmart.com/es/disciplina-absoluta",
                "modules": [
                    {
                        "title": "Módulo 1 — La Mente del Hombre Disciplinado",
                        "description": "Reprograma tu identidad.",
                    },
                    {
                        "title": "Módulo 2 — Rutinas de Alto Rendimiento",
                        "description": "Mañanas, sueño, energía.",
                    },
                    {
                        "title": "Módulo 3 — El Sistema de los 1000 Días",
                        "description": "Cómo sostener la disciplina.",
                    },
                    {
                        "title": "Módulo 4 — Romper el Ciclo del Confort",
                        "description": "Exposición controlada al desafío.",
                    },
                ],
                "status": "published",
                "featured": True,
                "price_label": "Inversión única",
            },
            {
                "title": "Mentalidad de Acero",
                "short_description": "Forja una mentalidad que no se rompe. Domina tus emociones, tu enfoque y tu narrativa interna.",
                "description": "La diferencia entre ganar y rendirse vive en tu cabeza. Mentalidad de Acero te enseña a reconstruir tu diálogo interno, manejar la presión, eliminar la ansiedad performativa y operar con claridad bajo cualquier circunstancia. Un sistema mental para el hombre que decide ser inamovible.",
                "thumbnail": "https://static.prod-images.emergentagent.com/jobs/8ae7974f-7e96-40cd-96ba-4518b7997b9b/images/4a1c95e87504e08826b7817b9c2f406f05ceab0219a67dc00c34d4391af0bfb1.png",
                "hotmart_link": "https://hotmart.com/es/mentalidad-de-acero",
                "modules": [
                    {
                        "title": "Módulo 1 — Anatomía de la Mente Fuerte",
                        "description": "Cómo funciona realmente.",
                    },
                    {
                        "title": "Módulo 2 — Diálogo Interno y Narrativa",
                        "description": "Reescribe la voz interna.",
                    },
                    {
                        "title": "Módulo 3 — Gestión de Presión",
                        "description": "Operar bajo caos.",
                    },
                    {
                        "title": "Módulo 4 — El Hombre Imperturbable",
                        "description": "Estado emocional dominante.",
                    },
                ],
                "status": "published",
                "featured": True,
                "price_label": "Acceso de por vida",
            },
            {
                "title": "Energía Masculina",
                "short_description": "Recupera tu testosterona, tu vitalidad y tu fuego interno con un protocolo respaldado por ciencia.",
                "description": "Tu energía es tu moneda real. Este curso integra ciencia, biología masculina y hábitos prácticos para que dejes de vivir en modo bajo. Vas a entender el sueño, la luz, el entrenamiento, la nutrición, los suplementos y los micro-hábitos que disparan tu vitalidad como hombre. No esoterismo: protocolos.",
                "thumbnail": "https://static.prod-images.emergentagent.com/jobs/8ae7974f-7e96-40cd-96ba-4518b7997b9b/images/cfdda5e57247114e26a74ca42308b7c50b0d4dde2540d6cce93ad525da0b9ed4.png",
                "hotmart_link": "https://hotmart.com/es/energia-masculina",
                "modules": [
                    {
                        "title": "Módulo 1 — Biología Masculina",
                        "description": "Testosterona, dopamina, cortisol.",
                    },
                    {
                        "title": "Módulo 2 — Sueño Profundo",
                        "description": "El multiplicador absoluto.",
                    },
                    {
                        "title": "Módulo 3 — Movimiento y Fuerza",
                        "description": "Entrenamiento mínimo eficaz.",
                    },
                    {
                        "title": "Módulo 4 — Combustible Real",
                        "description": "Nutrición sin religión.",
                    },
                ],
                "status": "published",
                "featured": True,
                "price_label": "Inversión única",
            },
            {
                "title": "Enfoque Profundo",
                "short_description": "Elimina la distracción crónica y entrena tu cerebro para trabajar como un láser durante horas.",
                "description": "Vivimos en una economía de la distracción. Quien domina su atención domina su vida. Aquí aprendes el sistema completo para sesiones de trabajo profundo, eliminación de inputs basura, gestión de dopamina barata, y construir un cerebro capaz de sostener foco quirúrgico durante 3-5 horas al día.",
                "thumbnail": "https://static.prod-images.emergentagent.com/jobs/8ae7974f-7e96-40cd-96ba-4518b7997b9b/images/d4808d43ae352dbec195e6e8331120b95352d2c3cebc5b566a935fb454f42a53.png",
                "hotmart_link": "https://hotmart.com/es/enfoque-profundo",
                "modules": [
                    {
                        "title": "Módulo 1 — La Economía de la Atención",
                        "description": "Por qué pierdes el foco.",
                    },
                    {
                        "title": "Módulo 2 — Detox de Dopamina",
                        "description": "Resetear tu sistema.",
                    },
                    {
                        "title": "Módulo 3 — Sesiones Deep Work",
                        "description": "Protocolo de 90 minutos.",
                    },
                    {
                        "title": "Módulo 4 — Cerebro de Alto Rendimiento",
                        "description": "Hábitos cognitivos.",
                    },
                ],
                "status": "published",
                "featured": False,
                "price_label": "Acceso de por vida",
            },
            {
                "title": "Propósito y Dirección",
                "short_description": "Define tu misión real como hombre. Deja de vivir en automático y construye una vida con dirección.",
                "description": "La mayoría de hombres no están deprimidos: están sin propósito. Este curso te lleva a través de un proceso brutalmente honesto para descubrir tu misión, definir tu visión a 10 años, y construir un plan de ejecución mensual. Salir de la deriva no es opcional cuando entiendes el costo de no hacerlo.",
                "thumbnail": "https://static.prod-images.emergentagent.com/jobs/8ae7974f-7e96-40cd-96ba-4518b7997b9b/images/a16e1f5d58d8d516e431f0491bd9f4103668941f4188ccc435d690ad3352a070.png",
                "hotmart_link": "https://hotmart.com/es/proposito-y-direccion",
                "modules": [
                    {
                        "title": "Módulo 1 — La Pregunta del Hombre",
                        "description": "Quién eres realmente.",
                    },
                    {
                        "title": "Módulo 2 — Visión a 10 Años",
                        "description": "Diseñar la vida.",
                    },
                    {
                        "title": "Módulo 3 — El Mapa de Ejecución",
                        "description": "Trimestres, meses, semanas.",
                    },
                    {
                        "title": "Módulo 4 — Vivir con Misión",
                        "description": "Sostener el propósito.",
                    },
                ],
                "status": "published",
                "featured": True,
                "price_label": "Inversión única",
            },
        ]

        now = datetime.now(timezone.utc).isoformat()

        for course in seed_courses:
            course.update(
                {
                    "id": str(uuid.uuid4()),
                    "slug": make_slug(course["title"]),
                    "created_at": now,
                    "updated_at": now,
                }
            )

        await db.courses.insert_many(seed_courses)

        logger.info(f"Seeded {len(seed_courses)} courses")

    init_storage()


@app.on_event("shutdown")
async def shutdown_db_client():
    close_database_connection()


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=settings.CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)