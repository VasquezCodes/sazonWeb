# Sazón Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the full Sazón single-page landing site (Header, Hero, Menu, Locations, Contact, Footer) on top of the existing Next.js/Tailwind scaffold, using the real brand photos already in `public/images/` and the color/typography system defined in `docs/superpowers/specs/2026-08-04-sazon-landing-design.md`.

**Architecture:** A single route (`src/app/page.tsx`) composes layout components (`Header`, `Footer`) and section components (`Hero`, `Menu`, `Locations`, `Contact`) from `src/components/`. Shared visual primitives (buttons, badges, wordmark, wave/dot brand motifs) live in `src/components/ui/`. Menu and event content are typed local data arrays in `src/lib/`, not a CMS.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4 (CSS-based `@theme` config, no `tailwind.config.ts`), `next/font/google`, `lucide-react`, `clsx` + `tailwind-merge` (via existing `cn()` in `src/lib/utils.ts`).

## Global Constraints

- Copy is English only — no i18n, no language switcher.
- Brand color tokens (defined once in `src/app/globals.css`, never hardcoded hex elsewhere): cream `#f3e4c4`, cream-soft `#faf1dd`, navy `#1c3f6e`, navy-dark `#122c50`, gold `#f0b429`, red `#d6432b`.
- Fonts: `Kaushan Script` (script/display), `Poppins` weights 600/700/800 (headings/UI), `Inter` (body) — loaded only via `next/font/google`, no external `<link>` font tags.
- Tailwind v4: theme tokens live in `src/app/globals.css` under `@theme`. This project has no `tailwind.config.ts` — do not create one.
- No automated test framework is set up in this project (matches the design spec's "Testing" section). Verify every task with `npx tsc --noEmit` and `npm run build`; visually confirm with `npm run dev`.
- The Contact form has no real backend yet — client-side state and validation only, no network calls, no `fetch`/`action` wiring.
- Only reference images already present at `public/images/1.jpeg` through `public/images/8.jpeg`. Do not invent new image paths.
- Path alias `@/*` maps to `src/*` (already configured in `tsconfig.json`).
- No dark-mode support — the palette is fixed regardless of OS color scheme.

---

### Task 1: Brand fonts and metadata

**Files:**
- Modify: `src/app/layout.tsx:1-29` (full rewrite)

**Interfaces:**
- Produces: CSS custom properties `--font-inter`, `--font-poppins`, `--font-kaushan` on `<html>`, consumed by Task 2's `@theme` block.

- [ ] **Step 1: Replace the font setup and metadata in `layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Inter, Poppins, Kaushan_Script } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const kaushanScript = Kaushan_Script({
  variable: "--font-kaushan",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Sazón — Venezuelan Street Food",
  description:
    "Venezuelan street food in Australia. Find our next market or truck stop, or book us for your event.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} ${kaushanScript.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no output, exit code 0.

Run: `npm run build`
Expected: `Compiled successfully`. The homepage still renders the default `create-next-app` content (untouched until Task 7) — that's expected at this point.

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "Cargar tipografías de marca (Kaushan Script, Poppins, Inter)"
```

---

### Task 2: Brand color tokens and base styles

**Files:**
- Modify: `src/app/globals.css:1-27` (full rewrite)

**Interfaces:**
- Consumes: `--font-inter`, `--font-poppins`, `--font-kaushan` from Task 1.
- Produces: Tailwind utility classes `bg-cream`, `bg-cream-soft`, `text-navy`/`bg-navy`/`border-navy`, `bg-navy-dark`, `text-gold`/`bg-gold`, `text-red`/`bg-red`/`border-red`, and font utilities `font-sans` (body/Inter), `font-heading` (Poppins), `font-script` (Kaushan Script) — used by every component task from here on.

- [ ] **Step 1: Replace `globals.css`**

```css
@import "tailwindcss";

@theme {
  --color-cream: #f3e4c4;
  --color-cream-soft: #faf1dd;
  --color-navy: #1c3f6e;
  --color-navy-dark: #122c50;
  --color-gold: #f0b429;
  --color-red: #d6432b;
  --font-sans: var(--font-inter);
  --font-heading: var(--font-poppins);
  --font-script: var(--font-kaushan);
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--color-cream);
  color: var(--color-navy);
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no output, exit code 0.

Run: `npm run build`
Expected: `Compiled successfully`.

- [ ] **Step 3: Visually confirm the token change**

Run: `npm run dev`, open `http://localhost:3000`.
Expected: the page background is now warm beige instead of white (the rest of the default template content is unchanged until Task 7).

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "Definir paleta de marca y estilos base en globals.css"
```

---

### Task 3: Menu data and types

**Files:**
- Create: `src/types/menu.ts`
- Create: `src/lib/menu.ts`
- Delete: `src/types/.gitkeep`

**Interfaces:**
- Produces: `type MenuBadge = "spicy" | "vegetarian" | "new"`, `interface MenuItem { slug, name, description, image, badges }`, and `export const menuItems: MenuItem[]` — consumed by Task 9 (Menu section) and Task 5 (Badge component).

- [ ] **Step 1: Create the menu item type**

```ts
// src/types/menu.ts
export type MenuBadge = "spicy" | "vegetarian" | "new";

export interface MenuItem {
  slug: string;
  name: string;
  description: string;
  image: string;
  badges: MenuBadge[];
}
```

- [ ] **Step 2: Create the menu data**

```ts
// src/lib/menu.ts
import type { MenuItem } from "@/types/menu";

export const menuItems: MenuItem[] = [
  {
    slug: "filled-arepa",
    name: "Filled Arepa",
    description:
      "A toasted corn pocket packed with slow-cooked shredded beef, melted cheese and crunchy slaw.",
    image: "/images/4.jpeg",
    badges: ["new"],
  },
  {
    slug: "tequenos",
    name: "Tequeños",
    description:
      "Golden fried breadsticks wrapped around melting white cheese — the street food classic.",
    image: "/images/6.jpeg",
    badges: ["vegetarian"],
  },
  {
    slug: "empanadas",
    name: "Empanadas",
    description:
      "Crisp corn empanadas stuffed to order, served with our house avocado-herb dip.",
    image: "/images/3.jpeg",
    badges: ["spicy"],
  },
  {
    slug: "sazon-bowl",
    name: "Sazón Bowl",
    description:
      "Shredded beef, black beans, guacamole, pico de gallo and fried plantain over an arepa base.",
    image: "/images/1.jpeg",
    badges: [],
  },
];
```

- [ ] **Step 3: Remove the now-unnecessary placeholder**

```bash
git rm src/types/.gitkeep
```

- [ ] **Step 4: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no output, exit code 0.

- [ ] **Step 5: Commit**

```bash
git add src/types/menu.ts src/lib/menu.ts
git commit -m "Agregar datos y tipos del menú con las fotos reales de marca"
```

---

### Task 4: Events/locations data and types

**Files:**
- Create: `src/types/event.ts`
- Create: `src/lib/events.ts`

**Interfaces:**
- Produces: `interface EventListing { slug, title, city, date, time }` and `export const upcomingEvents: EventListing[]` — consumed by Task 10 (Locations section).

- [ ] **Step 1: Create the event listing type**

```ts
// src/types/event.ts
export interface EventListing {
  slug: string;
  title: string;
  city: string;
  date: string;
  time: string;
}
```

- [ ] **Step 2: Create example event data**

These are illustrative placeholder entries (no real event calendar was provided) —
edit this file directly whenever real dates/locations are confirmed.

```ts
// src/lib/events.ts
import type { EventListing } from "@/types/event";

export const upcomingEvents: EventListing[] = [
  {
    slug: "sydney-night-market",
    title: "Sydney Night Noodle Market",
    city: "Sydney, NSW",
    date: "August 14, 2026",
    time: "5:00 PM – 10:00 PM",
  },
  {
    slug: "melbourne-laneway-market",
    title: "Melbourne Laneway Market",
    city: "Melbourne, VIC",
    date: "August 22, 2026",
    time: "11:00 AM – 4:00 PM",
  },
  {
    slug: "brisbane-riverside-markets",
    title: "Brisbane Riverside Markets",
    city: "Brisbane, QLD",
    date: "September 5, 2026",
    time: "9:00 AM – 2:00 PM",
  },
];
```

- [ ] **Step 3: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no output, exit code 0.

- [ ] **Step 4: Commit**

```bash
git add src/types/event.ts src/lib/events.ts
git commit -m "Agregar datos de ejemplo de próximos eventos/ubicaciones"
```

---

### Task 5: Button and Badge UI primitives

**Files:**
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Badge.tsx`
- Delete: `src/components/ui/.gitkeep`

**Interfaces:**
- Consumes: `cn()` from `src/lib/utils.ts`, `MenuBadge` type from Task 3.
- Produces: `Button({ variant?: "primary" | "secondary", href?: string, ...anchorOrButtonProps })` — renders a `Link` when `href` is given, a native `<button>` otherwise. `Badge({ type: MenuBadge })`. Both consumed by every section/layout task from here on.

- [ ] **Step 1: Create the polymorphic Button**

```tsx
// src/components/ui/Button.tsx
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-red text-white hover:bg-red/90",
  secondary:
    "bg-transparent text-navy border-2 border-navy hover:bg-navy hover:text-white",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-heading text-sm font-bold uppercase tracking-wide transition-colors disabled:opacity-50 disabled:pointer-events-none";

type LinkButtonProps = ComponentPropsWithoutRef<"a"> & {
  variant?: ButtonVariant;
  href: string;
};

type NativeButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
  href?: undefined;
};

type ButtonProps = LinkButtonProps | NativeButtonProps;

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  const classes = cn(baseClasses, variantClasses[variant], className);

  if (props.href) {
    return <Link {...(props as LinkButtonProps)} className={classes} />;
  }

  return <button {...(props as NativeButtonProps)} className={classes} />;
}
```

- [ ] **Step 2: Create the Badge**

```tsx
// src/components/ui/Badge.tsx
import { cn } from "@/lib/utils";
import type { MenuBadge } from "@/types/menu";

const badgeConfig: Record<MenuBadge, { label: string; className: string }> = {
  spicy: { label: "🌶 Spicy", className: "bg-red text-white" },
  vegetarian: { label: "Vegetarian", className: "bg-navy text-white" },
  new: { label: "New", className: "bg-gold text-navy" },
};

export function Badge({ type }: { type: MenuBadge }) {
  const { label, className } = badgeConfig[type];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-heading font-bold uppercase tracking-wide",
        className
      )}
    >
      {label}
    </span>
  );
}
```

- [ ] **Step 3: Remove the now-unnecessary placeholder**

```bash
git rm src/components/ui/.gitkeep
```

- [ ] **Step 4: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no output, exit code 0.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/Button.tsx src/components/ui/Badge.tsx
git commit -m "Agregar componentes base Button y Badge"
```

---

### Task 6: Brand motif primitives — Wordmark, WaveDivider, PolkaBand

**Files:**
- Create: `src/components/ui/Wordmark.tsx`
- Create: `src/components/ui/WaveDivider.tsx`
- Create: `src/components/ui/PolkaBand.tsx`

**Interfaces:**
- Consumes: `cn()` from `src/lib/utils.ts`.
- Produces: `Wordmark({ className?, tone?: "navy" | "white" })`, `WaveDivider({ className?, flip?: boolean })`, `PolkaBand({ className? })` — consumed by Header, Hero, Footer (Tasks 7, 8, 12).

- [ ] **Step 1: Create the Wordmark**

```tsx
// src/components/ui/Wordmark.tsx
import { cn } from "@/lib/utils";

export function Wordmark({
  className,
  tone = "navy",
}: {
  className?: string;
  tone?: "navy" | "white";
}) {
  return (
    <span className={cn("inline-flex flex-col leading-none", className)}>
      <span
        className={cn(
          "font-script text-4xl",
          tone === "navy" ? "text-navy" : "text-white"
        )}
      >
        Sazón
      </span>
      <span
        className={cn(
          "mt-1 font-heading text-[0.6rem] font-bold uppercase tracking-[0.25em]",
          tone === "navy" ? "text-navy/80" : "text-white/80"
        )}
      >
        Venezuelan Street Food
      </span>
    </span>
  );
}
```

- [ ] **Step 2: Create the WaveDivider**

Fill colors are hardcoded to the same hex values as the `gold`/`navy` tokens in
`globals.css` (SVG `fill` doesn't reliably resolve `var()` the same way CSS
properties do across browsers, so we keep it explicit).

```tsx
// src/components/ui/WaveDivider.tsx
import { cn } from "@/lib/utils";

export function WaveDivider({
  className,
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn(className, flip && "rotate-180")}
    >
      <path
        d="M0,64 C300,120 600,0 900,48 C1050,72 1150,40 1200,24 L1200,120 L0,120 Z"
        fill="#f0b429"
      />
      <path
        d="M0,80 C300,32 600,112 900,72 C1050,52 1150,88 1200,64 L1200,120 L0,120 Z"
        fill="#1c3f6e"
        opacity="0.9"
      />
    </svg>
  );
}
```

- [ ] **Step 3: Create the PolkaBand**

```tsx
// src/components/ui/PolkaBand.tsx
export function PolkaBand({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`bg-red bg-[radial-gradient(circle,_#ffffff_2px,_transparent_2.5px)] bg-[length:16px_16px] ${
        className ?? ""
      }`}
    />
  );
}
```

- [ ] **Step 4: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no output, exit code 0.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/Wordmark.tsx src/components/ui/WaveDivider.tsx src/components/ui/PolkaBand.tsx
git commit -m "Agregar wordmark y motivos de marca (ondas y lunares)"
```

