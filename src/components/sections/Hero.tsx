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
  const discRef = useRef<HTMLDivElement>(null);
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
          .from(discRef.current, { opacity: 0, duration: 1.1, clearProps: "all" }, 0.2)
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
    /* The base gradient runs straight down, and that is the whole reason the nav
       and the hero read as one surface. A diagonal axis cannot do it: on a box
       this wide, 148° puts the top-right corner ~67% along its own gradient
       line, so the hero's top edge arrived at the header already two thirds of
       the way to `cream`, and the flat `cream-lite` nav stepped off it. Vertical
       means every point on that edge is exactly `cream-lite`, the header's own
       colour, so there is nothing to see where they meet.
       The direction the diagonal was carrying — light where the headline is,
       toasted under the food — moves to the corner wash below, which fades out
       long before it reaches the top edge. */
    <section
      ref={sectionRef}
      id="top"
      // `svh`, not `vh`: on mobile `vh` is the *large* viewport, so the hero
      // would sit a browser-chrome's worth taller than the screen and push the
      // wave under the address bar on first paint. Minus the header, because
      // the header is in flow above this — together they are the first screen,
      // which is the whole point of the two sharing `--header-h`.
      className="relative isolate flex min-h-[calc(100svh-var(--header-h))] flex-col justify-center overflow-hidden bg-[linear-gradient(180deg,var(--color-cream-lite)_0%,var(--color-cream-soft)_58%,var(--color-cream)_100%)]"
    >
      {/* The toasted corner. Radial and anchored bottom-right rather than a
          second linear pass: its falloff is done by ~58% of the box, so the top
          edge stays untouched cream-lite no matter how wide the viewport gets. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_110%_at_100%_100%,var(--color-cream)_0%,transparent_58%)]"
      />
      {/* Warm pool behind the food. Unlike the washes the coloured heroes needed,
          this one is doing no contrast work — it sits well clear of the text
          column, so it can be purely atmospheric. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(46%_62%_at_74%_44%,rgba(226,160,74,0.2),transparent_70%)]"
      />
      <div aria-hidden="true" className="paper-grain pointer-events-none absolute inset-0" />

      {/* `w-full` because the section is a flex column now: without it this
          shrinks to its content instead of filling the width. The bottom
          padding outweighs the top so the centred block clears the wave. */}
      <div className="relative z-10 mx-auto grid w-full max-w-(--shell) grid-cols-1 items-center gap-2 px-6 pt-8 pb-20 sm:gap-6 lg:grid-cols-12 lg:gap-8 lg:pt-10 lg:pb-16">
        <div className="order-2 text-center lg:order-1 lg:col-span-7 lg:text-left">
          {/* The 3.5rem step waits for xl. At lg the container has no side
              margin left, so the text column is ~556px and this headline needs
              ~610px at that size, which pushed "sazon." onto a third line.
              The 4.75rem step is safe for the same reason it is needed: past
              1700px the shell is 90rem, so this column is ~800px wide and the
              two lines still hold. */}
          <h1 className="font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl xl:text-[4rem] xl:tracking-[-0.03em] 2xl:text-[4.75rem]">
            <span className="block overflow-hidden pb-1">
              <span ref={line1Ref} className="inline-block">
                Street food,
              </span>
            </span>
            <span className="block overflow-hidden pb-2">
              <span ref={line2Ref} className="inline-block">
                seasoned with{" "}
                {/* The brand's own script face, on the brand's own name. Not a
                    decorative family swap: this is the wordmark, quoted.

                    Red, now that the ground is cream and the warm accents are
                    usable at all. 4.1:1 on cream — over the 3:1 that display type
                    needs and under the 4.5:1 that body copy needs, so this colour
                    stays on the headline and must not be reused at smaller
                    sizes. The gold it used to be belongs to the wave now. */}
                <span className="font-script text-red">sazón</span>.
              </span>
            </span>
          </h1>

          {/* ink/75 is affordable on cream (5.2:1); on the saturated grounds the
              earlier directions used, body copy had to run at full strength just
              to clear AA. */}
          <p
            ref={subtextRef}
            className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-pretty text-ink/75 lg:mx-0 2xl:mt-7 2xl:max-w-xl 2xl:text-xl"
          >
            Arepas, tequeños and empanadas made fresh across Australia, from our
            truck window to your next event.
          </p>

          <div
            ref={ctaGroupRef}
            className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:justify-start"
          >
            {/* Wrap rather than a stacked column: two full-width stacked
                buttons read as a form, not as a hero. They sit side by side
                from about 390px up. The shared min-width is for the narrower
                phones where they do wrap, so the stacked pair comes out even
                instead of two pills of slightly different length. */}
            {/* Back to `primary`. 2a's rule is one action colour, so the hero's
                CTA is the same red as the nav's, just with a deeper shadow to
                match its larger size. */}
            <Button
              href="#contact"
              variant="primary"
              className="min-w-36 px-5 shadow-[0_10px_24px_rgba(192,61,39,0.26)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 sm:px-6"
            >
              Get in touch
            </Button>
            {/* No colour overrides any more. On the dark hero this had to be
                forced to white; on `celeste` the `secondary` variant's own
                ink-on-transparent is already right. */}
            <Button
              href="#menu"
              variant="secondary"
              className="min-w-36 px-5 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 sm:px-6"
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
          {/* The negative margin waits for xl too: it only has somewhere to go
              once the shell leaves a gutter. At lg it pushed the arepa past
              the viewport, where the section's overflow-hidden clipped it. The
              lg height matches the column's own width so the image stays
              height-constrained and the ring keeps sitting behind it. */}
          {/* On phones the box bleeds through the section's px-6 so the arepa
              can render at full viewport width instead of being boxed into the
              text column. object-contain fits inside this box, so widening it
              is the only way the food actually gets bigger. */}
          {/* The large steps track the shell: the column is 5/12 of it, so at
              82rem it is ~530px wide and at 90rem ~585px. The heights are set
              just under those widths to keep the box near-square — that is
              what lets `object-contain` use the full column instead of
              letterboxing the food inside a short, wide box. */}
          <div className="relative -mx-6 h-96 sm:mx-auto sm:h-95 sm:max-w-107.5 lg:h-97.5 lg:max-w-none xl:-mr-12 xl:h-110 2xl:h-128 min-[1700px]:h-144">
            {/* Where `celeste` earns its keep now that it is structural rather
                than an action colour: a disc the food sits against, and a thin
                ring outside it. On the coloured heroes these had to be a faint
                border and a blurred glow, since anything solid fought the
                background; against cream the disc can be the brand colour at
                full strength, which is what stops the food from floating.

                Two changes from 1b's flat disc. It is a radial gradient, lit from
                the top-left like the cream behind it, so the two agree on where
                the light comes from. And it is nudged up and left of centre while
                the ring stays concentric with the image — that small
                misalignment is deliberate: it puts disc edge under the food's
                lower right, exactly where the drop shadow lands, so the shadow
                falls *on* the disc and the food reads as sitting in front of it
                rather than pasted onto it. */}
            <div
              ref={ringRef}
              className="absolute left-1/2 top-1/2 aspect-square h-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-celeste/30 sm:border-2"
            />
            <div
              ref={discRef}
              className="absolute left-1/2 top-1/2 aspect-square h-[80%] translate-x-[calc(-50%-14px)] translate-y-[calc(-50%-10px)] rounded-full bg-[radial-gradient(72%_72%_at_34%_26%,var(--color-celeste-lite),var(--color-celeste))]"
            />

            <div ref={arepaEnterRef} className="absolute inset-0">
              <div ref={arepaFloatRef} className="relative h-full w-full">
                {/* One shadow, not the stacked pair a dark background needed,
                    and tighter and stronger than 1b's. It has a real job in 2a:
                    it has to land on the celeste disc, because that contact is
                    what separates the food from the disc. A softer, wider shadow
                    spread too far onto the cream to read as contact at all. */}
                <Image
                  src="/images/hero-arepa.webp"
                  alt="Shredded beef arepa topped with cheddar, in a Sazón wrap"
                  fill
                  sizes="(min-width: 1700px) 580px, (min-width: 1536px) 520px, (min-width: 1280px) 490px, (min-width: 1024px) 390px, (min-width: 640px) 430px, 340px"
                  className="object-contain filter-[drop-shadow(0_30px_26px_rgba(20,46,54,0.34))]"
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
