import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import api from "../lib/api";

export default function CursoDetailPage() {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api
      .get(`/courses/${slug}`)
      .then((r) => setCourse(r.data))
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center" data-testid="course-not-found">
          <p className="fd-overline mb-4">// 404</p>
          <h1 className="text-4xl font-black uppercase text-white mb-4">
            Curso no encontrado
          </h1>
          <Link to="/cursos" className="fd-btn-secondary">
            <ArrowLeft size={14} /> Volver a cursos
          </Link>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-zinc-500 font-mono text-sm uppercase tracking-widest animate-pulse">
        Cargando...
      </div>
    );
  }

  return (
    <div data-testid="course-detail-page">
      {/* HERO */}
      <section className="relative border-b border-white/10 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${course.thumbnail})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/60" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-20 md:py-32 grid md:grid-cols-12 gap-12">
          <div className="md:col-span-7">
            <Link
              to="/cursos"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-[#CCFF00] mb-8"
              data-testid="back-to-cursos"
            >
              <ArrowLeft size={14} /> Volver a cursos
            </Link>
            <p className="fd-overline mb-4">// Programa</p>
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-white leading-[0.95] mb-6"
              data-testid="course-title"
            >
              {course.title}
            </h1>
            <p className="text-zinc-300 text-lg leading-relaxed mb-10 max-w-2xl">
              {course.short_description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {course.hotmart_link ? (
                <a
                  href={course.hotmart_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fd-btn-primary"
                  data-testid="hotmart-cta-button"
                >
                  Comprar en Hotmart <ArrowRight size={16} />
                </a>
              ) : (
                <button
                  disabled
                  className="fd-btn-primary opacity-50 cursor-not-allowed"
                  data-testid="hotmart-cta-disabled"
                >
                  Próximamente
                </button>
              )}
              {course.price_label && (
                <span className="inline-flex items-center gap-2 px-4 py-3 border border-white/10 text-xs font-mono uppercase tracking-widest text-zinc-300">
                  <Sparkles size={14} className="text-[#CCFF00]" />{" "}
                  {course.price_label}
                </span>
              )}
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="aspect-[4/5] overflow-hidden border border-white/10">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* DESCRIPTION */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20 grid md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <p className="fd-overline mb-3">// El curso</p>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">
            Lo que vas a <span className="text-[#CCFF00]">construir</span>.
          </h2>
        </div>
        <div className="md:col-span-7 md:col-start-6">
          <p className="text-zinc-300 text-lg leading-relaxed whitespace-pre-line">
            {course.description}
          </p>
        </div>
      </section>

      {/* MODULES */}
      {course.modules && course.modules.length > 0 && (
        <section className="border-t border-white/10 bg-[#070707]">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
            <p className="fd-overline mb-3">// Contenido</p>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white mb-12">
              Módulos del programa
            </h2>
            <div className="grid md:grid-cols-2 gap-px bg-white/10">
              {course.modules.map((m, i) => (
                <div
                  key={i}
                  className="bg-[#0A0A0A] p-8 hover:bg-[#121212] transition-colors"
                  data-testid={`module-${i}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-[#CCFF00] mt-1">
                      <CheckCircle2 size={20} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-xs font-mono text-zinc-500 mb-1 tracking-widest">
                        0{i + 1}
                      </p>
                      <h3 className="text-lg font-black uppercase tracking-tight text-white mb-2">
                        {m.title}
                      </h3>
                      {m.description && (
                        <p className="text-sm text-zinc-400 leading-relaxed">
                          {m.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FINAL CTA */}
      <section className="border-t border-white/10 fd-molecular-bg">
        <div className="max-w-4xl mx-auto px-6 lg:px-10 py-24 text-center">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white leading-tight mb-6">
            ¿Listo para <span className="text-[#CCFF00]">empezar</span>?
          </h2>
          <p className="text-zinc-400 mb-10 max-w-xl mx-auto">
            Una decisión separa al hombre que serás del que eres hoy. Hazla
            ahora.
          </p>
          {course.hotmart_link && (
            <a
              href={course.hotmart_link}
              target="_blank"
              rel="noopener noreferrer"
              className="fd-btn-primary"
              data-testid="hotmart-cta-bottom"
            >
              Acceder al curso <ArrowRight size={16} />
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