---

### Task 7: Header and page composition bootstrap

**Files:**
- Create: `src/components/layout/Header.tsx`
- Modify: `src/app/page.tsx:1-69` (full rewrite — removes the default `create-next-app` boilerplate)
- Delete: `src/components/layout/.gitkeep`

**Interfaces:**
- Consumes: `Wordmark`, `Button` (Tasks 5–6).
- Produces: `Header` component, rendered by `page.tsx`. `page.tsx` now exports the real `Home` composition that later tasks extend.

- [ ] **Step 1: Create the Header**

```tsx
// src/components/layout/Header.tsx
"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Wordmark } from "@/components/ui/Wordmark";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { href: "#menu", label: "Menu" },
  { href: "#locations", label: "Find Us" },
  { href: "#contact", label: "Book Us" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-navy/10 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <a href="#top" className="shrink-0">
          <Wordmark className="origin-left scale-75" />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-heading text-sm font-bold uppercase tracking-wide text-navy hover:text-red"
            >
              {link.label}
            </a>
          ))}
          <Button href="#contact" variant="primary">
            Book Us
          </Button>
        </nav>

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="text-navy md:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isOpen && (
        <nav className="flex flex-col gap-4 border-t border-navy/10 bg-cream px-6 py-4 md:hidden">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="font-heading text-sm font-bold uppercase tracking-wide text-navy"
            >
              {link.label}
            </a>
          ))}
          <Button href="#contact" variant="primary" onClick={() => setIsOpen(false)}>
            Book Us
          </Button>
        </nav>
      )}
    </header>
  );
}
```

