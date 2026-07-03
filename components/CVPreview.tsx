import { CVData } from "@/lib/types";
import { formatMesAnio } from "@/lib/format";

export const CV_LABELS = {
  es: {
    perfil: "Perfil",
    experiencia: "Experiencia",
    educacion: "Educación",
    habilidades: "Habilidades",
    idiomas: "Idiomas",
    certificaciones: "Certificaciones",
    actualidad: "Actualidad",
    cargo: "Cargo",
    titulo: "Título",
    nombrePlaceholder: "Tu nombre completo",
  },
  en: {
    perfil: "Profile",
    experiencia: "Experience",
    educacion: "Education",
    habilidades: "Skills",
    idiomas: "Languages",
    certificaciones: "Certifications",
    actualidad: "Present",
    cargo: "Role",
    titulo: "Degree",
    nombrePlaceholder: "Your full name",
  },
} as const;

export default function CVPreview({
  data,
  innerRef,
  locale = "es",
}: {
  data: CVData;
  innerRef?: React.RefObject<HTMLDivElement>;
  locale?: "es" | "en";
}) {
  const t = CV_LABELS[locale];
  const { personal, perfil, experiencias, educacion, skills, idiomas, certificaciones } = data;

  const contactBits = [
    personal.email,
    personal.telefono,
    [personal.ciudad, personal.pais].filter(Boolean).join(", "),
    personal.linkedin,
    personal.web,
  ].filter(Boolean);

  const hasExp = experiencias.some((e) => e.empresa || e.cargo || e.descripcion);
  const hasEdu = educacion.some((e) => e.institucion || e.titulo);

  return (
    <div className="cv-page" ref={innerRef}>
      <div className="cv-page__head">
        <div className="cv-page__name">
          {personal.nombre || <span className="ph">{t.nombrePlaceholder}</span>}
        </div>
        {experiencias[0]?.cargo && <div className="cv-page__role">{experiencias[0].cargo}</div>}
        {contactBits.length > 0 && (
          <div className="cv-page__contact">
            {contactBits.map((b, i) => (
              <span key={i}>
                {b}
                {i < contactBits.length - 1 ? " · " : ""}
              </span>
            ))}
          </div>
        )}
      </div>

      {perfil.trim() && (
        <div className="cv-page__section">
          <div className="cv-page__label">{t.perfil}</div>
          <div className="cv-page__text">{perfil}</div>
        </div>
      )}

      {hasExp && (
        <div className="cv-page__section">
          <div className="cv-page__label">{t.experiencia}</div>
          {experiencias
            .filter((e) => e.empresa || e.cargo || e.descripcion)
            .map((e) => (
              <div className="cv-exp-item" key={e.id}>
                <div className="cv-exp-item__top">
                  <span className="cv-exp-item__role">{e.cargo || t.cargo}</span>
                  {(e.inicio || e.fin || e.actual) && (
                    <span className="cv-exp-item__dates">
                      {formatMesAnio(e.inicio)} — {e.actual ? t.actualidad : formatMesAnio(e.fin)}
                    </span>
                  )}
                </div>
                <div className="cv-exp-item__company">{e.empresa}</div>
                {e.descripcion && (
                  <div className="cv-page__text" style={{ marginTop: 4 }}>
                    {e.descripcion}
                  </div>
                )}
              </div>
            ))}
        </div>
      )}

      {hasEdu && (
        <div className="cv-page__section">
          <div className="cv-page__label">{t.educacion}</div>
          {educacion
            .filter((e) => e.institucion || e.titulo)
            .map((e) => (
              <div className="cv-edu-item" key={e.id}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{e.titulo || t.titulo}</div>
                  <div style={{ fontSize: 12, color: "#55605A" }}>{e.institucion}</div>
                </div>
                {(e.inicio || e.fin || e.actual) && (
                  <div className="cv-exp-item__dates">
                    {formatMesAnio(e.inicio)} — {e.actual ? t.actualidad : formatMesAnio(e.fin)}
                  </div>
                )}
              </div>
            ))}
        </div>
      )}

      {skills.length > 0 && (
        <div className="cv-page__section">
          <div className="cv-page__label">{t.habilidades}</div>
          <div className="cv-chip-row">
            {skills.map((s) => (
              <span className="cv-chip" key={s}>
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {idiomas.some((i) => i.idioma) && (
        <div className="cv-page__section">
          <div className="cv-page__label">{t.idiomas}</div>
          {idiomas
            .filter((i) => i.idioma)
            .map((i) => (
              <div className="cv-lang-row" key={i.id}>
                <span>{i.idioma}</span>
                <span className="nivel">{i.nivel}</span>
              </div>
            ))}
        </div>
      )}

      {certificaciones.some((c) => c.texto) && (
        <div className="cv-page__section">
          <div className="cv-page__label">{t.certificaciones}</div>
          {certificaciones
            .filter((c) => c.texto)
            .map((c) => (
              <div className="cv-cert-item" key={c.id}>
                {c.texto}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
