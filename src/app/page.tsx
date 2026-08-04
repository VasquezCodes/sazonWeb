import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
      </main>
    </>
  );
}
