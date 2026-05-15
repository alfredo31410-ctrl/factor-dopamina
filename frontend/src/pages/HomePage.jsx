import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import { ArrowRight, Atom, Brain, Flame, Target, Compass, Zap } from "lucide-react";

const HERO_BG =
  "https://static.prod-images.emergentagent.com/jobs/8ae7974f-7e96-40cd-96ba-4518b7997b9b/images/d4808d43ae352dbec195e6e8331120b95352d2c3cebc5b566a935fb454f42a53.png";
const COMMUNITY_BG =
  "https://static.prod-images.emergentagent.com/jobs/8ae7974f-7e96-40cd-96ba-4518b7997b9b/images/a16e1f5d58d8d516e431f0491bd9f4103668941f4188ccc435d690ad3352a070.png";

const PILLARS = [
  { icon: Flame, title: "Disciplina", text: "La habilidad que separa al hombre que dice del que hace." },
  { icon: Target, title: "Enfoque", text: "Una atención quirúrgica en un mundo diseñado para distraerte." },
  { icon: Zap, title: "Energía", text: "Tu combustible biológico. Recupéralo, multiplícalo." },
  { icon: Compass, title: "Propósito", text: "Vivir con dirección, no a la deriva." },
  { icon: Brain, title: "Mentalidad", text: "Reprogramar tu narrativa interna como un sistema operativo." },
  { icon: Atom, title: "Rendimiento", text: "Ejecutar con precisión bajo presión, todos los días." },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get("/courses?featured=true").then((r) => setFeatured(r.data || [])).catch(() => {});
  }, []);

  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden border-b border-white/10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_BG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40" />
        <div className="absolute inset-0 fd-molecular-bg" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-24 w-full">
          <div className="max-w-3xl">
            <p className="fd-overline mb-6 fd-fade-up">// Plataforma para hombres en evolución</p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-white leading-[0.95] mb-8 fd-fade-up">
              Activa tu <br />
              <span className="text-[#CCFF00] fd-text-glow">factor</span> <br />
              dopamina.
            </h1>
            <p className="text-zinc-400 text-lg md:text-xl max-w-xl mb-10 leading-relaxed fd-fade-up">
              Cursos, mentalidad y protocolos para hombres que decidieron dejar
              de vivir en automático. Disciplina real. Energía real. Propósito real.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 fd-fade-up">
              <Link to="/cursos" className="fd-btn-primary" data-testid="hero-cta-cursos">
                Ver cursos <ArrowRight size={16} />
              </Link>
              <Link to="/contacto" className="fd-btn-secondary" data-testid="hero-cta-contacto">
                Habla con nosotros
              </Link>
            </div>
            <div className="mt-16 flex items-center gap-6 text-xs font-mono uppercase tracking-widest text-zinc-500">
              <span className="text-[#CCFF00]">●</span>
              <span>Construido en código · 1000 días</span>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="border-b border-white/10 bg-black py-10 overflow-hidden">
        <div className="fd-marquee-track flex gap-12 whitespace-nowrap will-change-transform">
          {Array.from({ length: 2 }).map((_, j) => (
            <div key={j} className="flex gap-12 items-center">
              {["DISCIPLINA", "ENFOQUE", "ENERGÍA", "PROPÓSITO", "MENTALIDAD", "RENDIMIENTO", "TRANSFORMACIÓN"].map(
                (w, i) => (
                  <span
                    key={`${j}-${i}`}
                    className="text-5xl md:text-7xl font-black uppercase tracking-tight text-transparent"
                    style={{ WebkitTextStroke: "1px rgba(255,255,255,0.18)" }}
                  >
                    {w} <span className="text-[#CCFF00]">/</span>
                  </span>
                )
              )}
            </div>
          ))}
        </div>
      </section>

      {/* PILLARS */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24 md:py-32" data-testid="pillars-section">
        <div className="grid md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-5">
            <p className="fd-overline mb-4">// Los 6 Pilares</p>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
              La fórmula de la <span className="text-[#CCFF00]">mejor versión</span> de ti.
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7 flex items-end">
            <p className="text-zinc-400 text-lg leading-relaxed">
              No es motivación de fin de semana. Es un sistema construido sobre seis
              pilares medibles y entrenables, diseñado para hombres que quieren
              resultados duraderos, no humo.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                data-testid={`pillar-${p.title.toLowerCase()}`}
                className="bg-[#0A0A0A] p-10 group hover:bg-[#121212] transition-colors relative"
              >
                <div className="absolute top-6 right-6 text-xs font-mono text-zinc-700">
                  0{i + 1}
                </div>
                <Icon
                  size={32}
                  className="text-[#CCFF00] mb-6 group-hover:scale-110 transition-transform"
                  strokeWidth={1.5}
                />
                <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-3">
                  {p.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{p.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section
        className="max-w-7xl mx-auto px-6 lg:px-10 py-24 md:py-32 border-t border-white/10"
        data-testid="featured-courses-section"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-14">
          <div>
            <p className="fd-overline mb-4">// Cursos destacados</p>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white max-w-xl">
              Programas para <span className="text-[#CCFF00]">forjar</span> al hombre que serás.
            </h2>
          </div>
          <Link to="/cursos" className="fd-btn-secondary" data-testid="featured-view-all">
            Ver todos <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.slice(0, 6).map((c) => (
            <Link
              key={c.id}
              to={`/cursos/${c.slug}`}
              data-testid={`course-card-${c.slug}`}
              className="fd-card flex flex-col group"
            >
              <div className="aspect-[4/3] overflow-hidden bg-black relative">
                <img
                  src={c.thumbnail}
                  alt={c.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                {c.featured && (
                  <span className="absolute top-4 left-4 bg-black border border-[#CCFF00]/50 text-[#CCFF00] text-[10px] px-2 py-1 uppercase tracking-widest font-mono">
                    Destacado
                  </span>
                )}
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
          {featured.length === 0 && (
            <div className="col-span-full text-center py-20 text-zinc-500 font-mono text-sm uppercase tracking-widest">
              Cargando cursos...
            </div>
          )}
        </div>
      </section>

      {/* COMMUNITY */}
      <section className="relative border-t border-white/10 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${COMMUNITY_BG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-32 md:py-40">
          <div className="max-w-2xl">
            <p className="fd-overline mb-6">// La comunidad</p>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-[1] mb-8">
              No caminas solo. <br />
              <span className="text-[#CCFF00]">Caminas con quienes también deciden.</span>
            </h2>
            <p className="text-zinc-300 text-lg leading-relaxed mb-10">
              Factor Dopamina es más que cursos: es un círculo silencioso de hombres
              que decidieron tomarse en serio. Construye contigo mismo.
              Multiplica con otros.
            </p>
            <Link to="/cursos" className="fd-btn-primary" data-testid="community-cta">
              Empieza ahora <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
