"use client";

export function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Fundo preto */}
      <rect width="200" height="200" fill="#000000" rx="8"/>
      
      {/* Navalhas cruzadas */}
      <g transform="translate(100, 40)">
        {/* Navalha esquerda */}
        <path
          d="M -30 -15 L -20 -5 L -20 5 L -30 15"
          stroke="#FFFFFF"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <rect x="-25" y="-8" width="8" height="16" fill="#FFFFFF" opacity="0.8"/>
        
        {/* Navalha direita */}
        <path
          d="M 30 -15 L 20 -5 L 20 5 L 30 15"
          stroke="#FFFFFF"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <rect x="17" y="-8" width="8" height="16" fill="#FFFFFF" opacity="0.8"/>
      </g>
      
      {/* Estrela */}
      <polygon
        points="100,55 102,62 109,62 103,66 105,73 100,69 95,73 97,66 91,62 98,62"
        fill="#FFFFFF"
      />
      
      {/* Texto MAGANHA */}
      <text
        x="100"
        y="95"
        fontSize="18"
        fontWeight="bold"
        fill="#FFFFFF"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        letterSpacing="1"
      >
        MAGANHA
      </text>
      
      {/* Texto BARBEARIA */}
      <text
        x="100"
        y="120"
        fontSize="24"
        fontWeight="bold"
        fill="#FFFFFF"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        letterSpacing="1"
      >
        BARBEARIA
      </text>
      
      {/* Bigode */}
      <path
        d="M 80 140 Q 90 135 100 140 Q 110 135 120 140"
        stroke="#FFFFFF"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
