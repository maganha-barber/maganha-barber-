"use client";

import Image from "next/image";

export function Logo({ className = "h-10 w-10" }: { className?: string }) {
  // Extrair altura da className (Tailwind usa múltiplos de 4)
  const heightMatch = className.match(/h-(\d+)/);
  const widthMatch = className.match(/w-(\d+)/);
  
  const height = heightMatch ? parseInt(heightMatch[1]) * 4 : 40;
  const width = widthMatch ? parseInt(widthMatch[1]) * 4 : 40;
  
  return (
    <div className={className} style={{ position: "relative", display: "inline-block" }}>
      <Image
        src="/images/maganha.png"
        alt="Maganha Barbearia"
        width={width}
        height={height}
        className="object-contain w-full h-full"
        priority
        unoptimized
      />
    </div>
  );
}
