"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Wordmark } from "@/components/ui/Wordmark";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

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
