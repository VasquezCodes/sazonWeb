# Sazón — Diseño de la landing page

## Contexto

Sazón es un emprendimiento de comida venezolana (street food) en Australia. Todavía
no tiene un formato 100% fijo — puede aparecer como food truck, stand en mercados/ferias,
o haciendo catering para eventos privados; la ubicación cambia según el evento. No hay
local fijo.

La landing tiene dos objetivos igual de importantes:

1. Que la gente sepa dónde encontrarlos en el próximo evento/mercado.
2. Que puedan contactarlos para contratarlos en un evento propio.

Idioma: **solo inglés** (público general en Australia).

## Marca

Todavía no existe un logo vectorial. La referencia de marca es una imagen de mockup de
packaging (ver mensaje del usuario) con:

- Wordmark "Sazón" en script/cursiva azul, con un pequeño destello/rayos arriba de la "a".
- Tagline "VENEZUELAN STREET FOOD" en mayúsculas, letter-spacing amplio.
- Paleta inspirada en la bandera de Venezuela (azul, amarillo, rojo) combinada con
  blanco y beige cálido.
- Patrón gráfico de ondas y lunares en el empaque.

Como no hay logo vectorial, el wordmark se recrea con tipografía web (no como imagen),
y las fotos reales del negocio se cargan por el usuario en `public/images/` para
reemplazar cualquier placeholder.

## Sistema de color

Dirección elegida: **"Bandera vibrante"** — cada color tiene un rol claro para que no
compitan entre sí, con fondo cálido en vez de blanco puro.

| Token | Hex aprox. | Rol |
|---|---|---|
| `background` (beige) | `#F3E4C4` | Fondo base de la mayoría de secciones |
| `navy` (azul) | `#1C3F6E` | Headings, texto principal, nav, footer |
| `gold` (amarillo) | `#F0B429` | Acentos: subrayados, hover states, badges secundarios |
| `red` | `#D6432B` | CTAs principales, badges ("🌶 Picante", "Nuevo"), patrón decorativo de ondas/lunares |
| `white` | `#FFFFFF` | Cards de menú, contraste sobre fondos de color |

Reglas de uso:
- El rojo es el color de **acción**: botones CTA primarios y elementos decorativos que
  imitan el patrón del packaging (ondas, lunares) como separadores entre secciones.
- El amarillo es **acento**, nunca color de fondo grande ni de texto de cuerpo (bajo
  contraste sobre beige/blanco).
- El azul es el color de **texto y jerarquía**, no se usa como fondo de secciones enteras
  salvo excepciones puntuales (ej. footer).

## Tipografía

- **Wordmark / acentos grandes:** `Kaushan Script` (Google Font) — brush script,
  reemplaza visualmente al script cursivo del logo de referencia.
- **Headings, nav, botones:** `Poppins`, pesos 700–800.
- **Cuerpo de texto:** `Inter`, pesos 400–500.

Cargadas vía `next/font/google`, expuestas como variables CSS y mapeadas en la config
de Tailwind (`font-display`, `font-heading`, `font-body`).

## Tono

Vibrante y callejero: colores fuertes con propósito, tipografía con actitud, energía de
street food — no minimalista ni corporate.

## Estructura de la página (single page)

1. **Header** — sticky. Wordmark a la izquierda, nav (Menú / Dónde encontrarnos /
   Contratanos) a la derecha, CTA visible. Transparente sobre el hero, sólido al hacer
   scroll.
2. **Hero** — foto de comida como protagonista, wordmark "Sazón" + tagline
   "Venezuelan Street Food", subheadline corta, dos CTAs: "Ver menú" (secundario) y
   "Contratanos" (primario, rojo).
3. **Menú destacado** — grid de cards de platos (arepas, tequeños, etc.) con foto,
   nombre, descripción corta. Sin precio fijo (los precios varían según evento) —
   se puede mostrar un badge tipo 🌶 Picante / Vegetariano en vez de precio.
4. **Dónde encontrarnos** — lista/cards de próximos eventos o mercados (fecha + lugar).
   Incluye link a redes sociales para novedades en tiempo real, ya que el calendario de
   eventos cambia seguido y no siempre va a estar 100% actualizado en la landing.
5. **Contratanos / Contacto** — formulario simple (nombre, tipo de evento, fecha,
   mensaje). El canal real de contacto (WhatsApp/email/Instagram) todavía no está
   definido, así que el formulario se implementa como UI funcional del lado del
   cliente (validación, estados), lista para conectarse a un backend real (Formspree,
   Resend, o un link de WhatsApp) en cuanto el usuario decida el canal. No se
   implementa envío real todavía.
6. **Footer** — wordmark chico, íconos de redes (lucide-react, sin links reales
   todavía), patrón de ondas como fondo, copyright.

Nota: no se incluye sección "Nuestra historia" — el usuario la descartó explícitamente
al elegir las secciones.

## Motivo visual de marca

El patrón de ondas y lunares del packaging de referencia se reutiliza como elemento
gráfico recurrente: separadores SVG entre secciones y fondo del footer. Es lo que le da
identidad reconocible a la página más allá del uso de colores.

## Arquitectura técnica

- Next.js App Router, página única compuesta en `src/app/page.tsx` a partir de
  componentes en `src/components/sections/` (`Hero`, `Menu`, `Locations`, `Contact`).
- `src/components/layout/` para `Header` y `Footer`.
- `src/components/ui/` para piezas reutilizables (botones, badges, cards).
- Paleta y fuentes configuradas como tokens de Tailwind (extend theme), no clases
  hardcodeadas por componente.
- Datos de menú y de eventos como arrays TS tipados en `src/lib/` (`menu.ts`,
  `events.ts`), tipados desde `src/types/`. Sin CMS — son fáciles de editar a mano
  hasta que haya contenido real y un flujo de carga de contenido definido.
- Imágenes reales se cargan en `public/images/` por el usuario; hasta que estén,
  los componentes deben aceptar rutas de imagen fácilmente reemplazables (no URLs
  externas hardcodeadas).

## Fuera de alcance (por ahora)

- Backend/envío real del formulario de contacto (bloqueado hasta definir canal).
- CMS o panel de administración de contenido.
- Internacionalización / segundo idioma.
- Página de menú completa con precios (se resuelve cuando el modelo de negocio esté
  más definido).

## Testing

- `tsc --noEmit` sin errores.
- `npm run build` compila sin errores.
- Verificación visual del dev server (`npm run dev`) cubriendo desktop y mobile,
  golden path de cada sección.

## Implementación

La implementación visual se hace combinando las skills `frontend-design` y
`taste-skill:design-taste-frontend`, usando este documento como brief de marca
(colores, tipografía, tono, estructura de secciones).
