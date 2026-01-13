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
      <rect width="200" height="200" fill="#000000" rx="4"/>
      
      {/* Moldura em forma de chevron/triângulo invertido */}
      <path
        d="M 20 40 L 100 160 L 180 40"
        stroke="#FFFFFF"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.3"
      />
      
      {/* Navalhas cruzadas */}
      <g transform="translate(100, 50)">
        {/* Navalha esquerda */}
        <g transform="rotate(-45)">
          {/* Lâmina */}
          <path
            d="M -25 -8 L -15 -2 L -15 2 L -25 8"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Alça */}
          <rect x="-20" y="-6" width="10" height="12" fill="#FFFFFF" opacity="0.9"/>
          {/* Detalhes na alça */}
          <line x1="-18" y1="-4" x2="-12" y2="-4" stroke="#000000" strokeWidth="0.5"/>
          <line x1="-18" y1="0" x2="-12" y2="0" stroke="#000000" strokeWidth="0.5"/>
          <line x1="-18" y1="4" x2="-12" y2="4" stroke="#000000" strokeWidth="0.5"/>
        </g>
        
        {/* Navalha direita */}
        <g transform="rotate(45)">
          {/* Lâmina */}
          <path
            d="M 25 -8 L 15 -2 L 15 2 L 25 8"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Alça */}
          <rect x="10" y="-6" width="10" height="12" fill="#FFFFFF" opacity="0.9"/>
          {/* Detalhes na alça */}
          <line x1="12" y1="-4" x2="18" y2="-4" stroke="#000000" strokeWidth="0.5"/>
          <line x1="12" y1="0" x2="18" y2="0" stroke="#000000" strokeWidth="0.5"/>
          <line x1="12" y1="4" x2="18" y2="4" stroke="#000000" strokeWidth="0.5"/>
        </g>
      </g>
      
      {/* Estrela abaixo das navalhas */}
      <polygon
        points="100,75 102,82 109,82 103,86 105,93 100,89 95,93 97,86 91,82 98,82"
        fill="#FFFFFF"
      />
      
      {/* Texto MAGANHA */}
      <text
        x="100"
        y="110"
        fontSize="16"
        fontWeight="bold"
        fill="#FFFFFF"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        letterSpacing="2"
        style={{ textTransform: 'uppercase' }}
      >
        MAGANHA
      </text>
      
      {/* Texto BARBEARIA */}
      <text
        x="100"
        y="135"
        fontSize="22"
        fontWeight="bold"
        fill="#FFFFFF"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        letterSpacing="2"
        style={{ textTransform: 'uppercase' }}
      >
        BARBEARIA
      </text>
      
      {/* Bigode elegante */}
      <path
        d="M 70 155 Q 85 150 100 155 Q 115 150 130 155"
        stroke="#FFFFFF"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {/* Curvas do bigode */}
      <path
        d="M 70 155 Q 75 160 80 155"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 130 155 Q 125 160 120 155"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
