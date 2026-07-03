import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    console.log(
      "DIAGNOSTICO GEMINI_API_KEY -> presente:",
      !!process.env.GEMINI_API_KEY,
      "| longitud:",
      process.env.GEMINI_API_KEY?.length || 0
    );

    const { texto, contexto } = await req.json();

    if (!texto || typeof texto !== "string" || !texto.trim()) {
      return NextResponse.json({ error: "Falta el texto a mejorar." }, { status: 400 });
    }

    const prompt =
      contexto === "perfil"
        ? `Mejorá la redacción del siguiente "perfil profesional" para un currículum. Hacelo más profesional, claro y conciso. Corregí errores de redacción y ortografía. NO inventes experiencia, títulos ni datos que no estén en el texto original. Devolvé únicamente el texto mejorado, sin comillas, sin explicaciones, sin encabezados.\n\nTexto original:\n"""${texto}"""`
        : `Mejorá la redacción de la siguiente descripción de experiencia laboral para un currículum. Usá verbos de acción, hacela más profesional y concisa. Si el texto tiene varias líneas, mantenelas como líneas separadas. NO inventes logros, cifras ni datos que no estén en el texto original. Devolvé únicamente el texto mejorado, sin comillas, sin explicaciones, sin encabezados.\n\nTexto original:\n"""${texto}"""`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const mejorado = response.text?.trim() || texto;

    return NextResponse.json({ mejorado });
  } catch (err) {
    console.error("Error en /api/mejorar:", err);
    return NextResponse.json(
      { error: "No se pudo mejorar el texto. Probá de nuevo." },
      { status: 500 }
    );
  }
}
