"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Briefcase,
  GraduationCap,
  Sparkles,
  Plus,
  Trash2,
  X,
  Languages,
  Award,
  Layers,
  FileDown,
  FileText,
  ChevronDown,
  Loader2,
  Eye,
  Pencil,
} from "lucide-react";
import Logo from "@/components/Logo";
import CVPreview from "@/components/CVPreview";
import { downloadCVAsPdf } from "@/lib/downloadPdf";
import { downloadCVAsDocx } from "@/lib/downloadDocx";
import { CVData } from "@/lib/types";
const NIVELES = ["Basic", "Intermediate", "Advanced", "Native"];

async function mejorarTextoConIA(texto: string, contexto: "perfil" | "experiencia") {
  const res = await fetch("/api/mejorar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texto, contexto }),
  });
  if (!res.ok) throw new Error("Couldn't improve the text");
  const data = await res.json();
  return data.mejorado as string;
}

function Section({
  icon,
  title,
  children,
  right,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="form-section">
      <div className="form-section__head">
        <div className="form-section__title">
          <span className="form-section__icon">{icon}</span>
          <h3>{title}</h3>
        </div>
        {right}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Field({
  label,
  error,
  ...props
}: { label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <input className="field__input" {...props} />
      {error && <span className="ai-error" style={{ marginTop: 0 }}>{error}</span>}
    </label>
  );
}

const MESES_NOMBRES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const ANIO_ACTUAL = new Date().getFullYear();
const ANIOS = Array.from({ length: 61 }, (_, i) => ANIO_ACTUAL - i);

function MonthYearPicker({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const [anio, mes] = value ? value.split("-") : ["", ""];

  const handleMes = (nuevoMes: string) => {
    if (!nuevoMes) return onChange("");
    onChange(`${anio || ANIO_ACTUAL}-${nuevoMes}`);
  };
  const handleAnio = (nuevoAnio: string) => {
    if (!nuevoAnio) return onChange("");
    onChange(`${nuevoAnio}-${mes || "01"}`);
  };

  return (
    <div style={{ display: "flex", gap: 6 }}>
      <select
        className="field__select"
        value={mes}
        onChange={(e) => handleMes(e.target.value)}
        disabled={disabled}
        style={{ flex: 1.3 }}
      >
        <option value="">Month</option>
        {MESES_NOMBRES.map((nombre, i) => (
          <option key={nombre} value={String(i + 1).padStart(2, "0")}>
            {nombre}
          </option>
        ))}
      </select>
      <select
        className="field__select"
        value={anio}
        onChange={(e) => handleAnio(e.target.value)}
        disabled={disabled}
        style={{ flex: 1 }}
      >
        <option value="">Year</option>
        {ANIOS.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>
    </div>
  );
}

let idCounter = 1;
const nextId = () => idCounter++;

export default function CreateResumeEN() {
  const [mobileTab, setMobileTab] = useState<"editar" | "preview">("editar");
  const previewRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const [personal, setPersonal] = useState({
    nombre: "",
    email: "",
    telefono: "",
    ciudad: "",
    pais: "",
    linkedin: "",
    web: "",
  });

  const [perfil, setPerfil] = useState("");
  const [enhancingPerfil, setEnhancingPerfil] = useState(false);
  const [perfilError, setPerfilError] = useState("");

  const [experiencias, setExperiencias] = useState([
    { id: 0, empresa: "", cargo: "", inicio: "", fin: "", actual: false, descripcion: "", enhancing: false, error: "" },
  ]);

  const [educacion, setEducacion] = useState([
    { id: 0, institucion: "", titulo: "", inicio: "", fin: "", actual: false },
  ]);

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const [idiomas, setIdiomas] = useState([{ id: 0, idioma: "", nivel: "Intermedio" }]);
  const [certificaciones, setCertificaciones] = useState<{ id: number; texto: string }[]>([]);
  const [seccionesPersonalizadas, setSeccionesPersonalizadas] = useState<
    { id: number; titulo: string; contenido: string }[]
  >([]);

  const addExperiencia = () =>
    setExperiencias((xs) => [
      ...xs,
      { id: nextId(), empresa: "", cargo: "", inicio: "", fin: "", actual: false, descripcion: "", enhancing: false, error: "" },
    ]);
  const removeExperiencia = (id: number) => setExperiencias((xs) => xs.filter((x) => x.id !== id));
  const updateExperiencia = (id: number, field: string, value: string | boolean) =>
    setExperiencias((xs) =>
      xs.map((x) => {
        if (x.id !== id) return x;
        const updated = { ...x, [field]: value };
        // Si marca "actual", limpiamos la fecha de fin para no mostrar las dos cosas
        if (field === "actual" && value === true) updated.fin = "";
        return updated;
      })
    );

  const mejorarExperiencia = async (id: number) => {
    const exp = experiencias.find((x) => x.id === id);
    if (!exp || !exp.descripcion.trim()) return;
    updateExperiencia(id, "enhancing", true);
    updateExperiencia(id, "error", "");
    try {
      const mejorado = await mejorarTextoConIA(exp.descripcion, "experiencia");
      updateExperiencia(id, "descripcion", mejorado);
    } catch {
      updateExperiencia(id, "error", "Couldn't improve the text. Please try again.");
    } finally {
      updateExperiencia(id, "enhancing", false);
    }
  };

  const addEducacion = () =>
    setEducacion((xs) => [...xs, { id: nextId(), institucion: "", titulo: "", inicio: "", fin: "", actual: false }]);
  const removeEducacion = (id: number) => setEducacion((xs) => xs.filter((x) => x.id !== id));
  const updateEducacion = (id: number, field: string, value: string | boolean) =>
    setEducacion((xs) =>
      xs.map((x) => {
        if (x.id !== id) return x;
        const updated = { ...x, [field]: value };
        if (field === "actual" && value === true) updated.fin = "";
        return updated;
      })
    );

  const addSkill = (raw: string) => {
    const value = raw.trim();
    if (!value) return;
    setSkills((s) => (s.some((x) => x.toLowerCase() === value.toLowerCase()) ? s : [...s, value]));
    setSkillInput("");
  };
  const removeSkill = (value: string) => setSkills((s) => s.filter((x) => x !== value));
  const onSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  const addIdioma = () => setIdiomas((xs) => [...xs, { id: nextId(), idioma: "", nivel: "Intermedio" }]);
  const removeIdioma = (id: number) => setIdiomas((xs) => xs.filter((x) => x.id !== id));
  const updateIdioma = (id: number, field: string, value: string) =>
    setIdiomas((xs) => xs.map((x) => (x.id === id ? { ...x, [field]: value } : x)));

  const addCertificacion = () => setCertificaciones((xs) => [...xs, { id: nextId(), texto: "" }]);
  const removeCertificacion = (id: number) => setCertificaciones((xs) => xs.filter((x) => x.id !== id));
  const updateCertificacion = (id: number, value: string) =>
    setCertificaciones((xs) => xs.map((x) => (x.id === id ? { ...x, texto: value } : x)));

  const addSeccionPersonalizada = () =>
    setSeccionesPersonalizadas((xs) => [...xs, { id: nextId(), titulo: "", contenido: "" }]);
  const removeSeccionPersonalizada = (id: number) =>
    setSeccionesPersonalizadas((xs) => xs.filter((x) => x.id !== id));
  const updateSeccionPersonalizada = (id: number, field: "titulo" | "contenido", value: string) =>
    setSeccionesPersonalizadas((xs) => xs.map((x) => (x.id === id ? { ...x, [field]: value } : x)));

  const mejorarPerfil = async () => {
    if (!perfil.trim()) return;
    setEnhancingPerfil(true);
    setPerfilError("");
    try {
      const mejorado = await mejorarTextoConIA(perfil, "perfil");
      setPerfil(mejorado);
    } catch {
      setPerfilError("Couldn't improve the text. Please try again.");
    } finally {
      setEnhancingPerfil(false);
    }
  };

  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);
  const downloadMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(e.target as Node)) {
        setDownloadMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const nombreBase = personal.nombre ? `CV - ${personal.nombre}` : "CV";

  const handleDownloadPdf = async () => {
    if (!previewRef.current) return;
    setDownloadMenuOpen(false);
    setDownloading(true);
    try {
      await downloadCVAsPdf(previewRef.current, `${nombreBase}.pdf`);
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadDocx = async () => {
    setDownloadMenuOpen(false);
    setDownloading(true);
    try {
      await downloadCVAsDocx(data, `${nombreBase}.docx`, "en");
    } finally {
      setDownloading(false);
    }
  };

  const data: CVData = { personal, perfil, experiencias, educacion, skills, idiomas, certificaciones, seccionesPersonalizadas };

  return (
    <div className="w-full">
      <div className="mobile-tabs">
        <button
          className={`mobile-tab ${mobileTab === "editar" ? "active" : ""}`}
          onClick={() => setMobileTab("editar")}
        >
          <Pencil size={15} /> Edit
        </button>
        <button
          className={`mobile-tab ${mobileTab === "preview" ? "active" : ""}`}
          onClick={() => setMobileTab("preview")}
        >
          <Eye size={15} /> Preview
        </button>
      </div>

      <div className="layout">
        <div className={`form-col ${mobileTab !== "editar" ? "hidden-mobile" : ""}`}>
          <div className="form-header">
            <Link href="/en" className="logo mb-4" style={{ textDecoration: "none", color: "inherit" }}>
              <Logo size={26} />
              CVinta
            </Link>
            <h1>Fill in your resume</h1>
            <p>The preview updates live, on the right.</p>
          </div>

          <Section icon={<User size={15} />} title="Personal details">
            <div className="grid-2">
              <Field
                label="Full name"
                value={personal.nombre}
                onChange={(e) => setPersonal({ ...personal, nombre: e.target.value })}
                placeholder="Alex Smith"
                maxLength={80}
              />
              <Field
                label="Email"
                type="email"
                value={personal.email}
                onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
                onBlur={() => setEmailTouched(true)}
                placeholder="alex@email.com"
                maxLength={100}
                error={
                  emailTouched && personal.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal.email)
                    ? "Check the email format."
                    : undefined
                }
              />
              <Field
                label="Phone"
                value={personal.telefono}
                onChange={(e) => setPersonal({ ...personal, telefono: e.target.value })}
                placeholder="+1 555 123 4567"
                maxLength={25}
              />
              <Field
                label="City"
                value={personal.ciudad}
                onChange={(e) => setPersonal({ ...personal, ciudad: e.target.value })}
                placeholder="Austin"
                maxLength={50}
              />
              <Field
                label="Country"
                value={personal.pais}
                onChange={(e) => setPersonal({ ...personal, pais: e.target.value })}
                placeholder="United States"
                maxLength={50}
              />
              <Field
                label="LinkedIn"
                value={personal.linkedin}
                onChange={(e) => setPersonal({ ...personal, linkedin: e.target.value })}
                placeholder="linkedin.com/in/alexsmith"
                maxLength={100}
              />
              <Field
                label="Website (optional)"
                value={personal.web}
                onChange={(e) => setPersonal({ ...personal, web: e.target.value })}
                placeholder="alexsmith.com"
                maxLength={100}
              />
            </div>
          </Section>

          <Section
            icon={<Sparkles size={15} />}
            title="Professional profile"
            right={
              <button
                className="ai-btn"
                disabled={enhancingPerfil || !perfil.trim()}
                onClick={mejorarPerfil}
              >
                {enhancingPerfil ? <Loader2 size={13} className="spin" /> : <Sparkles size={13} />}
                Improve with AI
              </button>
            }
          >
            <textarea
              className="field__textarea"
              value={perfil}
              onChange={(e) => setPerfil(e.target.value.slice(0, 500))}
              maxLength={500}
              placeholder="Financial analyst with experience in budget control, cost analysis and reporting."
            />
            <div className="field-hint" style={{ textAlign: "right" }}>
              {perfil.length}/500
            </div>
            {perfilError && <div className="ai-error">{perfilError}</div>}
          </Section>

          <Section icon={<Briefcase size={15} />} title="Experience">
            {experiencias.map((exp, i) => (
              <div className="exp-card" key={exp.id}>
                <div className="exp-card__top">
                  <span className="exp-card__label">Experience {i + 1}</span>
                  {experiencias.length > 1 && (
                    <button
                      className="icon-btn"
                      onClick={() => removeExperiencia(exp.id)}
                      aria-label="Remove experience"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
                <div className="grid-2" style={{ marginBottom: 10 }}>
                  <Field
                    label="Company"
                    value={exp.empresa}
                    onChange={(e) => updateExperiencia(exp.id, "empresa", e.target.value)}
                    placeholder="Company ABC"
                    maxLength={80}
                  />
                  <Field
                    label="Role"
                    value={exp.cargo}
                    onChange={(e) => updateExperiencia(exp.id, "cargo", e.target.value)}
                    placeholder="Financial Analyst"
                    maxLength={80}
                  />
                  <label className="field">
                    <span className="field__label">Start date</span>
                    <MonthYearPicker
                      value={exp.inicio}
                      onChange={(v) => updateExperiencia(exp.id, "inicio", v)}
                    />
                  </label>
                  <div className="field">
                    <span className="field__label">End date</span>
                    <MonthYearPicker
                      value={exp.fin}
                      onChange={(v) => updateExperiencia(exp.id, "fin", v)}
                      disabled={exp.actual}
                    />
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginTop: 6,
                        fontSize: 12.5,
                        color: "var(--ink-soft)",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={exp.actual}
                        onChange={(e) => updateExperiencia(exp.id, "actual", e.target.checked)}
                      />
                      I currently work here
                    </label>
                  </div>
                </div>
                <label className="field">
                  <span
                    className="field__label"
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                  >
                    Description
                    <button
                      className="ai-btn"
                      disabled={exp.enhancing || !exp.descripcion.trim()}
                      onClick={() => mejorarExperiencia(exp.id)}
                    >
                      {exp.enhancing ? <Loader2 size={13} className="spin" /> : <Sparkles size={13} />}
                      Improve with AI
                    </button>
                  </span>
                  <textarea
                    className="field__textarea"
                    value={exp.descripcion}
                    onChange={(e) => updateExperiencia(exp.id, "descripcion", e.target.value.slice(0, 600))}
                    maxLength={600}
                    placeholder={
                      "Prepared financial reports.\nManaged budget control.\nAutomated Excel processes."
                    }
                  />
                </label>
                <div className="field-hint" style={{ textAlign: "right" }}>
                  {exp.descripcion.length}/600
                </div>
                {exp.error && <div className="ai-error">{exp.error}</div>}
              </div>
            ))}
            <button className="add-btn" onClick={addExperiencia}>
              <Plus size={15} /> Add another experience
            </button>
          </Section>

          <Section icon={<GraduationCap size={15} />} title="Education">
            {educacion.map((edu, i) => (
              <div className="exp-card" key={edu.id}>
                <div className="exp-card__top">
                  <span className="exp-card__label">Education {i + 1}</span>
                  {educacion.length > 1 && (
                    <button
                      className="icon-btn"
                      onClick={() => removeEducacion(edu.id)}
                      aria-label="Remove education"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
                <div className="grid-2">
                  <Field
                    label="Institution"
                    value={edu.institucion}
                    onChange={(e) => updateEducacion(edu.id, "institucion", e.target.value)}
                    placeholder="State University"
                    maxLength={80}
                  />
                  <Field
                    label="Degree"
                    value={edu.titulo}
                    onChange={(e) => updateEducacion(edu.id, "titulo", e.target.value)}
                    placeholder="Bachelor's in Business Administration"
                    maxLength={80}
                  />
                  <label className="field">
                    <span className="field__label">Start date</span>
                    <MonthYearPicker
                      value={edu.inicio}
                      onChange={(v) => updateEducacion(edu.id, "inicio", v)}
                    />
                  </label>
                  <div className="field">
                    <span className="field__label">End date</span>
                    <MonthYearPicker
                      value={edu.fin}
                      onChange={(v) => updateEducacion(edu.id, "fin", v)}
                      disabled={edu.actual}
                    />
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginTop: 6,
                        fontSize: 12.5,
                        color: "var(--ink-soft)",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={edu.actual}
                        onChange={(e) => updateEducacion(edu.id, "actual", e.target.checked)}
                      />
                      Currently studying
                    </label>
                  </div>
                </div>
              </div>
            ))}
            <button className="add-btn" onClick={addEducacion}>
              <Plus size={15} /> Add another institution
            </button>
          </Section>

          <Section icon={<Sparkles size={15} />} title="Skills">
            <div className="chips-input">
              {skills.map((s) => (
                <span className="chip-tag" key={s}>
                  {s}
                  <button onClick={() => removeSkill(s)} aria-label={`Quitar ${s}`}>
                    <X size={12} />
                  </button>
                </span>
              ))}
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={onSkillKeyDown}
                onBlur={() => addSkill(skillInput)}
                maxLength={30}
                placeholder={skills.length ? "" : "Excel, Power BI, SAP..."}
              />
            </div>
            <div className="field-hint">Type a skill and press Enter or comma.</div>
          </Section>

          <Section icon={<Languages size={15} />} title="Languages">
            {idiomas.map((idi) => (
              <div className="idioma-row" key={idi.id}>
                <Field
                  label="Language"
                  value={idi.idioma}
                  onChange={(e) => updateIdioma(idi.id, "idioma", e.target.value)}
                  placeholder="Spanish"
                  maxLength={30}
                />
                <label className="field">
                  <span className="field__label">Level</span>
                  <select
                    className="field__select"
                    value={idi.nivel}
                    onChange={(e) => updateIdioma(idi.id, "nivel", e.target.value)}
                  >
                    {NIVELES.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </label>
                {idiomas.length > 1 && (
                  <button
                    className="icon-btn"
                    onClick={() => removeIdioma(idi.id)}
                    aria-label="Remove language"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
            <button className="add-btn" onClick={addIdioma}>
              <Plus size={15} /> Add another language
            </button>
          </Section>

          <Section icon={<Award size={15} />} title="Certifications (optional)">
            {certificaciones.map((c, i) => (
              <div className="idioma-row" key={c.id} style={{ gridTemplateColumns: "1fr auto" }}>
                <Field
                  label={`Certification ${i + 1}`}
                  value={c.texto}
                  onChange={(e) => updateCertificacion(c.id, e.target.value)}
                  placeholder="Advanced Excel Certification — Coursera, 2023"
                  maxLength={120}
                />
                <button
                  className="icon-btn"
                  onClick={() => removeCertificacion(c.id)}
                  aria-label="Remove certification"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            <button className="add-btn" onClick={addCertificacion}>
              <Plus size={15} /> Add certification
            </button>
          </Section>

          <Section icon={<Layers size={15} />} title="Other section (optional)">
            {seccionesPersonalizadas.map((s, i) => (
              <div className="exp-card" key={s.id}>
                <div className="exp-card__top">
                  <span className="exp-card__label">Section {i + 1}</span>
                  <button
                    className="icon-btn"
                    onClick={() => removeSeccionPersonalizada(s.id)}
                    aria-label="Remove section"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <Field
                  label="Section name"
                  value={s.titulo}
                  onChange={(e) => updateSeccionPersonalizada(s.id, "titulo", e.target.value)}
                  placeholder="Volunteering, Projects, Publications..."
                  maxLength={40}
                />
                <label className="field" style={{ marginTop: 10 }}>
                  <span className="field__label">Content</span>
                  <textarea
                    className="field__textarea"
                    value={s.contenido}
                    onChange={(e) =>
                      updateSeccionPersonalizada(s.id, "contenido", e.target.value.slice(0, 500))
                    }
                    maxLength={500}
                    placeholder="Add whatever you'd like here."
                  />
                </label>
                <div className="field-hint" style={{ textAlign: "right" }}>
                  {s.contenido.length}/500
                </div>
              </div>
            ))}
            <button className="add-btn" onClick={addSeccionPersonalizada}>
              <Plus size={15} /> Add section
            </button>
          </Section>
        </div>

        <div className={`preview-col ${mobileTab !== "preview" ? "hidden-mobile" : ""}`}>
          <div className="preview-toolbar">
            <span className="preview-toolbar__label">Preview</span>
            <div className="download-menu" ref={downloadMenuRef}>
              <button
                className="download-btn"
                onClick={() => setDownloadMenuOpen((v) => !v)}
                disabled={downloading}
              >
                {downloading ? <Loader2 size={15} className="spin" /> : <FileDown size={15} />}
                {downloading ? "Generating..." : "Download resume"}
                <ChevronDown size={14} className={downloadMenuOpen ? "rotate-180" : ""} style={{ transition: "transform 0.15s ease" }} />
              </button>
              {downloadMenuOpen && (
                <div className="download-menu__list">
                  <button className="download-menu__item" onClick={handleDownloadPdf}>
                    <FileDown size={16} />
                    <span>
                      <strong>PDF</strong>
                      <small>Ready to send, exactly as shown</small>
                    </span>
                  </button>
                  <button className="download-menu__item" onClick={handleDownloadDocx}>
                    <FileText size={16} />
                    <span>
                      <strong>Word</strong>
                      <small>To edit, add a photo, or tweak by hand</small>
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
          <CVPreview data={data} innerRef={previewRef} locale="en" />
        </div>
      </div>
    </div>
  );
}
