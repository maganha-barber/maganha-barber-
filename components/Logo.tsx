"use client";

import Image from "next/image";

export function Logo({ className = "h-10 w-10" }: { className?: string }) {
  // Extrair altura e largura da className se possível
  const sizeMatch = className.match(/(?:h-|w-)(\d+)/);
  const size = sizeMatch ? parseInt(sizeMatch[1]) * 4 : 40; // Tailwind usa múltiplos de 4
  
  return (
    <div className={className} style={{ position: "relative" }}>
      <Image
        src="/images/maganha.png"
        alt="Maganha Barbearia"
        width={size}
        height={size}
        className="object-contain"
        priority
        unoptimized
      />
    </div>
  );
}
