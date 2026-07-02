"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Check,
  FileCheck2,
  Zap,
  ShieldCheck,
  ArrowRight,
  Menu,
  X,
  ChevronDown,
  Mail,
} from "lucide-react";
import Logo from "@/components/Logo";

const FAQ_ITEMS = [
  {
    q: "¿Es realmente gratis?",
    a: "Sí. No pedimos tarjeta, no hay planes pagos escondidos y siempre va a existir una versión gratuita.",
  },
  {
    q: "¿Necesito registrarme?",
    a: "No. Completas tus datos y descargas tu currículum. No creamos una cuenta ni te pedimos contraseña.",
  },
  {
    q: "¿Guardan mis datos?",
    a: "No. Tu información vive solo en tu navegador mientras completas el formulario. No la guardamos en ningún servidor.",
  },
  {
    q: "¿Puedo guardar mi currículum para editarlo más adelante?",
    a: "Por ahora no hace falta ninguna cuenta: completas y descargas. Estamos trabajando en una opción para crear una cuenta gratuita y guardar tu currículum, para quien la quiera usar más adelante.",
  },
  {
    q: "¿Sirve si no tengo mucha experiencia laboral o estudios formales?",
    a: "Sí. Puedes completar solo las secciones que tengas: no hace falta llenar todo para generar un buen currículum.",
  },
  {
    q: "¿El documento sirve para sistemas ATS?",
    a: "Sí. El diseño usa una sola columna, texto real (no imágenes) y una estructura que los sistemas de selección automática pueden leer sin problemas.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item">
      <button className="faq-item__q" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span>{q}</span>
        <ChevronDown size={18} className={`faq-item__chev ${open ? "open" : ""}`} />
      </button>
      {open && <div className="faq-item__a">{a}</div>}
    </div>
  );
}

