"use client";

import { useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Wordmark } from "@/components/ui/Wordmark";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

const navLinks = [
  { href: "#menu", label: "Menu" },
  { href: "#locations", label: "Find Us" },
  { href: "#contact", label: "Book Us" },
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
    <header ref={headerRef} className="sticky top-0 z-50 border-b border-navy/10 bg-cream/95 backdrop-blur">
      <div ref={rowRef} className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <a href="#top" className="shrink-0 transition-transform duration-200 ease-out hover:-translate-y-0.5">
          <Wordmark className="origin-left scale-75" />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative py-1 font-heading text-sm font-bold uppercase tracking-wide text-navy transition-colors duration-200 hover:text-red focus-visible:outline-none focus-visible:text-red"
            >
              {link.label}
              <span className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 bg-red transition-transform duration-200 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100" />
            </a>
          ))}
          <Button href="#contact" variant="primary">
            Book Us
          </Button>
        </nav>

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="rounded-full p-1.5 text-navy transition-colors duration-200 hover:bg-navy/5 hover:text-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red/50 md:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      <div
        className={cn(
          "grid overflow-hidden border-navy/10 bg-cream transition-[grid-template-rows] duration-300 ease-out md:hidden",
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
                className="font-heading text-sm font-bold uppercase tracking-wide text-navy transition-colors duration-200 hover:text-red"
              >
                {link.label}
              </a>
            ))}
            <Button href="#contact" variant="primary" onClick={() => setIsOpen(false)} className="mt-1 w-full">
              Book Us
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
