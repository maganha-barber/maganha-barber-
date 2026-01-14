import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { About } from "@/components/About";

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <Services />
      <About />
    </div>
  );
}
