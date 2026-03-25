# Verismart Pitch Deck — Static Site

Sitio multi-presentación 100% estático. Listo para Vercel sin ningún paso de build.

## Estructura

```
/
├── index.html                    ← Landing con cards
├── vercel.json                   ← Rewrites de URLs limpias
├── shared/
│   ├── css/base.css              ← Design tokens + componentes compartidos
│   └── js/core.js                ← Progress bar, contadores, video autoplay
├── brands/
│   └── verismart/
│       ├── index.html            ← Pitch deck completo
│       ├── css/theme.css         ← Overrides de variables CSS para la marca
│       ├── js/main.js            ← Animaciones GSAP + Chart.js
│       └── assets/               ← (Agrega imágenes/videos aquí)
└── data/
    └── verismart.json            ← Datos separados del HTML
```

## Deploy en Vercel

1. Sube la carpeta a GitHub
2. Importa el repo en vercel.com
3. Framework Preset: **Other** (sitio estático)
4. Build Command: *(vacío)*
5. Output Directory: *(vacío / raíz)*
6. Deploy 🚀

URLs limpias disponibles:
- `/` → Landing
- `/brands/verismart` → Pitch deck Verismart

## Agregar una nueva presentación

1. Duplica la carpeta `/brands/verismart/` → `/brands/mi-marca/`
2. Edita `css/theme.css` — solo cambia las variables CSS en `:root`
3. Edita `js/main.js` si necesitas animaciones específicas
4. Crea `/data/mi-marca.json` con los datos
5. Agrega una card en `/index.html`
6. El `vercel.json` ya maneja el rewrite automáticamente

## Personalizar identidad visual

En `brands/mi-marca/css/theme.css`, solo cambia las variables:

```css
:root {
  --color-accent:   #tu-color;
  --color-accent-2: #tu-color-2;
  --font-display:   'Tu Fuente', sans-serif;
  --color-bg:       #fondo;
}
```

## Stack

- HTML + CSS + JavaScript vanilla
- GSAP 3.12 + ScrollTrigger (CDN)
- Chart.js 4.4 (CDN)
- Google Fonts (Syne + DM Sans + JetBrains Mono)
