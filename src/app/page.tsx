import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { Menu } from "@/components/sections/Menu";
import { Locations } from "@/components/sections/Locations";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Menu />
        <Locations />
      </main>
    </>
  );
}
