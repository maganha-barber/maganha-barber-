"use client";

import Image from "next/image";

export function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <div className={className} style={{ position: "relative", width: "100%", height: "100%" }}>
      <Image
        src="/images/maganha.png"
        alt="Maganha Barbearia"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}
