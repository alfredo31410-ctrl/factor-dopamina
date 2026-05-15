import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { to: "/", label: "Inicio" },
  { to: "/cursos", label: "Cursos" },
  { to: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/70 border-b border-white/10"
      data-testid="main-navbar"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" data-testid="navbar-logo">
          <div className="w-8 h-8 border border-[#CCFF00] flex items-center justify-center">
            <span className="text-[#CCFF00] font-black text-sm font-mono">FD</span>
          </div>
          <span className="font-black tracking-tight text-white text-sm uppercase">
            Factor <span className="text-[#CCFF00]">Dopamina</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              data-testid={`nav-link-${l.label.toLowerCase()}`}
              className={({ isActive }) =>
                `text-xs font-bold uppercase tracking-[0.2em] fd-link ${
                  isActive ? "text-[#CCFF00]" : "text-zinc-400"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <button
            onClick={() => navigate("/cursos")}
            className="fd-btn-primary text-xs"
            data-testid="navbar-cta-button"
          >
            Ver Cursos
          </button>
        </nav>

        <button
          className="md:hidden text-white"
          onClick={() => setOpen((o) => !o)}
          data-testid="navbar-mobile-toggle"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-black/95 border-b border-white/10 px-6 py-6 space-y-5">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              onClick={() => setOpen(false)}
              data-testid={`mobile-nav-${l.label.toLowerCase()}`}
              className={({ isActive }) =>
                `block text-sm font-bold uppercase tracking-[0.2em] ${
                  isActive ? "text-[#CCFF00]" : "text-zinc-300"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <button
            onClick={() => {
              setOpen(false);
              navigate("/cursos");
            }}
            className="fd-btn-primary w-full"
            data-testid="mobile-cta-button"
          >
            Ver Cursos
          </button>
        </div>
      )}
    </header>
  );
}
