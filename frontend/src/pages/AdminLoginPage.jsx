import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { formatApiError } from "../lib/api";
import { LogIn, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/admin" replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (e2) {
      setErr(
        formatApiError(e2.response?.data?.detail) || "Error al iniciar sesión",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6 fd-molecular-bg"
      data-testid="admin-login-page"
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 border border-[#CCFF00] mb-6">
            <span className="text-[#CCFF00] font-black font-mono text-lg">
              FD
            </span>
          </div>
          <p className="fd-overline mb-3">// Acceso restringido</p>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">
            Panel <span className="text-[#CCFF00]">admin</span>
          </h1>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-5 border border-white/10 bg-[#121212] p-8"
        >
          {err && (
            <div className="flex gap-2 items-start text-red-400 text-xs font-mono bg-red-500/10 border border-red-500/30 p-3">
              <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
              <span data-testid="login-error">{err}</span>
            </div>
          )}
          <div>
            <label className="fd-overline block mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-white/10 focus:border-[#CCFF00] outline-none text-white p-3 font-mono text-sm"
              data-testid="login-email-input"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="fd-overline block mb-2">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-white/10 focus:border-[#CCFF00] outline-none text-white p-3 font-mono text-sm"
              data-testid="login-password-input"
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="fd-btn-primary w-full disabled:opacity-50"
            data-testid="login-submit-button"
          >
            {loading ? "Entrando..." : "Iniciar sesión"} <LogIn size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
