import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cvinta.com"),
  title: "CVinta — Creá tu currículum gratis, en minutos",
  description:
    "¿Necesitas un currículum ya? Hazlo gratis, en minutos. Sin registrarte, sin complicaciones, sin pagar para descargar.",
  openGraph: {
    title: "CVinta — Creá tu currículum gratis, en minutos",
    description: "Sin registrarte, sin complicaciones, sin pagar para descargar.",
    locale: "es_AR",
    type: "website",
  },
  themeColor: "#1F6F54",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${display.variable} ${body.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
