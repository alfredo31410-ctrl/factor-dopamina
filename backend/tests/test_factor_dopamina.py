"""Factor Dopamina backend tests."""
import os
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://mindset-forge-8.preview.emergentagent.com').rstrip('/')
ADMIN_EMAIL = "admin@factordopamina.com"
ADMIN_PASSWORD = "FactorDopamina2026!"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def auth(session):
    r = session.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    data = r.json()
    return {"token": data["token"], "user": data}


@pytest.fixture(scope="module")
def auth_headers(auth):
    return {"Authorization": f"Bearer {auth['token']}", "Content-Type": "application/json"}


# ===== Public courses =====
def test_list_published_courses_has_5(session):
    r = session.get(f"{BASE_URL}/api/courses")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert len(data) >= 5
    for c in data:
        assert c["status"] == "published"
        assert c.get("thumbnail")


def test_list_featured_courses(session):
    r = session.get(f"{BASE_URL}/api/courses", params={"featured": "true"})
    assert r.status_code == 200
    data = r.json()
    assert all(c.get("featured") is True for c in data)
    assert len(data) >= 1


def test_get_course_by_slug_disciplina(session):
    r = session.get(f"{BASE_URL}/api/courses/disciplina-absoluta")
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["slug"] == "disciplina-absoluta"
    assert data["title"] == "Disciplina Absoluta"
    assert len(data["modules"]) >= 1


def test_get_course_invalid_slug_404(session):
    r = session.get(f"{BASE_URL}/api/courses/no-such-course-xyz")
    assert r.status_code == 404


# ===== Auth =====
def test_login_wrong_password_401(session):
    r = session.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"})
    assert r.status_code == 401


def test_login_sets_cookie_and_token(session):
    r = session.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200
    data = r.json()
    assert "token" in data and len(data["token"]) > 10
    assert data["email"] == ADMIN_EMAIL
    # cookie should be set
    set_cookie = r.headers.get("set-cookie", "")
    assert "access_token" in set_cookie.lower()


def test_me_with_bearer(session, auth_headers):
    r = session.get(f"{BASE_URL}/api/auth/me", headers=auth_headers)
    assert r.status_code == 200
    assert r.json()["email"] == ADMIN_EMAIL


def test_me_without_auth_401():
    r = requests.get(f"{BASE_URL}/api/auth/me")
    assert r.status_code == 401


def test_admin_courses_without_auth_401():
    r = requests.get(f"{BASE_URL}/api/admin/courses")
    assert r.status_code == 401


def test_admin_list_all_courses(session, auth_headers):
    r = session.get(f"{BASE_URL}/api/admin/courses", headers=auth_headers)
    assert r.status_code == 200
    data = r.json()
    assert len(data) >= 5


# ===== Admin CRUD =====
def test_admin_crud_course(session, auth_headers):
    # Create
    payload = {
        "title": "TEST_Curso Dopamina QA",
        "short_description": "Short desc",
        "description": "Full desc",
        "thumbnail": "https://example.com/img.png",
        "hotmart_link": "https://hotmart.com/test",
        "modules": [{"title": "Mod 1", "description": "d"}],
        "status": "published",
        "featured": False,
    }
    r = session.post(f"{BASE_URL}/api/admin/courses", headers=auth_headers, json=payload)
    assert r.status_code == 200, r.text
    created = r.json()
    cid = created["id"]
    assert "curso-dopamina-qa" in created["slug"]
    original_slug = created["slug"]

    # GET by id
    r = session.get(f"{BASE_URL}/api/admin/courses/{cid}", headers=auth_headers)
    assert r.status_code == 200

    # Update title -> slug should change
    r = session.put(f"{BASE_URL}/api/admin/courses/{cid}", headers=auth_headers,
                    json={"title": "TEST_Curso Renombrado QA"})
    assert r.status_code == 200
    updated = r.json()
    assert updated["title"] == "TEST_Curso Renombrado QA"
    assert updated["slug"] != original_slug
    assert updated["slug"].startswith("test-curso-renombrado-qa") or "curso-renombrado-qa" in updated["slug"]

    # Verify persisted via public if published
    r = session.get(f"{BASE_URL}/api/courses/{updated['slug']}")
    assert r.status_code == 200

    # Delete
    r = session.delete(f"{BASE_URL}/api/admin/courses/{cid}", headers=auth_headers)
    assert r.status_code == 200

    # Verify gone
    r = session.get(f"{BASE_URL}/api/admin/courses/{cid}", headers=auth_headers)
    assert r.status_code == 404


# ===== Contact =====
def test_contact_submit(session):
    r = session.post(f"{BASE_URL}/api/contact", json={
        "name": "TEST QA", "email": "qa@test.com", "message": "Hola"
    })
    assert r.status_code == 200
    assert r.json().get("ok") is True
