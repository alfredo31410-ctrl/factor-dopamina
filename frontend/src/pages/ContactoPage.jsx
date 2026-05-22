import { useState } from "react";
import { Send, Mail, MapPin, Instagram } from "lucide-react";
import api, { formatApiError } from "../lib/api";
import { toast } from "sonner";

export default function ContactoPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post("/contact", form);
      toast.success("Mensaje enviado. Te responderemos pronto.");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      toast.error(
        formatApiError(err.response?.data?.detail) || "Error al enviar",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" data-testid="contacto-page">
      <section className="border-b border-white/10 fd-molecular-bg">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-20 md:py-32">
          <p className="fd-overline mb-5 md:mb-6">// Contacto</p>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-[0.95]">
            Hablemos <span className="text-[#CCFF00]">sin rodeos</span>.
          </h1>

          <p className="text-zinc-400 text-base md:text-lg mt-6 max-w-2xl leading-relaxed">
            ¿Tienes preguntas sobre cursos, alianzas o nuestra comunidad?
            Escríbenos y te responderemos rápido con claridad y precisión.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-14 md:py-20 grid md:grid-cols-12 gap-10 md:gap-12">
        <div className="md:col-span-7">
          <form
            onSubmit={onSubmit}
            className="space-y-5 md:space-y-6"
            data-testid="contact-form"
          >
            <div>
              <label className="fd-overline block mb-2">Nombre</label>

              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-[#121212] border border-white/10 focus:border-[#CCFF00] outline-none text-white p-4 font-mono text-sm transition-colors"
                placeholder="Ingresa tu nombre completo"
                data-testid="contact-name-input"
              />
            </div>

            <div>
              <label className="fd-overline block mb-2">Correo</label>

              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-[#121212] border border-white/10 focus:border-[#CCFF00] outline-none text-white p-4 font-mono text-sm transition-colors"
                placeholder="ejemplo@correo.com"
                data-testid="contact-email-input"
              />
            </div>

            <div>
              <label className="fd-overline block mb-2">Mensaje</label>

              <textarea
                required
                rows={6}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-[#121212] border border-white/10 focus:border-[#CCFF00] outline-none text-white p-4 font-mono text-sm transition-colors resize-none"
                placeholder="Cuéntanos qué necesitas o cómo podemos ayudarte"
                data-testid="contact-message-input"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="fd-btn-primary w-full sm:w-auto disabled:opacity-50"
              data-testid="contact-submit-button"
            >
              {submitting ? "Enviando..." : "Enviar mensaje"} <Send size={14} />
            </button>
          </form>
        </div>

        <div className="md:col-span-4 md:col-start-9 space-y-5 md:space-y-8">
          <div className="border border-white/10 p-5 md:p-6 bg-[#0A0A0A]">
            <Mail size={20} className="text-[#CCFF00] mb-3" />

            <p className="fd-overline mb-2">Email</p>

            <p className="text-white font-mono text-sm break-all">
              contacto@factordopamina.com
            </p>
          </div>

          <div className="border border-white/10 p-5 md:p-6 bg-[#0A0A0A]">
            <Instagram size={20} className="text-[#CCFF00] mb-3" />

            <p className="fd-overline mb-2">Instagram</p>

            <p className="text-white font-mono text-sm">@factordopamina</p>
          </div>

          <div className="border border-white/10 p-5 md:p-6 bg-[#0A0A0A]">
            <MapPin size={20} className="text-[#CCFF00] mb-3" />

            <p className="fd-overline mb-2">Comunidad</p>

            <p className="text-white text-sm leading-relaxed">
              Únete a nuestra comunidad global de habla hispana.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}