"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/**
 * Reveals its direct children one at a time as they scroll into view.
 *
 * Takes `children` as a prop rather than rendering the list itself, so the
 * caller stays a server component: only this wrapper and GSAP cross into the
 * client bundle, not the data or the icons inside the cards.
 *
 * Deliberately IntersectionObserver and not GSAP's ScrollTrigger, which is the
 * obvious tool for this and was the first implementation. ScrollTrigger sets
 * `scroll-behavior: auto` on <html> and <body> the moment it initialises
 * (ScrollTrigger.js:1086, "smooth scrolling interferes"), and that has two
 * costs here: it defeats the `scroll-behavior: smooth` in globals.css that the
 * header's anchor links rely on, and the inline style it writes is absent from
 * the SSR markup, so React reports a hydration mismatch on every load. Neither
 * is worth paying for a reveal this simple.
 */
export function ScrollStagger({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Same contract as the hero: under "prefers-reduced-motion: reduce" this
      // callback never runs, nothing is ever hidden, and the SSR markup is what
      // the user gets.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const container = containerRef.current;
        if (!container) return;

        const items = gsap.utils.toArray<HTMLElement>(container.children);

        // Hide up front, at mount, rather than tweening `from` on arrival. An
        // item is already 15% into view when it fires, so a `from()` would show
        // it, snap it back out and fade it in again.
        //
        // `transitionProperty: none` is not cosmetic: items are free to carry
        // their own CSS transitions for hover polish, and left alone the
        // browser eases over every inline style GSAP writes and fights its
        // easing. The `clearProps` below hands the transition — and the
        // `transform` that a hover lift needs to own — back to CSS once each
        // item has landed.
        gsap.set(items, { opacity: 0, y: 44, transitionProperty: "none" });

        const observer = new IntersectionObserver(
          (entries) => {
            // Everything that crossed in on this callback animates as one
            // group. That is what makes the reveal survive the grid reflowing
            // from four columns to one: at four columns the whole row arrives
            // together and the stagger is the entire effect, while stacked on a
            // phone each card arrives alone and gets its own group. A single
            // trigger for the whole grid would play cards 2-4 off-screen while
            // card 1 is the only one visible, and they would arrive already
            // static.
            const arrived = entries
              .filter((entry) => entry.isIntersecting)
              .map((entry) => entry.target as HTMLElement)
              // Entry order is not specified, so sort back into DOM order —
              // otherwise the stagger fires in whatever order the observer
              // happened to report and reads as random rather than as a
              // sequence.
              .sort((a, b) => items.indexOf(a) - items.indexOf(b));

            if (!arrived.length) return;

            // One-way: an item never re-hides on the way back up.
            arrived.forEach((item) => observer.unobserve(item));

            gsap.to(arrived, {
              opacity: 1,
              y: 0,
              duration: 0.65,
              ease: "power3.out",
              // 0.16s is chosen to be *seen*: below ~0.1 the items read as one
              // block arriving and the sequence stops being legible.
              stagger: 0.16,
              overwrite: true,
              clearProps: "all",
            });
          },
          // Pulling the bottom edge in by 15% is what ScrollTrigger would call
          // `start: "top 85%"` — the item has to be meaningfully on screen
          // before it counts as arrived.
          { rootMargin: "0px 0px -15% 0px" }
        );

        items.forEach((item) => observer.observe(item));

        return () => observer.disconnect();
      });

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
