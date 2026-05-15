import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api, { formatApiError } from "../lib/api";
import {
  LogOut,
  Plus,
  Edit3,
  Trash2,
  Upload,
  X,
  Save,
  Eye,
  EyeOff,
  Star,
  ExternalLink,
  ImageIcon,
  Loader2,
  Plus as PlusIcon,
} from "lucide-react";
import { toast } from "sonner";

const EMPTY = {
  title: "",
  short_description: "",
  description: "",
  thumbnail: "",
  hotmart_link: "",
  modules: [],
  status: "draft",
  featured: false,
  price_label: "",
};

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [editing, setEditing] = useState(null); // null=closed, EMPTY=new, course=edit
  const [loading, setLoading] = useState(true);

  const reload = () =>
    api.get("/admin/courses").then((r) => setCourses(r.data || [])).finally(() => setLoading(false));

  useEffect(() => {
    reload();
  }, []);

  const onLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const onDelete = async (id) => {
    if (!window.confirm("¿Eliminar este curso?")) return;
    try {
      await api.delete(`/admin/courses/${id}`);
      toast.success("Curso eliminado");
      reload();
    } catch (e) {
      toast.error(formatApiError(e.response?.data?.detail));
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white" data-testid="admin-dashboard-page">
      {/* Top bar */}
      <header className="border-b border-white/10 bg-black sticky top-0 z-30">
        <div className="px-6 lg:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 border border-[#CCFF00] flex items-center justify-center">
              <span className="text-[#CCFF00] font-black text-xs font-mono">FD</span>
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                Panel Admin
              </p>
              <p className="text-sm font-bold">Factor Dopamina</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              target="_blank"
              className="hidden md:inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-[#CCFF00]"
              data-testid="view-site-link"
            >
              <ExternalLink size={14} /> Ver sitio
            </Link>
            <span className="hidden md:block text-xs font-mono text-zinc-500">
              {user?.email}
            </span>
            <button
              onClick={onLogout}
              className="fd-btn-secondary text-xs px-3 py-2"
              data-testid="admin-logout-button"
            >
              <LogOut size={14} /> Salir
            </button>
          </div>
        </div>
      </header>

      <div className="px-6 lg:px-10 py-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="fd-overline mb-3">// Gestión</p>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
              Cursos <span className="text-[#CCFF00]">({courses.length})</span>
            </h1>
          </div>
          <button
            onClick={() => setEditing(EMPTY)}
            className="fd-btn-primary"
            data-testid="admin-new-course-button"
          >
            <Plus size={16} /> Nuevo curso
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-zinc-500 font-mono">Cargando...</div>
        ) : courses.length === 0 ? (
          <div className="border border-dashed border-white/10 p-20 text-center">
            <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest mb-4">
              No hay cursos
            </p>
            <button
              onClick={() => setEditing(EMPTY)}
              className="fd-btn-primary"
              data-testid="admin-empty-create"
            >
              <Plus size={16} /> Crear el primero
            </button>
          </div>
        ) : (
          <div className="border border-white/10">
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-black border-b border-white/10 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
              <div className="col-span-1">Img</div>
              <div className="col-span-5">Título</div>
              <div className="col-span-2">Estado</div>
              <div className="col-span-2">Destacado</div>
              <div className="col-span-2 text-right">Acciones</div>
            </div>
            {courses.map((c) => (
              <div
                key={c.id}
                className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 hover:bg-white/5 items-center"
                data-testid={`admin-row-${c.id}`}
              >
                <div className="col-span-1">
                  {c.thumbnail ? (
                    <img src={c.thumbnail} alt="" className="w-12 h-12 object-cover border border-white/10" />
                  ) : (
                    <div className="w-12 h-12 border border-white/10 flex items-center justify-center text-zinc-600">
                      <ImageIcon size={14} />
                    </div>
                  )}
                </div>
                <div className="col-span-5">
                  <p className="text-sm font-bold text-white truncate">{c.title}</p>
                  <p className="text-xs text-zinc-500 truncate font-mono">/{c.slug}</p>
                </div>
                <div className="col-span-2">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest px-2 py-1 border ${
                      c.status === "published"
                        ? "border-[#CCFF00]/50 text-[#CCFF00] bg-[#CCFF00]/5"
                        : "border-white/10 text-zinc-500"
                    }`}
                  >
                    {c.status === "published" ? <Eye size={10} /> : <EyeOff size={10} />}
                    {c.status === "published" ? "Publicado" : "Borrador"}
                  </span>
                </div>
                <div className="col-span-2">
                  {c.featured && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#CCFF00]">
                      <Star size={10} fill="#CCFF00" /> Destacado
                    </span>
                  )}
                </div>
                <div className="col-span-2 flex justify-end gap-2">
                  <button
                    onClick={() => setEditing(c)}
                    className="w-8 h-8 border border-white/10 hover:border-[#CCFF00] hover:text-[#CCFF00] flex items-center justify-center transition-colors"
                    data-testid={`admin-edit-${c.id}`}
                    title="Editar"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(c.id)}
                    className="w-8 h-8 border border-white/10 hover:border-red-500 hover:text-red-500 flex items-center justify-center transition-colors"
                    data-testid={`admin-delete-${c.id}`}
                    title="Eliminar"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editing && (
        <CourseEditor
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            reload();
          }}
        />
      )}
    </div>
  );
}

function CourseEditor({ initial, onClose, onSaved }) {
  const isNew = !initial.id;
  const [form, setForm] = useState({
    ...initial,
    modules: Array.isArray(initial.modules) ? initial.modules : [],
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    setUploading(true);
    try {
      const { data } = await api.post("/admin/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = `${process.env.REACT_APP_BACKEND_URL}${data.url}`;
      setField("thumbnail", url);
      toast.success("Imagen subida");
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || "Error al subir");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const save = async () => {
    if (!form.title.trim() || !form.short_description.trim()) {
      toast.error("Título y descripción corta son obligatorios");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        short_description: form.short_description,
        description: form.description,
        thumbnail: form.thumbnail,
        hotmart_link: form.hotmart_link,
        modules: form.modules,
        status: form.status,
        featured: !!form.featured,
        price_label: form.price_label,
      };
      if (isNew) {
        await api.post("/admin/courses", payload);
        toast.success("Curso creado");
      } else {
        await api.put(`/admin/courses/${initial.id}`, payload);
        toast.success("Curso actualizado");
      }
      onSaved();
    } catch (e) {
      toast.error(formatApiError(e.response?.data?.detail) || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const addModule = () =>
    setField("modules", [...form.modules, { title: "", description: "" }]);
  const updateModule = (i, k, v) => {
    const next = [...form.modules];
    next[i] = { ...next[i], [k]: v };
    setField("modules", next);
  };
  const removeModule = (i) =>
    setField(
      "modules",
      form.modules.filter((_, idx) => idx !== i)
    );

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start md:items-center justify-center p-0 md:p-6 overflow-y-auto"
      data-testid="course-editor-modal"
    >
      <div className="bg-[#0A0A0A] border border-white/10 w-full max-w-4xl my-0 md:my-10">
        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-[#0A0A0A] z-10">
          <div>
            <p className="fd-overline">// {isNew ? "Crear" : "Editar"} curso</p>
            <h2 className="text-2xl font-black uppercase tracking-tight">
              {isNew ? "Nuevo curso" : form.title || "Sin título"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 border border-white/10 hover:border-white/30 flex items-center justify-center"
            data-testid="editor-close-button"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <Field label="Título">
            <input
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              className="fd-input"
              data-testid="editor-title-input"
            />
          </Field>

          <Field label="Descripción corta">
            <input
              value={form.short_description}
              onChange={(e) => setField("short_description", e.target.value)}
              className="fd-input"
              data-testid="editor-short-input"
            />
          </Field>

          <Field label="Descripción completa">
            <textarea
              rows={5}
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              className="fd-input resize-none"
              data-testid="editor-description-input"
            />
          </Field>

          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Link Hotmart">
              <input
                value={form.hotmart_link}
                onChange={(e) => setField("hotmart_link", e.target.value)}
                placeholder="https://hotmart.com/..."
                className="fd-input"
                data-testid="editor-hotmart-input"
              />
            </Field>
            <Field label="Etiqueta de precio (opcional)">
              <input
                value={form.price_label}
                onChange={(e) => setField("price_label", e.target.value)}
                placeholder="Inversión única"
                className="fd-input"
                data-testid="editor-price-input"
              />
            </Field>
          </div>

          {/* Thumbnail */}
          <div>
            <label className="fd-overline block mb-2">Miniatura</label>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                value={form.thumbnail}
                onChange={(e) => setField("thumbnail", e.target.value)}
                placeholder="URL externa o sube una imagen"
                className="fd-input"
                data-testid="editor-thumbnail-input"
              />
              <label className="fd-btn-secondary cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={onUpload}
                  className="hidden"
                  data-testid="editor-upload-input"
                />
                {uploading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Subiendo...
                  </>
                ) : (
                  <>
                    <Upload size={14} /> Subir imagen
                  </>
                )}
              </label>
            </div>
            {form.thumbnail && (
              <div className="mt-4 inline-block border border-white/10 p-2">
                <img src={form.thumbnail} alt="" className="w-48 h-32 object-cover" />
              </div>
            )}
          </div>

          {/* Modules */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="fd-overline">Módulos</label>
              <button
                onClick={addModule}
                className="text-xs font-mono uppercase tracking-widest text-[#CCFF00] hover:underline flex items-center gap-1"
                data-testid="editor-add-module"
              >
                <PlusIcon size={12} /> Agregar
              </button>
            </div>
            <div className="space-y-3">
              {form.modules.map((m, i) => (
                <div
                  key={i}
                  className="grid grid-cols-12 gap-3 items-start"
                  data-testid={`editor-module-${i}`}
                >
                  <div className="col-span-1 text-zinc-500 font-mono text-xs pt-3 text-center">
                    0{i + 1}
                  </div>
                  <input
                    value={m.title}
                    onChange={(e) => updateModule(i, "title", e.target.value)}
                    placeholder="Título del módulo"
                    className="fd-input col-span-5"
                  />
                  <input
                    value={m.description}
                    onChange={(e) => updateModule(i, "description", e.target.value)}
                    placeholder="Descripción breve"
                    className="fd-input col-span-5"
                  />
                  <button
                    onClick={() => removeModule(i)}
                    className="col-span-1 h-12 border border-white/10 hover:border-red-500 hover:text-red-500 flex items-center justify-center"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {form.modules.length === 0 && (
                <p className="text-zinc-600 text-xs font-mono">Sin módulos definidos</p>
              )}
            </div>
          </div>

          {/* Status & Featured */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="fd-overline block mb-2">Estado</label>
              <div className="flex gap-2">
                {[
                  { v: "draft", l: "Borrador" },
                  { v: "published", l: "Publicado" },
                ].map((s) => (
                  <button
                    key={s.v}
                    onClick={() => setField("status", s.v)}
                    className={`px-4 py-2 text-xs font-mono uppercase tracking-widest border transition-colors ${
                      form.status === s.v
                        ? "border-[#CCFF00] text-[#CCFF00] bg-[#CCFF00]/5"
                        : "border-white/10 text-zinc-500"
                    }`}
                    data-testid={`editor-status-${s.v}`}
                  >
                    {s.l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="fd-overline block mb-2">Destacado</label>
              <button
                onClick={() => setField("featured", !form.featured)}
                className={`px-4 py-2 text-xs font-mono uppercase tracking-widest border inline-flex items-center gap-2 ${
                  form.featured
                    ? "border-[#CCFF00] text-[#CCFF00] bg-[#CCFF00]/5"
                    : "border-white/10 text-zinc-500"
                }`}
                data-testid="editor-featured-toggle"
              >
                <Star size={12} fill={form.featured ? "#CCFF00" : "none"} />
                {form.featured ? "Sí" : "No"}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-white/10 sticky bottom-0 bg-[#0A0A0A]">
          <button onClick={onClose} className="fd-btn-secondary" data-testid="editor-cancel">
            Cancelar
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="fd-btn-primary disabled:opacity-50"
            data-testid="editor-save"
          >
            {saving ? "Guardando..." : "Guardar"} <Save size={14} />
          </button>
        </div>
      </div>

      <style>{`
        .fd-input {
          width: 100%;
          background: #000;
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          padding: 0.75rem 1rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .fd-input:focus {
          border-color: #CCFF00;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="fd-overline block mb-2">{label}</label>
      {children}
    </div>
  );
}
