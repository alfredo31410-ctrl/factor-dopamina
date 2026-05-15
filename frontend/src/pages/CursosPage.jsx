import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
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
      <section className="border-b border-white/10 fd-molecular-bg">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24 md:py-32">
          <p className="fd-overline mb-6">// Catálogo</p>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-[0.95] max-w-3xl">
            Cursos para <span className="text-[#CCFF00]">construirte</span>.
          </h1>
          <p className="text-zinc-400 text-lg mt-6 max-w-2xl leading-relaxed">
            Programas diseñados para hombres con hambre. Cada uno es una ruta clara
            hacia una versión más fuerte, enfocada y consciente.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        {loading ? (
          <div className="text-center py-32 text-zinc-500 font-mono text-sm uppercase tracking-widest animate-pulse">
            Cargando cursos...
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-32 text-zinc-500 font-mono text-sm uppercase tracking-widest">
            Próximamente. Vuelve pronto.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 text-xs font-mono text-zinc-300 tracking-widest">
                    0{idx + 1}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-black uppercase tracking-tight text-white mb-2 group-hover:text-[#CCFF00] transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed flex-1">
                    {c.short_description}
                  </p>
                  <div className="mt-6 flex items-center text-[#CCFF00] text-xs font-mono uppercase tracking-widest">
                    Ver curso <ArrowRight size={12} className="ml-2" />
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