- [ ] **Step 2: Replace `page.tsx` with the real composition (Header only for now)**

```tsx
// src/app/page.tsx
import { Header } from "@/components/layout/Header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1" />
    </>
  );
}
```

- [ ] **Step 3: Remove the now-unnecessary placeholder**

```bash
git rm src/components/layout/.gitkeep
```

- [ ] **Step 4: Verify it compiles and renders**

Run: `npx tsc --noEmit`
Expected: no output, exit code 0.

Run: `npm run dev`, open `http://localhost:3000`.
Expected: a sticky beige header with the "Sazón" script wordmark on the left, nav
links (Menu / Find Us / Book Us) and a red "Book Us" button on the right (desktop),
collapsing into a hamburger menu below the `md` breakpoint that opens/closes on
click.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Header.tsx src/app/page.tsx
git commit -m "Armar Header con navegación y reemplazar el boilerplate de page.tsx"
```

---

### Task 8: Hero section

**Files:**
- Create: `src/components/sections/Hero.tsx`
- Modify: `src/app/page.tsx:1-9` (add `Hero` inside `<main>`)
- Delete: `src/components/sections/.gitkeep`

**Interfaces:**
- Consumes: `Wordmark`, `Button`, `WaveDivider` (Tasks 5–6), `next/image`.
- Produces: `Hero` component with `id="top"`, the anchor target for the Header's logo link (Task 7).

- [ ] **Step 1: Create the Hero section**

```tsx
// src/components/sections/Hero.tsx
import Image from "next/image";
import { Wordmark } from "@/components/ui/Wordmark";
import { Button } from "@/components/ui/Button";
import { WaveDivider } from "@/components/ui/WaveDivider";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-navy">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-2 md:py-28">
        <div className="text-center md:text-left">
          <Wordmark tone="white" className="mx-auto mb-6 md:mx-0" />
          <h1 className="font-heading text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            Venezuelan street food,
            <span className="text-gold"> served with sazón.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-lg text-white/80 md:mx-0">
            Arepas, tequeños and empanadas made fresh, wherever we set up next
            across Australia — or wherever your next event needs us.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center md:justify-start">
            <Button href="#menu" variant="primary">
              See the Menu
            </Button>
            <Button
              href="#contact"
              variant="secondary"
              className="border-white text-white hover:bg-white hover:text-navy"
            >
              Book Us for Your Event
            </Button>
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-[2.5rem] border-4 border-gold/60 shadow-2xl">
          <Image
            src="/images/2.jpeg"
            alt="Sazón team handing over a fresh order from the truck window"
            fill
            sizes="(min-width: 768px) 400px, 90vw"
            className="object-cover"
            priority
          />
        </div>
      </div>
      <WaveDivider className="block h-12 w-full" />
    </section>
  );
}
```

- [ ] **Step 2: Mount the Hero in `page.tsx`**

```tsx
// src/app/page.tsx
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Remove the now-unnecessary placeholder**

