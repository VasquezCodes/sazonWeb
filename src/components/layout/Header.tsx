"use client";

import { useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Wordmark } from "@/components/ui/Wordmark";
import { PolkaRail } from "@/components/ui/PolkaRail";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

// No "Contact" entry: the CTA beside these links already points at #contact,
// and two controls for one destination sitting next to each other is noise.
const navLinks = [
  { href: "#menu", label: "Menu" },
  { href: "#locations", label: "Find Us" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Only animate when the user has no preference against motion. If
      // "prefers-reduced-motion: reduce" is set, this callback never runs,
      // so the header simply keeps the final state it already has from SSR
      // (no animation, no delay).
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = rowRef.current ? gsap.utils.toArray<HTMLElement>(rowRef.current.children) : [];

        // The logo link carries its own CSS hover transition
        // (transition-transform, for the existing hover-lift polish).
        // Switch it off for the entrance so it doesn't fight GSAP's own
        // easing on the same property; `clearProps` restores it after.
        const tl = gsap.timeline({ defaults: { ease: "power2.out", immediateRender: true } });
        tl.set(items, { transitionProperty: "none" }).from(items, {
          y: -10,
          opacity: 0,
          duration: 0.5,
          stagger: 0.08,
          immediateRender: true,
          clearProps: "all",
        });

        return () => tl.kill();
      });

      return () => mm.revert();
    },
    { scope: headerRef }
  );

  return (
    // No bottom border, and `cream-lite` rather than a translucent `cream`:
    // those two together are what make the nav read as the top of the hero
    // instead of a strip stuck above it. `cream-lite` is the exact colour the
    // hero's gradient starts at, so there is no edge where they meet, and the
    // border that used to draw one is gone.
    //
    // Opaque, not `/95` + backdrop-blur: the blur only ever showed as a faint
    // seam once there was no border to hide it, and the header still has to be
    // readable over the teal band and the photos it scrolls across.
    <header ref={headerRef} className="sticky top-0 z-50 bg-cream-lite">
      {/* La franja de la marca, antes que el grano a propósito: el
          `paper-grain` de abajo multiplica sobre ella y le da la misma textura
          de papel que a la crema, de modo que las dos se leen como la misma
          pieza impresa y no como un SVG sobre un fondo. */}
      <PolkaRail className="relative h-(--header-rail) w-full" />

      {/* The same grain the hero runs. Colour alone was not enough for the two
          to read as one surface: the hero multiplies this texture over its
          cream and the bare header did not, which left the nav a shade cleaner
          than the ground directly under it. `z-50` above already makes the
          header its own stacking context, so the multiply stays inside it. */}
      <div aria-hidden="true" className="paper-grain pointer-events-none absolute inset-0" />

      {/* Fixed height instead of vertical padding: the hero sizes itself to
          `100svh - var(--header-h)`, and `--header-h` is this row plus the rail
          above it, so the row has to actually be `--header-row` tall or the
          first screen ends up over- or under-shooting by a few pixels. */}
      <div
        ref={rowRef}
        className="relative mx-auto flex h-(--header-row) max-w-(--shell) items-center justify-between px-6"
      >
        <a href="#top" className="shrink-0 transition-transform duration-200 ease-out hover:-translate-y-0.5">
          {/* Sin reducir. Estaba a `scale-75` de cuando el wordmark era solo
              texto; ahora que lleva el subrayado y los destellos, encogerlo
              dejaba los dos trazos demasiado finos para leerse sobre la crema.
              La fila creció con él, y como el hero se mide restando
              `--header-h`, el primer pantallazo se ajusta solo. */}
          <Wordmark />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative py-1 font-heading text-base font-bold uppercase tracking-wide text-ink transition-colors duration-200 hover:text-red focus-visible:outline-none focus-visible:text-red"
            >
              {link.label}
              <span className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 bg-red transition-transform duration-200 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100" />
            </a>
          ))}
          {/* Bumped with the links beside it: the pill's label has to stay the
              same size as the nav items or it reads as a smaller, weaker
              control sitting next to them. */}
          <Button href="#contact" variant="primary" className="text-base">
            Get in touch
          </Button>
        </nav>

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="rounded-full p-1.5 text-ink transition-colors duration-200 hover:bg-ink/5 hover:text-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red/50 md:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      <div
        className={cn(
          // No background of its own: it sits inside the header, so the
          // header's cream *and* its grain show through instead of the panel
          // laying a clean patch of colour over the texture.
          "relative grid overflow-hidden border-ink/10 transition-[grid-template-rows] duration-300 ease-out md:hidden",
          isOpen ? "grid-rows-[1fr] border-t" : "grid-rows-[0fr] border-t-0"
        )}
        inert={!isOpen}
      >
        <div className="min-h-0 overflow-hidden">
          <nav className="flex flex-col gap-4 px-6 py-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="font-heading text-base font-bold uppercase tracking-wide text-ink transition-colors duration-200 hover:text-red"
              >
                {link.label}
              </a>
            ))}
            <Button href="#contact" variant="primary" onClick={() => setIsOpen(false)} className="mt-1 w-full text-base">
              Get in touch
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
