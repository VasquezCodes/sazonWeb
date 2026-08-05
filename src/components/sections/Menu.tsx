import Image from "next/image";
import { menuItems } from "@/lib/menu";
import { Badge } from "@/components/ui/Badge";

export function Menu() {
  return (
    <section id="menu" className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="font-heading text-3xl font-extrabold text-navy sm:text-4xl">
          What&apos;s Cooking
        </h2>
        <p className="mt-3 text-navy/70">
          Prices vary by event. Ask us on the day or when you book us.
        </p>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {menuItems.map((item) => (
          <article
            key={item.slug}
            className="group flex flex-col overflow-hidden rounded-3xl bg-cream-soft shadow-md shadow-navy/10 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-navy/15"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
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
