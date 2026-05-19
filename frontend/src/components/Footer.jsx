import { Link } from "react-router-dom";
import { Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="border-t border-white/10 bg-black mt-32"
      data-testid="main-footer"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 grid md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 border border-[#CCFF00] flex items-center justify-center">
              <span className="text-[#CCFF00] font-black font-mono">FD</span>
            </div>
            <span className="font-black tracking-tight text-white uppercase text-lg">
              Factor <span className="text-[#CCFF00]">Dopamina</span>
            </span>
          </div>
          <p className="text-zinc-500 text-sm leading-relaxed max-w-md">
            La plataforma para hombres que decidieron dejar de vivir en
            automático. Disciplina, energía y propósito — sin filtros, sin
            atajos.
          </p>
        </div>

        <div className="md:col-span-3">
          <p className="fd-overline mb-4">Navegación</p>
          <ul className="space-y-3 text-sm text-zinc-400">
            <li>
              <Link to="/" className="fd-link" data-testid="footer-link-home">
                Inicio
              </Link>
            </li>
            <li>
              <Link
                to="/cursos"
                className="fd-link"
                data-testid="footer-link-cursos"
              >
                Cursos
              </Link>
            </li>
            <li>
              <Link
                to="/contacto"
                className="fd-link"
                data-testid="footer-link-contacto"
              >
                Contacto
              </Link>
            </li>
            <li>
              <Link
                to="/admin"
                className="fd-link"
                data-testid="footer-link-admin"
              >
                Admin
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <p className="fd-overline mb-4">Comunidad</p>
          <p className="text-sm text-zinc-400 mb-5">
            Únete al circulo de hombres que están construyendo la mejor versión
            de sí mismos.
          </p>
          <div className="flex gap-3">
            <a
              href="#"
              data-testid="social-instagram"
              className="w-10 h-10 border border-white/10 hover:border-[#CCFF00] hover:text-[#CCFF00] text-zinc-400 flex items-center justify-center transition-colors"
            >
              <Instagram size={16} />
            </a>
            <a
              href="#"
              data-testid="social-twitter"
              className="w-10 h-10 border border-white/10 hover:border-[#CCFF00] hover:text-[#CCFF00] text-zinc-400 flex items-center justify-center transition-colors"
            >
              <Twitter size={16} />
            </a>
            <a
              href="#"
              data-testid="social-youtube"
              className="w-10 h-10 border border-white/10 hover:border-[#CCFF00] hover:text-[#CCFF00] text-zinc-400 flex items-center justify-center transition-colors"
            >
              <Youtube size={16} />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 flex flex-col md:flex-row justify-between gap-3 text-xs text-zinc-600 font-mono uppercase tracking-wider">
          <span>
            © {new Date().getFullYear()} Factor Dopamina · factordopamina.com
          </span>
          <span>Construido para hombres en evolución</span>
        </div>
      </div>
    </footer>
  );
}
