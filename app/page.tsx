import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { CTA } from "@/components/CTA";

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <Services />
      <CTA />
    </div>
  );
}
