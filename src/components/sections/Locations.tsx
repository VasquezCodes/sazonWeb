import Image from "next/image";
import { MapPin, Clock } from "lucide-react";
import { upcomingEvents } from "@/lib/events";
import { Button } from "@/components/ui/Button";

export function Locations() {
  return (
    <section id="locations" className="bg-cream-soft py-20 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2 md:items-center">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-lg shadow-navy/15">
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
          <p className="mt-3 max-w-md text-navy/70">
            Our spot changes with every market and event, so here&apos;s
            where we&apos;re headed. Follow us on social for real-time
            updates.
          </p>

          <ul className="mt-8 space-y-4">
            {upcomingEvents.map((event) => (
              <li
                key={event.slug}
                className="rounded-2xl bg-white p-5 shadow-sm shadow-navy/5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md hover:shadow-navy/10"
              >
                <p className="font-heading font-bold text-navy">
                  {event.title}
                </p>
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-navy/70">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={16} className="shrink-0 text-red" />
                    {event.city}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={16} className="shrink-0 text-red" />
                    {event.date} · {event.time}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <Button href="#contact" variant="primary" className="mt-8">
            Get in touch
          </Button>
        </div>
      </div>
    </section>
  );
}
