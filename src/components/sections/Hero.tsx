"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/Button";
import { WaveDivider } from "@/components/ui/WaveDivider";

gsap.registerPlugin(useGSAP);

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaGroupRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const arepaEnterRef = useRef<HTMLDivElement>(null);
  const arepaFloatRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Only choreograph when the user has no preference against motion. Under
      // "prefers-reduced-motion: reduce" this callback never runs, so every
      // element keeps the final state it already has from SSR: no animation,
      // no delay, nothing hidden.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const ctas = ctaGroupRef.current
          ? gsap.utils.toArray<HTMLElement>(ctaGroupRef.current.children)
          : [];

        // `immediateRender: true` on every step (not just the default for the
        // first) matters here: without it GSAP defers a nested tween's "from"
        // state until the playhead reaches its position, so later elements
        // would paint in their natural state, snap invisible when their turn
        // starts, then fade back in. Forcing it keeps everything hidden from
        // mount so each element only ever fades *in*.
        const tl = gsap.timeline({
          defaults: { ease: "power3.out", immediateRender: true },
        });

        // The CTAs carry their own CSS transitions for hover polish. Left
        // alone, the browser eases over GSAP's inline style writes too and
        // fights its easing, so switch them off for the entrance; `clearProps`
        // restores the hover behaviour afterwards.
        tl.from(line1Ref.current, { yPercent: 115, duration: 0.7, clearProps: "transform" }, 0)
          .from(line2Ref.current, { yPercent: 115, duration: 0.7, clearProps: "transform" }, 0.12)
          // The ring opens first so the arepa has a stage to land on.
          .from(
            ringRef.current,
            { scale: 0.72, opacity: 0, duration: 0.8, clearProps: "all" },
            0.15
          )
          .from(glowRef.current, { opacity: 0, duration: 1.1, clearProps: "all" }, 0.2)
          // The arepa arrives last and largest: it rises past the ring's edge
          // and settles out of a small overshoot, which is what reads as
          // weight. Only the entrance wrapper is touched here so the ambient
          // float below can own its own transform on a separate element.
          .from(
            arepaEnterRef.current,
            {
              y: 64,
              scale: 0.9,
              opacity: 0,
              duration: 1,
              ease: "power3.out",
              clearProps: "all",
            },
            0.28
          )
          .from(subtextRef.current, { y: 18, opacity: 0, duration: 0.6, clearProps: "all" }, 0.5)
          .set(ctas, { transitionProperty: "none" }, 0.62)
          .from(
            ctas,
            { y: 14, opacity: 0, duration: 0.5, stagger: 0.09, clearProps: "all" },
            0.62
          );

        // Ambient float. This is the whole point of a cutout with no ground
        // under it, so it runs on its own element and its own transform,
        // nested inside the entrance wrapper to keep the two from overwriting
        // each other's `y`.
        const float = gsap.to(arepaFloatRef.current, {
          y: -14,
          duration: 3.2,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: 1.2,
        });

        return () => {
          tl.kill();
          float.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="top" className="relative isolate overflow-hidden bg-navy">
      {/* Warm pool of light under the food, cool falloff at the edges, so the
          cutout sits in a lit space instead of on a flat block of navy. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_72%_45%,rgba(240,180,41,0.16),transparent_60%),radial-gradient(90%_90%_at_20%_10%,rgba(18,44,80,0),rgba(18,44,80,0.85))]"
      />

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-6 px-6 pt-10 pb-20 lg:grid-cols-12 lg:gap-8 lg:pt-14 lg:pb-10">
        <div className="order-2 text-center lg:order-1 lg:col-span-7 lg:text-left">
          <h1 className="font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
            <span className="block overflow-hidden pb-1">
              <span ref={line1Ref} className="inline-block">
                Street food,
              </span>
            </span>
            <span className="block overflow-hidden pb-2">
              <span ref={line2Ref} className="inline-block">
                seasoned with{" "}
                {/* The brand's own script face, on the brand's own name. Not a
                    decorative family swap: this is the wordmark, quoted. */}
                <span className="font-script text-gold">sazón</span>.
              </span>
            </span>
          </h1>

          <p ref={subtextRef} className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-white/75 lg:mx-0">
            Arepas, tequeños and empanadas made fresh across Australia, from our
            truck window to your next event.
          </p>

          <div
            ref={ctaGroupRef}
            className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
          >
            <Button
              href="#contact"
              variant="primary"
              className="w-full transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 sm:w-auto"
            >
              Get in touch
            </Button>
            <Button
              href="#menu"
              variant="secondary"
              className="w-full border-white text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-navy active:translate-y-0 sm:w-auto"
            >
              See the Menu
            </Button>
          </div>
        </div>

        {/* The food column deliberately overflows its track on both sides so
            the arepa reads as sitting in front of the layout rather than
            inside a cell. */}
        <div className="relative order-1 lg:order-2 lg:col-span-5">
          {/* Height-driven rather than aspect-driven: the ring is a true circle
              sized off this box's height, and the arepa is free to overhang it
              on both sides without stretching the hero taller. */}
          <div className="relative mx-auto h-72.5 w-full max-w-85 sm:h-95 sm:max-w-107.5 lg:h-110 lg:max-w-none lg:-mr-12">
            <div
              ref={ringRef}
              className="absolute left-[54%] top-[40%] aspect-square h-[84%] -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-gold/75 sm:border-[6px]"
            />
            <div
              ref={glowRef}
              className="absolute left-[54%] top-[40%] aspect-square h-[84%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(240,180,41,0.24),transparent_70%)] blur-xl"
            />

            <div ref={arepaEnterRef} className="absolute inset-0">
              <div ref={arepaFloatRef} className="relative h-full w-full">
                <Image
                  src="/images/hero-arepa.webp"
                  alt="Shredded beef arepa topped with cheddar, in a Sazón wrap"
                  fill
                  sizes="(min-width: 1024px) 530px, (min-width: 640px) 430px, 340px"
                  className="object-contain filter-[drop-shadow(0_18px_24px_rgba(10,26,48,0.55))_drop-shadow(0_44px_70px_rgba(10,26,48,0.45))]"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <WaveDivider className="absolute inset-x-0 bottom-0 z-0 block h-12 w-full" />
    </section>
  );
}
