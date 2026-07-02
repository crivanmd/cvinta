# Cvinta

Currículums simples y gratuitos, para cualquier persona, sin registro.

## Qué incluye

- Landing page (`/`)
- Formulario con vista previa en tiempo real (`/crear`)
- Descarga real del currículum como PDF (captura el diseño exacto que ves en pantalla)
- Botón "Mejorar con IA" en Perfil profesional y en cada Experiencia, conectado a Claude a través de una ruta de servidor propia (tu clave de API nunca queda expuesta en el navegador)
- Preguntas frecuentes
- 100% responsive: celular, tablet y escritorio
- No usa base de datos ni login: todo vive en el navegador de la persona mientras completa el formulario

## Cómo correrlo en tu computadora

### 1. Requisitos

- [Node.js](https://nodejs.org) versión 18 o superior instalado
- Una cuenta en [console.anthropic.com](https://console.anthropic.com) para conseguir una clave de API (necesaria solo para el botón "Mejorar con IA")

### 2. Instalar las dependencias

Abrí una terminal dentro de esta carpeta y corré:

```bash
npm install
```

### 3. Configurar tu clave de API

Copiá el archivo `.env.example` y renombralo a `.env.local`:

```bash
cp .env.example .env.local
```

Abrí `.env.local` y pegá tu clave real de Anthropic donde dice `sk-ant-...`.

> Si no configurás esto, todo el sitio funciona igual — solo el botón "Mejorar con IA" no va a andar hasta que la agregues.

### 4. Correrlo en modo desarrollo

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) en tu navegador. Cualquier cambio que hagas en el código se ve reflejado al instante.

## Cómo publicarlo gratis en internet (Vercel)

Vercel es la forma más simple y gratuita de publicar un proyecto Next.js.

1. Subí esta carpeta a un repositorio de GitHub (podés crear una cuenta gratis en [github.com](https://github.com) si no tenés).
2. Entrá a [vercel.com](https://vercel.com) y creá una cuenta gratis (podés entrar directamente con tu cuenta de GitHub).
3. Hacé clic en **"Add New Project"** y elegí el repositorio que acabás de subir.
4. En la sección **"Environment Variables"**, agregá:
   - Nombre: `ANTHROPIC_API_KEY`
   - Valor: tu clave real de Anthropic
5. Hacé clic en **"Deploy"**. En un par de minutos vas a tener una URL pública real (algo como `cvinta.vercel.app`).
6. Una vez que compres el dominio `cvinta.com` (o el que hayas elegido), en Vercel andá a **Settings → Domains** y seguí los pasos para conectarlo. Vercel te va a decir exactamente qué configurar en tu proveedor de dominio.

Cada vez que quieras cambiar algo del sitio, editás el código y lo volvés a subir a GitHub — Vercel lo vuelve a publicar solo, automáticamente.

## Estructura del proyecto

```
cvinta/
├── app/
│   ├── page.tsx          → Landing page
│   ├── layout.tsx        → Estructura general y tipografías
│   ├── globals.css       → Todos los estilos del sitio
│   ├── crear/
│   │   └── page.tsx      → Formulario + vista previa + descarga
│   └── api/
│       └── mejorar/
│           └── route.ts  → Conexión con la IA (server-side)
├── components/
│   ├── Logo.tsx           → Ícono de marca
│   └── CVPreview.tsx       → Plantilla visual del currículum
├── lib/
│   ├── types.ts            → Tipos de datos del currículum
│   └── downloadPdf.ts       → Lógica de descarga en PDF
└── .env.example
```

## Cosas para revisar antes de lanzarlo de verdad

- [ ] Reemplazar `hola@cvinta.com` por tu mail de contacto real (está en `app/page.tsx`, buscá "footer__contact")
- [ ] Comprar el dominio `cvinta.com` (o la variante que hayas elegido) mientras esté barato
- [ ] Cargar tu clave de Anthropic en Vercel para que la IA funcione en producción
- [ ] Probar el flujo completo una vez publicado: completar un currículum de prueba y descargarlo
