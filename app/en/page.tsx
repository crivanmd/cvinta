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
  Instagram,
  Linkedin,
} from "lucide-react";
import Logo from "@/components/Logo";

const FAQ_ITEMS = [
  {
    q: "Is it really free?",
    a: "Yes, downloading included. Many tools let you build your resume for free but ask you to pay right when you try to download it — that doesn't happen here. No card required, no hidden paid plans, and there will always be a free version.",
  },
  {
    q: "Do I need to sign up?",
    a: "No. You fill in your info and download your resume. We don't create an account or ask for a password.",
  },
  {
    q: "Do you store my data?",
    a: "No. Your information only lives in your browser while you fill out the form. We don't save it on any server.",
  },
  {
    q: "Can I save my resume to edit it later?",
    a: "For now, no account is needed: you fill it in and download it. We're working on an optional free account to save your resume, for anyone who wants to use it later.",
  },
  {
    q: "Does it work if I don't have much work experience or formal education?",
    a: "Yes. You can fill in only the sections you have — you don't need to complete everything to get a good resume.",
  },
  {
    q: "Does the document work with ATS systems?",
    a: "Yes. The design uses a single column, real text (not images), and a structure that applicant tracking systems can read without issues.",
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
        <span>ATS ready</span>
      </div>
      <div className="cv-mock__head">
        <div className="cv-mock__name">Alex Smith</div>
        <div className="cv-mock__role">Financial Analyst</div>
        <div className="cv-mock__contact">
          <span>alex@email.com</span>
          <span className="dot" />
          <span>+54 9 261 1234567</span>
          <span className="dot" />
          <span>linkedin.com/in/alexsmith</span>
        </div>
      </div>
      <div className="cv-mock__section">
        <div className="cv-mock__label">Profile</div>
        <div className="cv-mock__line w-full" />
        <div className="cv-mock__line w-90" />
      </div>
      <div className="cv-mock__section">
        <div className="cv-mock__label">Experience</div>
        <div className="cv-mock__row">
          <div className="cv-mock__col">
            <div className="cv-mock__line w-60 strong" />
            <div className="cv-mock__line w-40" />
          </div>
          <div className="cv-mock__date">2022 — Present</div>
        </div>
        <div className="cv-mock__bullets">
          <div className="cv-mock__line w-90" />
          <div className="cv-mock__line w-75" />
          <div className="cv-mock__line w-80" />
        </div>
      </div>
      <div className="cv-mock__section">
        <div className="cv-mock__label">Skills</div>
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

export default function CvintaLandingEN() {
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
            <Logo size={32} />
            CVinta
          </div>
          <div className="hidden md:flex items-center gap-2">
            <a href="#como-funciona" className="btn btn-ghost">
              How it works
            </a>
            <a href="#preguntas" className="btn btn-ghost">
              FAQ
            </a>
            <Link href="/" className="lang-switch">ES</Link>
            <Link href="/en/crear" className="btn btn-primary">
              Create resume
            </Link>
          </div>
          <button
            className="md:hidden bg-transparent border-none text-ink cursor-pointer p-2.5 -mr-2.5 flex items-center justify-center"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Open menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {menuOpen && (
          <div className="container flex flex-col gap-2 pb-4 border-t border-line pt-2">
            <a href="#como-funciona" className="btn btn-ghost justify-start">
              How it works
            </a>
            <a href="#preguntas" className="btn btn-ghost justify-start">
              FAQ
            </a>
            <Link href="/" className="btn btn-ghost justify-start">
              🌐 Español
            </Link>
            <Link href="/en/crear" className="btn btn-primary justify-center">
              Create resume
            </Link>
          </div>
        )}
      </div>

      <section className="hero">
        <div className="container hero__grid">
          <div>
            <span className="eyebrow">
              <Zap size={13} /> 100% free, even the download
            </span>
            <h1>Need a resume now? Make it free, in minutes.</h1>
            <p className="hero__sub">
              No sign-up, no hassle. <strong>Ready in under 3 minutes.</strong>
            </p>
            <div className="hero__cta-row">
              <Link href="/en/crear" className="btn btn-primary btn-lg">
                Create my resume <ArrowRight size={16} />
              </Link>
              <span className="hero__hint">No card, no account needed.</span>
            </div>
            <div className="benefits">
              <div className="benefit">
                <span className="icon-dot">
                  <Check size={12} strokeWidth={3} />
                </span>
                No sign-up
              </div>
              <div className="benefit">
                <span className="icon-dot">
                  <FileCheck2 size={12} strokeWidth={2.5} />
                </span>
                Professional document
              </div>
              <div className="benefit">
                <span className="icon-dot">
                  <ShieldCheck size={12} strokeWidth={2.5} />
                </span>
                ATS-friendly
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
            <h2>How it works</h2>
            <p>Three steps, no fuss.</p>
          </div>
          <div className="steps-grid">
            <StepCard
              n="01"
              title="Fill in your info"
              text="Add your personal details, work experience, education and skills."
            />
            <StepCard
              n="02"
              title="Check the preview"
              text="See your resume update live, and make sure everything looks right before downloading."
            />
            <StepCard
              n="03"
              title="Download your resume"
              text="It downloads in seconds, exactly as you see it on screen."
            />
          </div>
        </div>
      </section>

      <section className="preview-section">
        <div className="container" style={{ paddingTop: 64, paddingBottom: 64 }}>
          <div className="section-head">
            <h2>One design. Simple and professional.</h2>
            <p>Minimalist and built to pass the ATS systems companies use to screen resumes.</p>
          </div>
          <div className="preview-frame">
            <CVMockup compact />
          </div>
        </div>
      </section>

      <section className="section" id="preguntas">
        <div className="container" style={{ maxWidth: 720 }}>
          <div className="section-head">
            <h2>Frequently asked questions</h2>
            <p>Everything you need to know before you start.</p>
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
            <Logo size={26} />
            <span className="brand-line">CVinta</span>
          </div>
          <p>A simple resume, for anyone, for any job.</p>
          <p>There will always be a free version.</p>
          <a className="footer__contact" href="mailto:hola@cvinta.com">
            <Mail size={14} /> hola@cvinta.com
          </a>
          <div className="footer__social">
            <span className="footer__social-item" aria-disabled="true">
              <Instagram size={16} />
            </span>
            <span className="footer__social-item" aria-disabled="true">
              <Linkedin size={16} />
            </span>
            <span className="footer__social-note">Coming soon</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