```bash
git rm src/components/sections/.gitkeep
```

- [ ] **Step 4: Verify it compiles and renders**

Run: `npx tsc --noEmit`
Expected: no output, exit code 0.

Run: `npm run dev`, open `http://localhost:3000`.
Expected: a full-width navy hero with the white "Sazón" wordmark, a headline with
the last words in gold, body copy, two buttons (solid red / outlined white), and
the truck hand-off photo (`2.jpeg`) in a rounded frame on the right (stacked below
the text on mobile). A gold/navy wave sits at the bottom edge of the section.
Clicking the header's wordmark scrolls to this section.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Hero.tsx src/app/page.tsx
git commit -m "Armar sección Hero con foto real y wave divider"
```

---

### Task 9: Menu section

**Files:**
- Create: `src/components/sections/Menu.tsx`
- Modify: `src/app/page.tsx:1-11` (add `Menu` inside `<main>`)

**Interfaces:**
- Consumes: `menuItems` (Task 3), `Badge` (Task 5), `next/image`.
- Produces: `Menu` component with `id="menu"`, the anchor target for the Header's "Menu" link and the Hero's "See the Menu" button.

- [ ] **Step 1: Create the Menu section**

```tsx
// src/components/sections/Menu.tsx
import Image from "next/image";
import { menuItems } from "@/lib/menu";
import { Badge } from "@/components/ui/Badge";

