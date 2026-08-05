"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/Button";
import { PolkaBand } from "@/components/ui/PolkaBand";
import { WaveDivider } from "@/components/ui/WaveDivider";

gsap.registerPlugin(useGSAP);

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaGroupRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const polkaRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Only choreograph the entrance when the user has no preference
      // against motion. When "prefers-reduced-motion: reduce" is set, this
      // callback never runs at all, so every element simply keeps the final
      // state it already has on first paint (server-rendered, no animation,
      // no delay).
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const ctas = ctaGroupRef.current
          ? gsap.utils.toArray<HTMLElement>(ctaGroupRef.current.children)
          : [];

        // `immediateRender: true` on every step (not just the default for the
        // first) matters here: without it, GSAP defers applying a nested
        // tween's "from" state until the playhead reaches its position, so
        // later elements (subtext, CTAs, polka) would render in their
        // natural/final DOM state for a moment, then abruptly snap invisible
        // right as their turn starts before fading back in. Forcing it keeps
        // every element hidden from mount so each one only ever fades *in*.
        const tl = gsap.timeline({ defaults: { ease: "power3.out", immediateRender: true } });

        // The photo and the CTAs carry their own CSS hover transitions
        // (transition-transform / transition-all, for the existing
        // hover-lift and hover-swap polish). Left alone, the browser would
        // treat GSAP's inline style writes as just another style change to
        // ease over that same duration, fighting GSAP's own easing and
        // distorting the timing. `.set(..., { transitionProperty: "none" })`
        // switches those CSS transitions off for the entrance; each
        // tween's `clearProps` removes the override afterwards so the
        // original hover transitions resume normally.
        tl.from(line1Ref.current, { yPercent: 115, duration: 0.7, immediateRender: true, clearProps: "transform" }, 0)
          .from(line2Ref.current, { yPercent: 115, duration: 0.7, immediateRender: true, clearProps: "transform" }, 0.12)
          // Photo: rises in with its frame while the image itself settles
          // out of a gentle zoom, staying contained by the rounded frame's
          // overflow-hidden edge (the same "mask" idea as the headline).
          .from(imageWrapRef.current, { y: 24, opacity: 0, duration: 0.7, immediateRender: true, clearProps: "all" }, 0.18)
          .set(imageRef.current, { transitionProperty: "none" }, 0.18)
          // NOTE: next/image's `fill` mode relies on its own inline styles
          // (position/width/height/inset) to size the <img>. clearProps
          // must only remove the two inline properties GSAP itself added
          // here (scale's transform, and the transitionProperty override
          // above) — clearing "all" would strip Next's fill styles too and
          // collapse the image to its intrinsic size.
          .from(imageRef.current, {
            scale: 1.12,
            duration: 0.9,
            immediateRender: true,
            clearProps: "transform,transitionProperty",
          }, 0.18)
          .from(subtextRef.current, { y: 18, opacity: 0, duration: 0.6, immediateRender: true, clearProps: "all" }, 0.45)
          .set(ctas, { transitionProperty: "none" }, 0.6)
          .from(ctas, { y: 14, opacity: 0, duration: 0.5, stagger: 0.09, immediateRender: true, clearProps: "all" }, 0.6)
          // Polka accent: a single restrained "pop" that punctuates the
          // reveal once the photo has settled, using its existing tilt
          // (-rotate-6) as the resting rotation.
          .from(
            polkaRef.current,
            {
              scale: 0,
              rotation: "-=26",
              opacity: 0,
              duration: 0.55,
              ease: "back.out(1.6)",
              immediateRender: true,
              clearProps: "all",
            },
            0.55
          );

        return () => {
          tl.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="top" className="relative overflow-hidden bg-navy">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-14 lg:grid-cols-2 lg:py-20">
        <div className="text-center lg:text-left">
          <h1 className="font-heading text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-4xl">
            <span className="block overflow-hidden py-1">
              <span ref={line1Ref} className="inline-block">
                Street food,
              </span>
            </span>
            <span className="block overflow-hidden py-1">
              <span ref={line2Ref} className="inline-block text-gold">
                seasoned with sazón.
              </span>
            </span>
          </h1>
          <p ref={subtextRef} className="mx-auto mt-5 max-w-md text-lg text-white/80 lg:mx-0">
            Arepas, tequeños and empanadas made fresh across Australia, from
            our truck window to your next event.
          </p>
          <div
            ref={ctaGroupRef}
            className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
          >
            <Button href="#menu" variant="primary" className="transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0">
              See the Menu
            </Button>
            <Button
              href="#contact"
              variant="secondary"
              className="border-white text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-navy active:translate-y-0"
            >
              Book an Event
            </Button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
          <PolkaBand
            ref={polkaRef}
            className="absolute -bottom-5 -left-5 h-32 w-32 -rotate-6 rounded-4xl shadow-lg lg:h-40 lg:w-40"
          />
          <div
            ref={imageWrapRef}
            className="group relative aspect-square w-full rotate-1 overflow-hidden rounded-[2.5rem] border-4 border-gold/60 shadow-2xl"
          >
            <Image
              ref={imageRef}
              src="/images/2.jpeg"
              alt="Sazón team handing over a fresh order from the truck window"
              fill
              sizes="(min-width: 1024px) 480px, 90vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              priority
            />
          </div>
        </div>
      </div>
      <WaveDivider className="block h-12 w-full" />
    </section>
  );
}
