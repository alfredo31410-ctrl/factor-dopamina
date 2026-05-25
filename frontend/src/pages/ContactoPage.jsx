import { useState } from "react";
import { Send, Mail, MapPin, Instagram, Sparkles, MessageCircle } from "lucide-react";
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
        formatApiError(err.response?.data?.detail) || "Error al enviar"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputClassName =
    "w-full bg-[#0D0D0D] border border-white/10 focus:border-[#CCFF00]/70 hover:border-white/20 outline-none text-white p-4 font-mono text-sm transition-colors placeholder:text-zinc-600 disabled:opacity-60";

  const contactCards = [
    {
      icon: Mail,
      label: "Email",
      value: "contacto@factordopamina.com",
      description: "Para dudas sobre programas, accesos o colaboraciones.",
    },
    {
      icon: Instagram,
      label: "Instagram",
      value: "@factordopamina",
      description: "Contenido, comunidad y próximos lanzamientos.",
    },
    {
      icon: MapPin,
      label: "Comunidad",
      value: "Global · Habla hispana",
      description: "Una red para construir hábitos, enfoque y dirección.",
    },
  ];

  return (
    <div className="min-h-screen" data-testid="contacto-page">
      <section className="relative overflow-hidden border-b border-white/10 fd-molecular-bg">
        <div className="absolute -right-24 top-20 h-72 w-72 rounded-full bg-[#CCFF00]/10 blur-3xl" />
        <div className="absolute left-0 bottom-0 h-px w-full bg-gradient-to-r from-transparent via-[#CCFF00]/30 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-20 md:py-32">
          <div className="inline-flex items-center gap-2 border border-[#CCFF00]/30 bg-black/40 px-3 py-2 text-[10px] sm:text-xs font-mono uppercase tracking-[0.22em] text-[#CCFF00] mb-6">
            <Sparkles size={14} />
            Contacto directo
          </div>

          <p className="fd-overline mb-5 md:mb-6">// Contacto</p>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-[0.95] max-w-4xl">
            Hablemos <span className="text-[#CCFF00] fd-text-glow">sin rodeos</span>.
          </h1>

          <p className="text-zinc-400 text-base md:text-lg mt-6 max-w-2xl leading-relaxed">
            ¿Tienes preguntas sobre cursos, alianzas o nuestra comunidad?
            Escríbenos y te responderemos rápido con claridad y precisión.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-14 md:py-20 grid md:grid-cols-12 gap-10 md:gap-12">
        <div className="md:col-span-7">
          <div className="relative">
            <div className="absolute -inset-3 bg-[#CCFF00]/5 blur-2xl" />

            <form
              onSubmit={onSubmit}
              className="relative border border-white/10 bg-[#0A0A0A] p-5 sm:p-6 md:p-8 space-y-5 md:space-y-6"
              data-testid="contact-form"
            >
              <div className="flex items-start gap-4 border-b border-white/10 pb-6">
                <div className="w-10 h-10 shrink-0 border border-[#CCFF00]/40 flex items-center justify-center text-[#CCFF00]">
                  <MessageCircle size={18} />
                </div>

                <div>
                  <p className="text-white font-black uppercase tracking-tight">
                    Envíanos tu mensaje
                  </p>
                  <p className="text-zinc-500 text-sm leading-relaxed mt-1">
                    Cuéntanos qué necesitas y te responderemos con una ruta clara.
                  </p>
                </div>
              </div>

              <div>
                <label className="fd-overline block mb-2">Nombre</label>

                <input
                  type="text"
                  required
                  disabled={submitting}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClassName}
                  placeholder="Ingresa tu nombre completo"
                  data-testid="contact-name-input"
                />
              </div>

              <div>
                <label className="fd-overline block mb-2">Correo</label>

                <input
                  type="email"
                  required
                  disabled={submitting}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClassName}
                  placeholder="ejemplo@correo.com"
                  data-testid="contact-email-input"
                />
              </div>

              <div>
                <label className="fd-overline block mb-2">Mensaje</label>

                <textarea
                  required
                  rows={6}
                  disabled={submitting}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className={`${inputClassName} resize-none`}
                  placeholder="Cuéntanos qué necesitas o cómo podemos ayudarte"
                  data-testid="contact-message-input"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="fd-btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="contact-submit-button"
                >
                  {submitting ? "Enviando..." : "Enviar mensaje"}{" "}
                  <Send size={14} />
                </button>

                <p className="text-xs text-zinc-500 leading-relaxed">
                  Respondemos con claridad. Sin spam. Sin vueltas innecesarias.
                </p>
              </div>
            </form>
          </div>
        </div>

        <div className="md:col-span-4 md:col-start-9 space-y-5 md:space-y-6">
          {contactCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.label}
                className="group border border-white/10 p-5 md:p-6 bg-[#0A0A0A] hover:bg-[#121212] hover:border-[#CCFF00]/30 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-[#CCFF00]/10 via-transparent to-transparent" />

                <div className="relative">
                  <Icon size={20} className="text-[#CCFF00] mb-3" />

                  <p className="fd-overline mb-2">{card.label}</p>

                  <p className="text-white font-mono text-sm break-all mb-3">
                    {card.value}
                  </p>

                  <p className="text-zinc-500 text-sm leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}

          <div className="border border-[#CCFF00]/20 bg-[#CCFF00]/5 p-5 md:p-6">
            <p className="fd-overline mb-3">// Respuesta directa</p>
            <p className="text-zinc-300 text-sm leading-relaxed">
              Si tu mensaje tiene que ver con cursos, accesos o alianzas,
              escríbenos con el mayor contexto posible para ayudarte mejor.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}