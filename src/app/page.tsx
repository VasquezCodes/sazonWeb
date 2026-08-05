import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { Menu } from "@/components/sections/Menu";
import { Locations } from "@/components/sections/Locations";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Menu />
        <Locations />
        <Contact />
      </main>
    </>
  );
}