export function Menu() {
  return (
    <section id="menu" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="font-heading text-3xl font-extrabold text-navy sm:text-4xl">
          What&apos;s Cooking
        </h2>
        <p className="mt-3 text-navy/70">
          Prices vary by event — ask us on the day or when you book us.
        </p>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {menuItems.map((item) => (
          <article
            key={item.slug}
            className="flex flex-col overflow-hidden rounded-3xl bg-cream-soft shadow-md"
          >
            <div className="relative h-48 w-full">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col gap-3 p-5">
              <h3 className="font-heading text-lg font-bold text-navy">
                {item.name}
              </h3>
              <p className="flex-1 text-sm text-navy/70">{item.description}</p>
              {item.badges.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.badges.map((badge) => (
                    <Badge key={badge} type={badge} />
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Mount the Menu section in `page.tsx`**

```tsx
// src/app/page.tsx
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { Menu } from "@/components/sections/Menu";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Menu />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Verify it compiles and renders**

Run: `npx tsc --noEmit`
Expected: no output, exit code 0.

Run: `npm run dev`, open `http://localhost:3000`.
Expected: below the Hero, a "What's Cooking" heading and a 4-column grid (2 on
tablet, 1 on mobile) of cards showing the Filled Arepa, Tequeños, Empanadas and
Sazón Bowl photos, each with a name, description, and a colored badge where
applicable (New / Vegetarian / 🌶 Spicy). Clicking "See the Menu" in the Hero or
"Menu" in the header scrolls here.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Menu.tsx src/app/page.tsx
git commit -m "Armar sección de Menú con las cards de platos"
```

---

### Task 10: Locations section

**Files:**
- Create: `src/components/sections/Locations.tsx`
- Modify: `src/app/page.tsx:1-13` (add `Locations` inside `<main>`)

**Interfaces:**
- Consumes: `upcomingEvents` (Task 4), `Button` (Task 5), `lucide-react` icons, `next/image`.
- Produces: `Locations` component with `id="locations"`, the anchor target for the Header's "Find Us" link.

- [ ] **Step 1: Create the Locations section**

```tsx
// src/components/sections/Locations.tsx
import Image from "next/image";
import { MapPin, Clock } from "lucide-react";
import { upcomingEvents } from "@/lib/events";
import { Button } from "@/components/ui/Button";

export function Locations() {
  return (
    <section id="locations" className="bg-cream-soft py-20">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2 md:items-center">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-lg">
          <Image
            src="/images/5.jpeg"
            alt="Sazón empanadas ready to serve at a market stop"
            fill
            sizes="(min-width: 768px) 500px, 90vw"
            className="object-cover"
          />
        </div>

        <div>
          <h2 className="font-heading text-3xl font-extrabold text-navy sm:text-4xl">
            Find Us Next
          </h2>
          <p className="mt-3 text-navy/70">
            Our spot changes with every market and event. Here&apos;s where
            we&apos;re headed — follow us on social for real-time updates.
          </p>

          <ul className="mt-8 space-y-4">
            {upcomingEvents.map((event) => (
              <li key={event.slug} className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="font-heading font-bold text-navy">{event.title}</p>
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-navy/70">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={16} className="text-red" />
                    {event.city}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={16} className="text-red" />
                    {event.date} · {event.time}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <Button href="#contact" variant="primary" className="mt-8">
            Want Us at Your Event Instead?
          </Button>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Mount the Locations section in `page.tsx`**

```tsx
// src/app/page.tsx
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { Menu } from "@/components/sections/Menu";
import { Locations } from "@/components/sections/Locations";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Menu />
        <Locations />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Verify it compiles and renders**

Run: `npx tsc --noEmit`
Expected: no output, exit code 0.

Run: `npm run dev`, open `http://localhost:3000`.
Expected: below Menu, a cream-soft section with the empanadas-trays photo
(`5.jpeg`) on one side and a list of three example events (Sydney, Melbourne,
Brisbane) with pin/clock icons on the other, plus a red "Want Us at Your Event
Instead?" button. Clicking "Find Us" in the header scrolls here.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Locations.tsx src/app/page.tsx
git commit -m "Armar sección Dónde encontrarnos con próximos eventos"
```

---

### Task 11: Contact section

**Files:**
- Create: `src/components/sections/Contact.tsx`
- Modify: `src/app/page.tsx:1-15` (add `Contact` inside `<main>`)

**Interfaces:**
- Consumes: `Button` (Task 5).
- Produces: `Contact` component with `id="contact"`, the anchor target for the Header's "Book Us" link/button and every "Book Us" / "Want Us at Your Event Instead?" CTA.

- [ ] **Step 1: Create the Contact section**

```tsx
// src/components/sections/Contact.tsx
"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";

interface ContactFormState {
  name: string;
  email: string;
  eventType: string;
  eventDate: string;
  message: string;
}

const initialState: ContactFormState = {
  name: "",
  email: "",
  eventType: "",
  eventDate: "",
  message: "",
};

export function Contact() {
  const [form, setForm] = useState<ContactFormState>(initialState);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section id="contact" className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h2 className="font-heading text-3xl font-extrabold text-navy">
          Thanks, {form.name.split(" ")[0] || "there"}!
        </h2>
        <p className="mt-4 text-navy/70">
          We&apos;ve got your request for {form.eventType || "your event"}.
          We&apos;ll be in touch soon to lock in the details.
        </p>
      </section>
    );
  }

  return (
    <section id="contact" className="mx-auto max-w-2xl px-6 py-20">
      <div className="text-center">
        <h2 className="font-heading text-3xl font-extrabold text-navy sm:text-4xl">
          Book Us for Your Event
        </h2>
        <p className="mt-3 text-navy/70">
          Tell us a bit about your event and we&apos;ll get back to you with
          availability and pricing.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="text-sm font-semibold text-navy">
              Name
            </label>
            <input
              id="name"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-navy/20 bg-white px-4 py-2.5 text-navy focus:border-red focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-semibold text-navy">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-navy/20 bg-white px-4 py-2.5 text-navy focus:border-red focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="eventType" className="text-sm font-semibold text-navy">
              Event type
            </label>
            <input
              id="eventType"
              name="eventType"
              placeholder="Wedding, market, office party…"
              required
              value={form.eventType}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-navy/20 bg-white px-4 py-2.5 text-navy focus:border-red focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="eventDate" className="text-sm font-semibold text-navy">
              Event date
            </label>
            <input
              id="eventDate"
              name="eventDate"
              type="date"
              required
              value={form.eventDate}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-navy/20 bg-white px-4 py-2.5 text-navy focus:border-red focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="text-sm font-semibold text-navy">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={form.message}
            onChange={handleChange}
            className="mt-1 w-full rounded-xl border border-navy/20 bg-white px-4 py-2.5 text-navy focus:border-red focus:outline-none"
          />
        </div>

        <Button type="submit" variant="primary" className="w-full sm:w-auto">
          Send Request
        </Button>
      </form>
    </section>
  );
}
```

- [ ] **Step 2: Mount the Contact section in `page.tsx`**

```tsx
// src/app/page.tsx
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { Menu } from "@/components/sections/Menu";
import { Locations } from "@/components/sections/Locations";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Menu />
        <Locations />
        <Contact />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Verify it compiles and renders**

Run: `npx tsc --noEmit`
Expected: no output, exit code 0.

Run: `npm run dev`, open `http://localhost:3000`.
Expected: a "Book Us for Your Event" form with Name/Email/Event type/Event date
fields, a Message textarea, and a red "Send Request" button. Submitting with the
required fields filled replaces the form with a "Thanks, `<first name>`!"
confirmation — no network request is made (check the Network tab is empty aside
from static assets). Every "Book Us" link/button in the page now scrolls here.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Contact.tsx src/app/page.tsx
git commit -m "Armar sección de Contacto con formulario client-side"
```

---

### Task 12: Footer

**Files:**
- Create: `src/components/layout/Footer.tsx`
- Modify: `src/app/page.tsx:1-17` (add `Footer` after `<main>`)

**Interfaces:**
- Consumes: `Wordmark`, `WaveDivider`, `PolkaBand` (Task 6), `lucide-react` icons.
- Produces: `Footer` component, the final piece of the page composition.

- [ ] **Step 1: Create the Footer**

```tsx
// src/components/layout/Footer.tsx
import { Instagram, Facebook, Mail } from "lucide-react";
import { Wordmark } from "@/components/ui/Wordmark";
import { WaveDivider } from "@/components/ui/WaveDivider";
import { PolkaBand } from "@/components/ui/PolkaBand";

export function Footer() {
  return (
    <footer className="relative mt-16 bg-navy-dark text-white">
      <WaveDivider className="absolute -top-12 left-0 h-12 w-full" flip />
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-16 text-center">
        <Wordmark tone="white" />
        <p className="max-w-md text-sm text-white/70">
          Venezuelan street food, cooked fresh and served with sazón —
          wherever the truck lands next across Australia.
        </p>
        <div className="flex items-center gap-5">
          <a href="#" aria-label="Instagram" className="hover:text-gold">
            <Instagram size={22} />
          </a>
          <a href="#" aria-label="Facebook" className="hover:text-gold">
            <Facebook size={22} />
          </a>
          <a href="#" aria-label="Email" className="hover:text-gold">
            <Mail size={22} />
          </a>
        </div>
      </div>
      <PolkaBand className="h-4 w-full" />
      <p className="bg-navy-dark pb-4 pt-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Sazón Venezuelan Street Food. All rights
        reserved.
      </p>
    </footer>
  );
}
```

- [ ] **Step 2: Mount the Footer in `page.tsx`**

```tsx
// src/app/page.tsx
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Menu } from "@/components/sections/Menu";
import { Locations } from "@/components/sections/Locations";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Menu />
        <Locations />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Verify it compiles and renders**

Run: `npx tsc --noEmit`
Expected: no output, exit code 0.

Run: `npm run build`
Expected: `Compiled successfully`, static page generated with no errors.

Run: `npm run dev`, open `http://localhost:3000`.
Expected: a dark navy footer at the very bottom with the white wordmark, a short
tagline, three social icons (Instagram/Facebook/Mail, currently linking to `#`),
a red polka-dot band, and a copyright line with the current year. A gold/navy
wave transitions into it from the Contact section above.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Footer.tsx src/app/page.tsx
git commit -m "Armar Footer con redes y motivo de lunares"
```

---

### Task 13: Full-site responsive and accessibility QA pass

**Files:** none expected — this task fixes whatever the checklist below turns up.
If issues are found, note the specific file(s) touched in the commit message.

- [ ] **Step 1: Run the full verification suite**

Run: `npx tsc --noEmit`
Expected: no output, exit code 0.

Run: `npm run lint`
Expected: no errors (warnings only, if any, should be reviewed and fixed if
trivial).

Run: `npm run build`
Expected: `Compiled successfully`, one static route (`/`).

- [ ] **Step 2: Manual desktop QA**

Run: `npm run dev`, open `http://localhost:3000` at a desktop viewport (≥1280px).

Checklist:
- Header stays pinned on scroll and its background turns solid over content.
- All nav links (Menu / Find Us / Book Us) and the header CTA scroll to the
  correct section.
- Hero, Menu, Locations, Contact and Footer all render their real photos
  (`1.jpeg`–`6.jpeg`) with no broken image icons.
- No layout overflow (no horizontal scrollbar) at 1280px and 1920px widths.

- [ ] **Step 3: Manual mobile QA**

In the browser dev tools, switch to a 375px-wide mobile viewport.

Checklist:
- Header collapses to a hamburger icon; opening it shows all nav links and the
  "Book Us" button; closing it (tap the X or a link) works.
- Hero image stacks below the text instead of beside it.
- Menu grid becomes a single column.
- Locations image and event list stack vertically.
- Contact form fields stack to one column and remain usable (no clipped
  inputs).
- No horizontal scrollbar at 375px width.

- [ ] **Step 4: Fix any issues found**

If the checklist above surfaces a problem, fix it directly in the relevant
component file (e.g. adjust a `md:`/`sm:` breakpoint class, correct an `alt`
text, fix a broken anchor). Re-run Steps 1–3 until the checklist passes clean.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "QA de responsive y accesibilidad de la landing completa"
```

If Step 4 required no fixes, skip this commit (nothing to commit).

---

## Self-review notes

- **Spec coverage:** every section in the design spec (Header, Hero, Menú, Dónde
  encontrarnos, Contratanos/Contacto, Footer) maps to a task; the color/typography
  system is centralized in Tasks 1–2; the wave/polka brand motif from the spec is
  implemented in Task 6 and used in Tasks 8 and 12; "Nuestra historia" is
  intentionally omitted per the user's explicit section selection; the contact
  form is intentionally client-side-only per the spec's "fuera de alcance" note.
- **Type consistency:** `MenuItem`/`MenuBadge` (Task 3) are used identically by
  `menuItems` (Task 3) and `Badge`/`Menu` (Tasks 5, 9). `EventListing` (Task 4)
  matches `upcomingEvents` and the `Locations` section (Task 10). The `Button`
  discriminated union (Task 5) is used consistently as a `Link` (with `href`)
  everywhere except the Contact form's submit button (Task 11), which omits
  `href` on purpose to render a native `<button type="submit">`.
