import Image from "next/image";
import { menuItems } from "@/lib/menu";
import { Badge } from "@/components/ui/Badge";
import { ScrollStagger } from "@/components/ui/ScrollStagger";

export function Menu() {
  return (
    <section id="menu">
      {/* The heading sits on a full-bleed `celeste` band, and the band is the
          same colour as the lower half of the wave above it. That pairing is
          what 2a asks for: the wave resolves into this section rather than
          stopping dead against cream, so the divider reads as a transition
          between two grounds instead of as an ornament stuck on the hero's
          bottom edge. Cream on celeste is 7.3:1.

          Kept in `font-heading`, not the script face the mock shows: this
          codebase reserves `font-script` for the brand name itself, and
          borrowing it for a section heading would undo that distinction. */}
      <div className="bg-celeste px-6 py-12 text-center sm:py-14">
        <div className="mx-auto max-w-xl">
          <h2 className="font-heading text-3xl font-extrabold text-cream-lite sm:text-4xl">
            What&apos;s Cooking
          </h2>
          <p className="mt-3 text-cream-lite/85">
            Prices vary by event. Ask us on the day or send us a message.
          </p>
        </div>
      </div>

      <ScrollStagger className="mx-auto grid max-w-(--shell) gap-8 px-6 py-16 sm:grid-cols-2 sm:py-20 lg:grid-cols-4">
        {menuItems.map((item) => (
          /* The lift shadow warms to the light `celeste` on hover rather than just
             growing: it's how the accent colour reaches the middle of the page,
             where every surface is cream. */
          <article
            key={item.slug}
            className="group flex flex-col overflow-hidden rounded-3xl bg-cream-soft shadow-md shadow-ink/10 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-celeste/35"
          >
            {/* Square, because the dish photos are top-down plate shots: a
                landscape crop cuts the near and far edges off every plate. */}
            <div className="relative aspect-square w-full overflow-hidden">
              <Image
                src={item.image}
                alt={item.imageAlt}
                fill
                sizes="(min-width: 1700px) 324px, (min-width: 1440px) 294px, (min-width: 1024px) 264px, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col gap-3 p-5">
              <h3 className="font-heading text-lg font-bold text-ink">
                {item.name}
              </h3>
              <p className="flex-1 text-sm text-ink/70">{item.description}</p>
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
      </ScrollStagger>
    </section>
  );
}
