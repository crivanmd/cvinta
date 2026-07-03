import { CVData } from "@/lib/types";
import { formatMesAnio } from "@/lib/format";
import { CV_LABELS } from "@/components/CVPreview";

const ACCENT = "16553F";
const GRAY = "55605A";

export async function downloadCVAsDocx(data: CVData, filename: string, locale: "es" | "en" = "es") {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } =
    await import("docx");

  const t = CV_LABELS[locale];
  const { personal, perfil, experiencias, educacion, skills, idiomas, certificaciones } = data;

  const contactBits = [
    personal.email,
    personal.telefono,
    [personal.ciudad, personal.pais].filter(Boolean).join(", "),
    personal.linkedin,
    personal.web,
  ].filter(Boolean);

  const sectionLabel = (text: string) =>
    new Paragraph({
      spacing: { before: 260, after: 100 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "E4E7E3", space: 2 } },
      children: [
        new TextRun({ text: text.toUpperCase(), bold: true, size: 18, color: ACCENT }),
      ],
    });

  const children: InstanceType<typeof Paragraph>[] = [];

  // Encabezado
  children.push(
    new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({ text: personal.nombre || t.nombrePlaceholder, bold: true, size: 40 }),
      ],
    })
  );
  if (experiencias[0]?.cargo) {
    children.push(
      new Paragraph({
        spacing: { after: 80 },
        children: [new TextRun({ text: experiencias[0].cargo, bold: true, size: 22, color: ACCENT })],
      })
    );
  }
  if (contactBits.length) {
    children.push(
      new Paragraph({
        border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: ACCENT, space: 6 } },
        spacing: { after: 160 },
        children: [new TextRun({ text: contactBits.join("  ·  "), size: 18, color: GRAY })],
      })
    );
  }

  // Perfil
  if (perfil.trim()) {
    children.push(sectionLabel(t.perfil));
    children.push(new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: perfil, size: 21 })] }));
  }

  // Experiencia
  const expConTexto = experiencias.filter((e) => e.empresa || e.cargo || e.descripcion);
  if (expConTexto.length) {
    children.push(sectionLabel(t.experiencia));
    expConTexto.forEach((e) => {
      const fechas =
        e.inicio || e.fin || e.actual
          ? `${formatMesAnio(e.inicio)} — ${e.actual ? t.actualidad : formatMesAnio(e.fin)}`
          : "";
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 20 },
          tabStops: [{ type: "right" as const, position: 9026 }],
          children: [
            new TextRun({ text: e.cargo || t.cargo, bold: true, size: 21 }),
            new TextRun({ text: `\t${fechas}`, size: 18, color: GRAY }),
          ],
        })
      );
      children.push(
        new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: e.empresa, size: 19, color: GRAY })] })
      );
      if (e.descripcion) {
        e.descripcion.split("\n").forEach((line) => {
          if (!line.trim()) return;
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 20 },
              children: [new TextRun({ text: line.trim(), size: 20 })],
            })
          );
        });
      }
    });
  }

  // Educación
  const eduConTexto = educacion.filter((e) => e.institucion || e.titulo);
  if (eduConTexto.length) {
    children.push(sectionLabel(t.educacion));
    eduConTexto.forEach((e) => {
      const fechas =
        e.inicio || e.fin || e.actual
          ? `${formatMesAnio(e.inicio)} — ${e.actual ? t.actualidad : formatMesAnio(e.fin)}`
          : "";
      children.push(
        new Paragraph({
          spacing: { before: 100, after: 10 },
          tabStops: [{ type: "right" as const, position: 9026 }],
          children: [
            new TextRun({ text: e.titulo || t.titulo, bold: true, size: 21 }),
            new TextRun({ text: `\t${fechas}`, size: 18, color: GRAY }),
          ],
        })
      );
      children.push(
        new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: e.institucion, size: 19, color: GRAY })] })
      );
    });
  }

  // Habilidades
  if (skills.length) {
    children.push(sectionLabel(t.habilidades));
    children.push(new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: skills.join("  ·  "), size: 20 })] }));
  }

  // Idiomas
  const idiomasConTexto = idiomas.filter((i) => i.idioma);
  if (idiomasConTexto.length) {
    children.push(sectionLabel(t.idiomas));
    idiomasConTexto.forEach((i) => {
      children.push(
        new Paragraph({
          spacing: { after: 20 },
          children: [new TextRun({ text: `${i.idioma} — ${i.nivel}`, size: 20 })],
        })
      );
    });
  }

  // Certificaciones
  const certsConTexto = certificaciones.filter((c) => c.texto);
  if (certsConTexto.length) {
    children.push(sectionLabel(t.certificaciones));
    certsConTexto.forEach((c) => {
      children.push(new Paragraph({ spacing: { after: 20 }, children: [new TextRun({ text: c.texto, size: 20 })] }));
    });
  }

  const doc = new Document({
    sections: [
      {
        properties: { page: { margin: { top: 720, bottom: 720, left: 900, right: 900 } } },
        children,
      },
    ],
    styles: {
      default: { document: { run: { font: "Calibri" } } },
    },
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
