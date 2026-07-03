const MESES = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

/**
 * Convierte un valor de <input type="month"> (formato "2022-03")
 * a un texto legible en español, ej: "mar 2022".
 */
export function formatMesAnio(value: string): string {
  if (!value) return "";
  const [anioStr, mesStr] = value.split("-");
  const mesIndex = parseInt(mesStr, 10) - 1;
  const mes = MESES[mesIndex];
  if (!mes || !anioStr) return value;
  return `${mes} ${anioStr}`;
}
