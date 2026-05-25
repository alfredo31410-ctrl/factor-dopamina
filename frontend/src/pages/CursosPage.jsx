import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import api from "../lib/api";

export default function CursosPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/courses")
      .then((r) => setCourses(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen" data-testid="cursos-page">
      <section className="relative overflow-hidden border-b border-white/10 fd-molecular-bg">
        <div className="absolute -right-24 top-20 h-72 w-72 rounded-full bg-[#CCFF00]/10 blur-3xl" />
        <div className="absolute left-0 bottom-0 h-px w-full bg-gradient-to-r from-transparent via-[#CCFF00]/30 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-20 md:py-32">
          <div className="inline-flex items-center gap-2 border border-[#CCFF00]/30 bg-black/40 px-3 py-2 text-[10px] sm:text-xs font-mono uppercase tracking-[0.22em] text-[#CCFF00] mb-6">
            <Sparkles size={14} />
            Catálogo activo
          </div>

          <p className="fd-overline mb-5 md:mb-6">
            // Catálogo de transformación
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-[0.95] max-w-4xl">
            Cursos para{" "}
            <span className="text-[#CCFF00] fd-text-glow">
              forjar tu mejor versión
            </span>
            .
          </h1>

          <p className="text-zinc-400 text-base md:text-lg mt-6 max-w-2xl leading-relaxed">
            Programas intensivos diseñados para hombres que quieren disciplina,
            enfoque y resultados reales. Cada curso es un camino claro hacia tu
            mejor versión.
          </p>

          {!loading && courses.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center gap-3 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-zinc-500">
              <span className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.03] px-3 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#CCFF00]" />
                {courses.length} programas disponibles
              </span>
              <span className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.03] px-3 py-2">
                Disciplina · Enfoque · Energía
              </span>
            </div>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-14 md:py-20">
        {loading ? (
          <div className="py-20 md:py-32">
            <div className="mx-auto max-w-md border border-white/10 bg-[#0A0A0A] p-8 text-center">
              <div className="mx-auto mb-5 h-10 w-10 border border-[#CCFF00]/40 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-[#CCFF00] animate-pulse" />
              </div>
              <p className="text-zinc-500 font-mono text-xs sm:text-sm uppercase tracking-widest animate-pulse">
                Cargando cursos destacados...
              </p>
            </div>
          </div>
        ) : courses.length === 0 ? (
          <div className="py-20 md:py-32">
            <div className="mx-auto max-w-xl border border-white/10 bg-[#0A0A0A] p-8 text-center">
              <p className="fd-overline mb-4">// Próximamente</p>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mb-4">
                Nuevos programas en camino
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Estamos preparando nuevas rutas de entrenamiento. Mantente
                listo.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {courses.map((c, idx) => (
              <Link
                key={c.id}
                to={`/cursos/${c.slug}`}
                data-testid={`course-card-${c.slug}`}
                className="fd-card group flex flex-col"
              >
                <div className="aspect-[4/3] overflow-hidden bg-black relative">
                  <img
                    src={c.thumbnail}
                    alt={c.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#CCFF00]/5" />

                  <div className="absolute top-4 left-4 border border-white/10 bg-black/70 backdrop-blur-sm px-2.5 py-1 text-[10px] font-mono text-zinc-300 tracking-widest">
                    {String(idx + 1).padStart(2, "0")}
                  </div>

                  {c.featured && (
                    <div className="absolute top-4 right-4 border border-[#CCFF00]/40 bg-black/70 backdrop-blur-sm px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-[#CCFF00]">
                      Destacado
                    </div>
                  )}
                </div>

                <div className="p-5 md:p-6 flex-1 flex flex-col">
                  <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-white mb-2 group-hover:text-[#CCFF00] transition-colors">
                    {c.title}
                  </h3>

                  <p className="text-sm text-zinc-400 leading-relaxed flex-1">
                    {c.short_description}
                  </p>

                  <div className="mt-6 flex items-center text-[#CCFF00] text-xs font-mono uppercase tracking-widest">
                    Explorar curso{" "}
                    <ArrowRight
                      size={12}
                      className="ml-2 transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