function CVMockup({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`cv-mock ${compact ? "cv-mock--compact" : ""}`}>
      <div className="cv-mock__badge">
        <FileCheck2 size={13} strokeWidth={2.4} />
        <span>Listo para ATS</span>
      </div>
      <div className="cv-mock__head">
        <div className="cv-mock__name">Alex Smith</div>
        <div className="cv-mock__role">Analista Financiero</div>
        <div className="cv-mock__contact">
          <span>alex@email.com</span>
          <span className="dot" />
          <span>+54 9 261 1234567</span>
          <span className="dot" />
          <span>linkedin.com/in/alexsmith</span>
        </div>
      </div>
      <div className="cv-mock__section">
        <div className="cv-mock__label">Perfil</div>
        <div className="cv-mock__line w-full" />
        <div className="cv-mock__line w-90" />
      </div>
      <div className="cv-mock__section">
        <div className="cv-mock__label">Experiencia</div>
        <div className="cv-mock__row">
          <div className="cv-mock__col">
            <div className="cv-mock__line w-60 strong" />
            <div className="cv-mock__line w-40" />
          </div>
          <div className="cv-mock__date">2022 — Actualidad</div>
        </div>
        <div className="cv-mock__bullets">
          <div className="cv-mock__line w-90" />
          <div className="cv-mock__line w-75" />
          <div className="cv-mock__line w-80" />
        </div>
      </div>
      <div className="cv-mock__section">
        <div className="cv-mock__label">Habilidades</div>
        <div className="cv-mock__chips">
          {["Excel", "Power BI", "SAP", "PowerPoint"].map((c) => (
            <span key={c} className="chip">
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepCard({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <div className="step-card">
      <div className="step-card__n">{n}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

export default function CvintaLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="w-full overflow-x-hidden">
      <div className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="container navbar__inner">
          <div className="logo">
            <Logo size={26} />
            CVinta
          </div>
          <div className="hidden md:flex items-center gap-2">
            <a href="#como-funciona" className="btn btn-ghost">
              Cómo funciona
            </a>
            <a href="#preguntas" className="btn btn-ghost">
              Preguntas
            </a>
            <Link href="/crear" className="btn btn-primary">
              Crear currículum
            </Link>
          </div>
          <button
            className="md:hidden bg-transparent border-none text-ink cursor-pointer p-1.5"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Abrir menú"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {menuOpen && (
          <div className="container flex flex-col gap-2 pb-4 border-t border-line pt-2">
            <a href="#como-funciona" className="btn btn-ghost justify-start">
              Cómo funciona
            </a>
            <a href="#preguntas" className="btn btn-ghost justify-start">
              Preguntas
            </a>
            <Link href="/crear" className="btn btn-primary justify-center">
              Crear currículum
            </Link>
          </div>
        )}
      </div>

      <section className="hero">
        <div className="container hero__grid">
          <div>
            <span className="eyebrow">
              <Zap size={13} /> Gratis, sin registro
            </span>
            <h1>¿Necesitas un currículum ya? Hazlo gratis, en minutos.</h1>
            <p className="hero__sub">
              Sin registrarte, sin complicaciones. <strong>Listo en menos de 3 minutos.</strong>
            </p>
            <div className="hero__cta-row">
              <Link href="/crear" className="btn btn-primary btn-lg">
                Crear mi currículum <ArrowRight size={16} />
              </Link>
              <span className="hero__hint">No pedimos tarjeta ni cuenta.</span>
            </div>
            <div className="benefits">
              <div className="benefit">
                <span className="icon-dot">
                  <Check size={12} strokeWidth={3} />
                </span>
                Gratis
              </div>
              <div className="benefit">
                <span className="icon-dot">
                  <FileCheck2 size={12} strokeWidth={2.5} />
                </span>
                Documento profesional
              </div>
              <div className="benefit">
                <span className="icon-dot">
                  <ShieldCheck size={12} strokeWidth={2.5} />
                </span>
                Compatible con ATS
              </div>
            </div>
          </div>
          <div className="hero__visual">
            <div className="hero__glow" />
            <CVMockup />
          </div>
        </div>
      </section>

      <section className="section" id="como-funciona">
        <div className="container">
          <div className="section-head">
            <h2>Cómo funciona</h2>
            <p>Tres pasos, sin vueltas.</p>
          </div>
          <div className="steps-grid">
            <StepCard
              n="01"
              title="Completa tus datos"
              text="Ingresa tu información personal, experiencia laboral, educación y habilidades."
            />
            <StepCard
              n="02"
              title="Revisa la vista previa"
              text="Comprueba que todo esté correcto antes de descargar, viendo los cambios en tiempo real."
            />
            <StepCard
              n="03"
              title="Descarga tu currículum"
              text="Se descarga en segundos, tal como lo ves en pantalla."
            />
          </div>
        </div>
      </section>

      <section className="preview-section">
        <div className="container" style={{ paddingTop: 64, paddingBottom: 64 }}>
          <div className="section-head">
            <h2>Un diseño único. Simple y profesional.</h2>
            <p>Minimalista y apto para los sistemas ATS que usan las empresas para filtrar currículums.</p>
          </div>
          <div className="preview-frame">
            <CVMockup compact />
          </div>
        </div>
      </section>

      <section className="section" id="preguntas">
        <div className="container" style={{ maxWidth: 720 }}>
          <div className="section-head">
            <h2>Preguntas frecuentes</h2>
          </div>
          <div className="faq-list">
            {FAQ_ITEMS.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer__inner">
          <div className="footer__logo">
            <Logo size={22} />
            <span className="brand-line">CVinta</span>
          </div>
          <p>Un currículum simple, para cualquier persona, en cualquier trabajo.</p>
          <p>Siempre existirá una versión gratuita.</p>
          <a className="footer__contact" href="mailto:hola@cvinta.com">
            <Mail size={14} /> hola@cvinta.com
          </a>
        </div>
      </footer>
    </div>
  );
}
