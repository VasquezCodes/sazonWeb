import Image from "next/image";
import { Wordmark } from "@/components/ui/Wordmark";
import { Button } from "@/components/ui/Button";
import { WaveDivider } from "@/components/ui/WaveDivider";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-navy">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
        <div className="text-center md:text-left">
          <Wordmark tone="white" className="mx-auto mb-6 md:mx-0" />
          <h1 className="font-heading text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-4xl">
            Street food,
            <span className="text-gold"> seasoned with sazón.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-lg text-white/80 md:mx-0">
            Arepas, tequeños and empanadas made fresh across Australia, from
            our truck window to your next event.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center md:justify-start">
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

        <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-[2.5rem] border-4 border-gold/60 shadow-2xl">
          <Image
            src="/images/2.jpeg"
            alt="Sazón team handing over a fresh order from the truck window"
            fill
            sizes="(min-width: 768px) 400px, 90vw"
            className="object-cover"
            priority
          />
        </div>
      </div>
      <WaveDivider className="block h-12 w-full" />
    </section>
  );
}
