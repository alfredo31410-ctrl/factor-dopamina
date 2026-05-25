import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Target,
} from "lucide-react";
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
      <div className="min-h-[60vh] flex items-center justify-center px-5 sm:px-6">
        <div
          className="text-center max-w-xl border border-white/10 bg-[#0A0A0A] p-8 md:p-10"
          data-testid="course-not-found"
        >
          <p className="fd-overline mb-4">// 404</p>

          <h1 className="text-3xl sm:text-4xl font-black uppercase text-white mb-4">
            Curso no encontrado
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base mb-6">
            Lo sentimos, el curso que buscas aún no está disponible o fue
            retirado.
          </p>

          <Link to="/cursos" className="fd-btn-secondary w-full sm:w-auto">
            <ArrowLeft size={14} /> Regresar al catálogo
          </Link>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="border border-white/10 bg-[#0A0A0A] p-8 text-center">
          <div className="mx-auto mb-5 h-10 w-10 border border-[#CCFF00]/40 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-[#CCFF00] animate-pulse" />
          </div>

          <p className="text-zinc-500 font-mono text-xs sm:text-sm uppercase tracking-widest animate-pulse">
            Cargando detalles del curso...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="course-detail-page">
      {/* HERO */}
      <section className="relative border-b border-white/10 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 md:opacity-25 scale-105"
          style={{ backgroundImage: `url(${course.thumbnail})` }}
        />

        <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-black via-black/90 to-black/75 md:to-black/55" />
        <div className="absolute -right-24 top-24 h-72 w-72 rounded-full bg-[#CCFF00]/10 blur-3xl" />
        <div className="absolute left-0 bottom-0 h-px w-full bg-gradient-to-r from-transparent via-[#CCFF00]/30 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-20 md:py-32 grid md:grid-cols-12 gap-10 md:gap-12 items-center">
          <div className="md:col-span-7">
            <Link
              to="/cursos"
              className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-[#CCFF00] transition-colors mb-7 md:mb-8"
              data-testid="back-to-cursos"
            >
              <ArrowLeft size={14} /> Volver a cursos
            </Link>

            <div className="inline-flex items-center gap-2 border border-[#CCFF00]/30 bg-black/40 px-3 py-2 text-[10px] sm:text-xs font-mono uppercase tracking-[0.22em] text-[#CCFF00] mb-6">
              <Sparkles size={14} />
              Programa de alto rendimiento
            </div>

            <p className="fd-overline mb-4">// Programa</p>

            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-white leading-[0.95] mb-6"
              data-testid="course-title"
            >
              {course.title}
            </h1>

            <p className="text-zinc-300 text-base md:text-lg leading-relaxed mb-8 md:mb-10 max-w-2xl">
              {course.short_description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {course.hotmart_link ? (
                <a
                  href={course.hotmart_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fd-btn-primary w-full sm:w-auto"
                  data-testid="hotmart-cta-button"
                >
                  Comprar en Hotmart <ArrowRight size={16} />
                </a>
              ) : (
                <button
                  disabled
                  className="fd-btn-primary w-full sm:w-auto opacity-50 cursor-not-allowed"
                  data-testid="hotmart-cta-disabled"
                >
                  Próximamente
                </button>
              )}

              {course.price_label && (
                <span className="inline-flex items-center justify-center gap-2 px-4 py-3 border border-white/10 bg-white/[0.03] text-xs font-mono uppercase tracking-widest text-zinc-300 text-center">
                  <Sparkles size={14} className="text-[#CCFF00]" />{" "}
                  {course.price_label}
                </span>
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-zinc-500">
              <span className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.03] px-3 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#CCFF00]" />
                Acceso digital
              </span>

              <span className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.03] px-3 py-2">
                Disciplina · Enfoque · Ejecución
              </span>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="relative">
              <div className="absolute -inset-3 border border-[#CCFF00]/10 bg-[#CCFF00]/5 blur-xl" />

              <div className="relative aspect-[4/5] sm:aspect-[16/10] md:aspect-[4/5] overflow-hidden border border-white/10 bg-black">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover opacity-95"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {course.featured && (
                  <div className="absolute top-4 left-4 border border-[#CCFF00]/40 bg-black/70 backdrop-blur-sm px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-[#CCFF00]">
                    Destacado
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DESCRIPTION */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-16 md:py-24 grid md:grid-cols-12 gap-8 md:gap-12">
        <div className="md:col-span-4">
          <p className="fd-overline mb-3">// El curso</p>

          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">
            Lo que vas a <span className="text-[#CCFF00]">construir</span>.
          </h2>
        </div>

        <div className="md:col-span-7 md:col-start-6">
          <div className="border-l border-[#CCFF00]/30 pl-5 md:pl-8">
            <p className="text-zinc-300 text-base md:text-lg leading-relaxed whitespace-pre-line">
              {course.description}
            </p>
          </div>
        </div>
      </section>

      {/* MODULES */}
      {course.modules && course.modules.length > 0 && (
        <section className="border-t border-white/10 bg-[#070707]">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-16 md:py-24">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-12">
              <div>
                <p className="fd-overline mb-3">// Contenido</p>

                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">
                  Módulos del programa
                </h2>
              </div>

              <div className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.03] px-3 py-2 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-zinc-500 w-fit">
                <Target size={14} className="text-[#CCFF00]" />
                {course.modules.length} módulos
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10">
              {course.modules.map((m, i) => (
                <div
                  key={i}
                  className="group bg-[#0A0A0A] p-6 md:p-8 hover:bg-[#121212] transition-all duration-300 relative overflow-hidden"
                  data-testid={`module-${i}`}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-[#CCFF00]/10 via-transparent to-transparent" />

                  <div className="relative flex items-start gap-4">
                    <div className="text-[#CCFF00] mt-1 shrink-0 group-hover:scale-110 transition-transform">
                      <CheckCircle2 size={20} strokeWidth={1.5} />
                    </div>

                    <div>
                      <p className="text-xs font-mono text-zinc-500 mb-1 tracking-widest group-hover:text-[#CCFF00]/70 transition-colors">
                        {String(i + 1).padStart(2, "0")}
                      </p>

                      <h3 className="text-base md:text-lg font-black uppercase tracking-tight text-white mb-2">
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
      <section className="relative border-t border-white/10 fd-molecular-bg overflow-hidden">
        <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-[#CCFF00]/10 blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-5 sm:px-6 lg:px-10 py-20 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 border border-[#CCFF00]/30 bg-black/40 px-3 py-2 text-[10px] sm:text-xs font-mono uppercase tracking-[0.22em] text-[#CCFF00] mb-6">
            <Sparkles size={14} />
            Empieza con una decisión
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter text-white leading-tight mb-6">
            ¿Listo para <span className="text-[#CCFF00]">transformarte</span>?
          </h2>

          <p className="text-zinc-400 text-base md:text-lg mb-8 md:mb-10 max-w-xl mx-auto">
            Solo una decisión te separa del hombre que quieres ser. Da el primer
            paso hoy.
          </p>

          {course.hotmart_link ? (
            <a
              href={course.hotmart_link}
              target="_blank"
              rel="noopener noreferrer"
              className="fd-btn-primary w-full sm:w-auto"
              data-testid="hotmart-cta-bottom"
            >
              Acceder al curso <ArrowRight size={16} />
            </a>
          ) : (
            <button
              disabled
              className="fd-btn-primary w-full sm:w-auto opacity-50 cursor-not-allowed"
            >
              Próximamente
            </button>
          )}
        </div>
      </section>
    </div>
  );
}