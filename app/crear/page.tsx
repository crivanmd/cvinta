"use client";

import { useState, useRef } from "react";
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
  FileDown,
  Loader2,
  Eye,
  Pencil,
} from "lucide-react";
import Logo from "@/components/Logo";
import CVPreview from "@/components/CVPreview";
import { downloadCVAsPdf } from "@/lib/downloadPdf";
import { CVData, NIVELES } from "@/lib/types";

async function mejorarTextoConIA(texto: string, contexto: "perfil" | "experiencia") {
  const res = await fetch("/api/mejorar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texto, contexto }),
  });
  if (!res.ok) throw new Error("No se pudo mejorar el texto");
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
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
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
        <option value="">Mes</option>
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
        <option value="">Año</option>
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

export default function CrearCurriculum() {
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
      updateExperiencia(id, "error", "No se pudo mejorar el texto. Probá de nuevo.");
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

  const mejorarPerfil = async () => {
    if (!perfil.trim()) return;
    setEnhancingPerfil(true);
    setPerfilError("");
    try {
      const mejorado = await mejorarTextoConIA(perfil, "perfil");
      setPerfil(mejorado);
    } catch {
      setPerfilError("No se pudo mejorar el texto. Probá de nuevo.");
    } finally {
      setEnhancingPerfil(false);
    }
  };

  const handleDownload = async () => {
    if (!previewRef.current) return;
    setDownloading(true);
    try {
      const nombreArchivo = personal.nombre
        ? `Curriculum - ${personal.nombre}.pdf`
        : "Curriculum.pdf";
      await downloadCVAsPdf(previewRef.current, nombreArchivo);
    } finally {
      setDownloading(false);
    }
  };

  const data: CVData = { personal, perfil, experiencias, educacion, skills, idiomas, certificaciones };

  return (
    <div className="w-full">
      <div className="mobile-tabs">
        <button
          className={`mobile-tab ${mobileTab === "editar" ? "active" : ""}`}
          onClick={() => setMobileTab("editar")}
        >
          <Pencil size={15} /> Editar
        </button>
        <button
          className={`mobile-tab ${mobileTab === "preview" ? "active" : ""}`}
          onClick={() => setMobileTab("preview")}
        >
          <Eye size={15} /> Vista previa
        </button>
      </div>

      <div className="layout">
        <div className={`form-col ${mobileTab !== "editar" ? "hidden-mobile" : ""}`}>
          <div className="form-header">
            <Link href="/" className="logo mb-4" style={{ textDecoration: "none", color: "inherit" }}>
              <Logo size={22} />
              CVinta
            </Link>
            <h1>Completa tu currículum</h1>
            <p>La vista previa se actualiza en tiempo real, a la derecha.</p>
          </div>

          <Section icon={<User size={15} />} title="Datos personales">
            <div className="grid-2">
              <Field
                label="Nombre completo"
                value={personal.nombre}
                onChange={(e) => setPersonal({ ...personal, nombre: e.target.value })}
                placeholder="Alex Smith"
                maxLength={80}
              />
              <Field
                label="Correo electrónico"
                type="email"
                value={personal.email}
                onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
                onBlur={() => setEmailTouched(true)}
                placeholder="alex@email.com"
                maxLength={100}
                error={
                  emailTouched && personal.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal.email)
                    ? "Revisa el formato del correo."
                    : undefined
                }
              />
              <Field
                label="Teléfono"
                value={personal.telefono}
                onChange={(e) => setPersonal({ ...personal, telefono: e.target.value })}
                placeholder="+54 9 261 1234567"
                maxLength={25}
              />
              <Field
                label="Ciudad"
                value={personal.ciudad}
                onChange={(e) => setPersonal({ ...personal, ciudad: e.target.value })}
                placeholder="Mendoza"
                maxLength={50}
              />
              <Field
                label="País"
                value={personal.pais}
                onChange={(e) => setPersonal({ ...personal, pais: e.target.value })}
                placeholder="Argentina"
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
                label="Sitio web (opcional)"
                value={personal.web}
                onChange={(e) => setPersonal({ ...personal, web: e.target.value })}
                placeholder="alexsmith.com"
                maxLength={100}
              />
            </div>
          </Section>

          <Section
            icon={<Sparkles size={15} />}
            title="Perfil profesional"
            right={
              <button
                className="ai-btn"
                disabled={enhancingPerfil || !perfil.trim()}
                onClick={mejorarPerfil}
              >
                {enhancingPerfil ? <Loader2 size={13} className="spin" /> : <Sparkles size={13} />}
                Mejorar con IA
              </button>
            }
          >
            <textarea
              className="field__textarea"
              value={perfil}
              onChange={(e) => setPerfil(e.target.value.slice(0, 500))}
              maxLength={500}
              placeholder="Analista financiero con experiencia en control de gestión, análisis de costos y elaboración de reportes."
            />
            <div className="field-hint" style={{ textAlign: "right" }}>
              {perfil.length}/500
            </div>
            {perfilError && <div className="ai-error">{perfilError}</div>}
          </Section>

          <Section icon={<Briefcase size={15} />} title="Experiencia">
            {experiencias.map((exp, i) => (
              <div className="exp-card" key={exp.id}>
                <div className="exp-card__top">
                  <span className="exp-card__label">Experiencia {i + 1}</span>
                  {experiencias.length > 1 && (
                    <button
                      className="icon-btn"
                      onClick={() => removeExperiencia(exp.id)}
                      aria-label="Eliminar experiencia"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
                <div className="grid-2" style={{ marginBottom: 10 }}>
                  <Field
                    label="Empresa"
                    value={exp.empresa}
                    onChange={(e) => updateExperiencia(exp.id, "empresa", e.target.value)}
                    placeholder="Empresa ABC"
                    maxLength={80}
                  />
                  <Field
                    label="Cargo"
                    value={exp.cargo}
                    onChange={(e) => updateExperiencia(exp.id, "cargo", e.target.value)}
                    placeholder="Analista Financiero"
                    maxLength={80}
                  />
                  <label className="field">
                    <span className="field__label">Fecha inicio</span>
                    <MonthYearPicker
                      value={exp.inicio}
                      onChange={(v) => updateExperiencia(exp.id, "inicio", v)}
                    />
                  </label>
                  <div className="field">
                    <span className="field__label">Fecha fin</span>
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
                      Trabajo actualmente acá
                    </label>
                  </div>
                </div>
                <label className="field">
                  <span
                    className="field__label"
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                  >
                    Descripción
                    <button
                      className="ai-btn"
                      disabled={exp.enhancing || !exp.descripcion.trim()}
                      onClick={() => mejorarExperiencia(exp.id)}
                    >
                      {exp.enhancing ? <Loader2 size={13} className="spin" /> : <Sparkles size={13} />}
                      Mejorar con IA
                    </button>
                  </span>
                  <textarea
                    className="field__textarea"
                    value={exp.descripcion}
                    onChange={(e) => updateExperiencia(exp.id, "descripcion", e.target.value.slice(0, 600))}
                    maxLength={600}
                    placeholder={
                      "Elaboración de reportes financieros.\nControl presupuestario.\nAutomatización de procesos en Excel."
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
              <Plus size={15} /> Agregar otra experiencia
            </button>
          </Section>

          <Section icon={<GraduationCap size={15} />} title="Educación">
            {educacion.map((edu, i) => (
              <div className="exp-card" key={edu.id}>
                <div className="exp-card__top">
                  <span className="exp-card__label">Educación {i + 1}</span>
                  {educacion.length > 1 && (
                    <button
                      className="icon-btn"
                      onClick={() => removeEducacion(edu.id)}
                      aria-label="Eliminar educación"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
                <div className="grid-2">
                  <Field
                    label="Institución"
                    value={edu.institucion}
                    onChange={(e) => updateEducacion(edu.id, "institucion", e.target.value)}
                    placeholder="Universidad Nacional"
                    maxLength={80}
                  />
                  <Field
                    label="Título"
                    value={edu.titulo}
                    onChange={(e) => updateEducacion(edu.id, "titulo", e.target.value)}
                    placeholder="Licenciatura en Administración"
                    maxLength={80}
                  />
                  <label className="field">
                    <span className="field__label">Fecha inicio</span>
                    <MonthYearPicker
                      value={edu.inicio}
                      onChange={(v) => updateEducacion(edu.id, "inicio", v)}
                    />
                  </label>
                  <div className="field">
                    <span className="field__label">Fecha fin</span>
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
                      Cursando actualmente
                    </label>
                  </div>
                </div>
              </div>
            ))}
            <button className="add-btn" onClick={addEducacion}>
              <Plus size={15} /> Agregar otra institución
            </button>
          </Section>

          <Section icon={<Sparkles size={15} />} title="Habilidades">
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
            <div className="field-hint">Escribe una habilidad y presiona Enter o coma.</div>
          </Section>

          <Section icon={<Languages size={15} />} title="Idiomas">
            {idiomas.map((idi) => (
              <div className="idioma-row" key={idi.id}>
                <Field
                  label="Idioma"
                  value={idi.idioma}
                  onChange={(e) => updateIdioma(idi.id, "idioma", e.target.value)}
                  placeholder="Inglés"
                  maxLength={30}
                />
                <label className="field">
                  <span className="field__label">Nivel</span>
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
                    aria-label="Eliminar idioma"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
            <button className="add-btn" onClick={addIdioma}>
              <Plus size={15} /> Agregar otro idioma
            </button>
          </Section>

          <Section icon={<Award size={15} />} title="Certificaciones (opcional)">
            {certificaciones.map((c, i) => (
              <div className="idioma-row" key={c.id} style={{ gridTemplateColumns: "1fr auto" }}>
                <Field
                  label={`Certificación ${i + 1}`}
                  value={c.texto}
                  onChange={(e) => updateCertificacion(c.id, e.target.value)}
                  placeholder="Certificación en Excel Avanzado — Coursera, 2023"
                  maxLength={120}
                />
                <button
                  className="icon-btn"
                  onClick={() => removeCertificacion(c.id)}
                  aria-label="Eliminar certificación"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            <button className="add-btn" onClick={addCertificacion}>
              <Plus size={15} /> Agregar certificación
            </button>
          </Section>
        </div>

        <div className={`preview-col ${mobileTab !== "preview" ? "hidden-mobile" : ""}`}>
          <div className="preview-toolbar">
            <span className="preview-toolbar__label">Vista previa</span>
            <button className="download-btn" onClick={handleDownload} disabled={downloading}>
              {downloading ? <Loader2 size={15} className="spin" /> : <FileDown size={15} />}
              {downloading ? "Generando..." : "Descargar currículum"}
            </button>
          </div>
          <CVPreview data={data} innerRef={previewRef} />
        </div>
      </div>
    </div>
  );
}
