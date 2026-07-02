import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { texto, contexto } = await req.json();

    if (!texto || typeof texto !== "string" || !texto.trim()) {
      return NextResponse.json({ error: "Falta el texto a mejorar." }, { status: 400 });
    }

    const prompt =
      contexto === "perfil"
        ? `Mejorá la redacción del siguiente "perfil profesional" para un currículum. Hacelo más profesional, claro y conciso. Corregí errores de redacción y ortografía. NO inventes experiencia, títulos ni datos que no estén en el texto original. Devolvé únicamente el texto mejorado, sin comillas, sin explicaciones, sin encabezados.\n\nTexto original:\n"""${texto}"""`
        : `Mejorá la redacción de la siguiente descripción de experiencia laboral para un currículum. Usá verbos de acción, hacela más profesional y concisa. Si el texto tiene varias líneas, mantenelas como líneas separadas. NO inventes logros, cifras ni datos que no estén en el texto original. Devolvé únicamente el texto mejorado, sin comillas, sin explicaciones, sin encabezados.\n\nTexto original:\n"""${texto}"""`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    const mejorado = textBlock && "text" in textBlock ? textBlock.text.trim() : texto;

    return NextResponse.json({ mejorado });
  } catch (err) {
    console.error("Error en /api/mejorar:", err);
    return NextResponse.json(
      { error: "No se pudo mejorar el texto. Probá de nuevo." },
      { status: 500 }
    );
  }
}
