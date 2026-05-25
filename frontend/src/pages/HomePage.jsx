import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import {
  ArrowRight,
  Atom,
  Brain,
  Flame,
  Target,
  Compass,
  Zap,
} from "lucide-react";

const HERO_BG = "/images/hero-factor-dopamina.jpg";
const COMMUNITY_BG = "/images/comunidad-factor-dopamina.jpg";

const PILLARS = [
  {
    icon: Flame,
    title: "Disciplina",
    text: "Convierte tus decisiones en acciones diarias.",
  },
  {
    icon: Target,
    title: "Enfoque",
    text: "Atención absoluta en lo que realmente importa.",
  },
  {
    icon: Zap,
    title: "Energía",
    text: "Potencia tu cuerpo y mente para rendir al máximo.",
  },
  {
    icon: Compass,
    title: "Propósito",
    text: "Define tu rumbo y actúa con dirección.",
  },
  {
    icon: Brain,
    title: "Mentalidad",
    text: "Programa tu mente para tomar control de tu vida.",
  },
  {
    icon: Atom,
    title: "Rendimiento",
    text: "Maximiza resultados con eficiencia y constancia.",
  },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api
      .get("/courses?featured=true")
      .then((r) => setFeatured(r.data || []))
      .catch(() => {});
  }, []);

  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section className="relative min-h-[86vh] md:min-h-[92vh] flex items-center overflow-hidden border-b border-white/10">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${HERO_BG})` }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
        <div className="absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-[#CCFF00]/10 blur-3xl" />
        <div className="absolute inset-0 fd-molecular-bg" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-24 md:py-28 w-full">
          <div className="max-w-3xl">
            <div
              className="inline-flex items-center gap-2 border border-[#CCFF00]/30 bg-black/40 px-3 py-2 text-[10px] sm:text-xs font-mono uppercase tracking-[0.22em] text-[#CCFF00] mb-6 fd-fade-up"
              style={{ animationDelay: "0.03s" }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#CCFF00] shadow-[0_0_16px_rgba(204,255,0,0.8)]" />
              Sistema de evolución personal
            </div>

            <p
              className="fd-overline mb-6 fd-fade-up"
              style={{ animationDelay: "0.08s" }}
            >
              // Transforma tu vida y tu rendimiento
            </p>

            <h1
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-white leading-[0.95] mb-6 md:mb-8 fd-fade-up"
              style={{ animationDelay: "0.13s" }}
            >
              Despierta tu{" "}
              <span className="text-[#CCFF00] fd-text-glow">disciplina</span>,
              <br />
              potencia tu enfoque <br />y libera tu energía máxima.
            </h1>

            <p
              className="text-zinc-400 text-base md:text-xl max-w-xl mb-8 md:mb-10 leading-relaxed fd-fade-up"
              style={{ animationDelay: "0.18s" }}
            >
              Entrena tu mente y hábitos con cursos, protocolos y estrategias
              para hombres que quieren resultados reales. Disciplina auténtica.
              Energía sostenible. Propósito claro.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 fd-fade-up"
              style={{ animationDelay: "0.23s" }}
            >
              <Link
                to="/cursos"
                className="fd-btn-primary"
                data-testid="hero-cta-cursos"
              >
                Ver cursos <ArrowRight size={16} />
              </Link>

              <Link
                to="/contacto"
                className="fd-btn-secondary"
                data-testid="hero-cta-contacto"
              >
                Habla con nosotros
              </Link>
            </div>

            <div
              className="mt-12 md:mt-16 flex flex-wrap items-center gap-4 md:gap-6 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-zinc-500 fd-fade-up"
              style={{ animationDelay: "0.28s" }}
            >
              <span className="inline-flex items-center gap-2">
                <span className="text-[#CCFF00]">●</span>
                Construido en código
              </span>
              <span className="hidden sm:inline text-zinc-700">/</span>
              <span>1000 días de ejecución</span>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      {/* MARQUEE */}
      <section className="border-b border-white/10 bg-black py-7 md:py-10 overflow-hidden">
        <div className="fd-marquee-track">
          {Array.from({ length: 4 }).map((_, j) => (
            <div key={j} className="flex gap-12 items-center shrink-0 pr-12">
              {[
                "DISCIPLINA",
                "ENFOQUE",
                "ENERGÍA",
                "PROPÓSITO",
                "MENTALIDAD",
                "RENDIMIENTO",
                "TRANSFORMACIÓN",
              ].map((w, i) => (
                <span
                  key={`${j}-${i}`}
                  className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-tight text-transparent"
                  style={{ WebkitTextStroke: "1px rgba(255,255,255,0.18)" }}
                >
                  {w} <span className="text-[#CCFF00]">/</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* PILLARS */}
      <section
        className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-16 md:py-32"
        data-testid="pillars-section"
      >
        <div className="grid md:grid-cols-12 gap-8 md:gap-12 mb-12 md:mb-16">
          <div className="md:col-span-5">
            <p className="fd-overline mb-4">// Los 6 Pilares</p>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
              La fórmula de la{" "}
              <span className="text-[#CCFF00]">mejor versión</span> de ti.
            </h2>
          </div>

          <div className="md:col-span-6 md:col-start-7 flex items-end">
            <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
              No es motivación de fin de semana. Es un sistema construido sobre
              seis pilares medibles y entrenables, diseñado para hombres que
              quieren resultados duraderos, no humo.
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
                className="bg-[#0A0A0A] p-7 md:p-10 group hover:bg-[#121212] transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-[#CCFF00]/10 via-transparent to-transparent" />

                <div className="absolute top-6 right-6 text-xs font-mono text-zinc-700 group-hover:text-[#CCFF00]/60 transition-colors">
                  0{i + 1}
                </div>

                <Icon
                  size={32}
                  className="relative text-[#CCFF00] mb-6 group-hover:scale-110 transition-transform duration-300"
                  strokeWidth={1.5}
                />

                <h3 className="relative text-2xl font-black uppercase tracking-tight text-white mb-3">
                  {p.title}
                </h3>

                <p className="relative text-sm text-zinc-400 leading-relaxed">
                  {p.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section
        className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-16 md:py-32 border-t border-white/10"
        data-testid="featured-courses-section"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 md:mb-14">
          <div>
            <p className="fd-overline mb-4">// Cursos destacados</p>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter text-white max-w-xl">
              Programas diseñados para{" "}
              <span className="text-[#CCFF00]">desarrollar</span> tu mejor
              versión.
            </h2>
          </div>

          <Link
            to="/cursos"
            className="fd-btn-secondary w-full sm:w-auto"
            data-testid="featured-view-all"
          >
            Explorar todos los cursos <ArrowRight size={14} />
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
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#CCFF00]/5" />

                {c.featured && (
                  <span className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm border border-[#CCFF00]/50 text-[#CCFF00] text-[10px] px-2 py-1 uppercase tracking-widest font-mono">
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
                  Ver curso{" "}
                  <ArrowRight
                    size={12}
                    className="ml-2 transition-transform group-hover:translate-x-1"
                  />
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
        <img
          src={COMMUNITY_BG}
          alt="Comunidad Factor Dopamina"
          className="absolute top-0 left-0 h-full w-[115%] md:w-[100%] max-w-none object-cover opacity-60 md:opacity-70 translate-x-[2%] md:translate-x-[7%]"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/30 md:from-black/85 md:via-black/55 md:to-black/20" />
        <div className="absolute right-0 bottom-0 h-72 w-72 bg-[#CCFF00]/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-20 md:py-40">
          <div className="max-w-2xl">
            <p className="fd-overline mb-5 md:mb-6">// La comunidad</p>

            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-[1] mb-6 md:mb-8">
              No caminas solo. <br />
              <span className="text-[#CCFF00]">
                Crece junto a quienes también actúan.
              </span>
            </h2>

            <p className="text-zinc-300 text-base md:text-lg leading-relaxed mb-8 md:mb-10">
              Factor Dopamina es más que cursos: es un círculo de hombres
              decididos a mejorar. Multiplica tu disciplina, enfoque y energía
              junto a otros que también se esfuerzan.
            </p>

            <Link
              to="/cursos"
              className="fd-btn-primary w-full sm:w-auto"
              data-testid="community-cta"
            >
              Empieza ahora <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
