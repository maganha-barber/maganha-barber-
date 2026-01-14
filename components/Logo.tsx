"use client";

export function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Fundo preto sólido */}
      <rect width="200" height="200" fill="#000000" rx="4"/>
      
      {/* Linhas do triângulo invertido/chevron - parte superior */}
      <path
        d="M 30 35 L 100 155 L 170 35"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Linhas do triângulo invertido - parte inferior */}
      <path
        d="M 50 165 L 100 155 L 150 165"
        stroke="#FFFFFF"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Navalhas cruzadas no topo */}
      <g transform="translate(100, 45)">
        {/* Navalha esquerda */}
        <g transform="rotate(-45)">
          {/* Lâmina */}
          <path
            d="M -28 -10 L -18 -3 L -18 3 L -28 10"
            stroke="#FFFFFF"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          {/* Alça com listras alternadas (preto e branco) */}
          <rect x="-22" y="-7" width="8" height="14" fill="#FFFFFF"/>
          {/* Listras horizontais na alça (alternando preto e branco) */}
          <rect x="-22" y="-7" width="8" height="2" fill="#000000"/>
          <rect x="-22" y="-3" width="8" height="2" fill="#FFFFFF"/>
          <rect x="-22" y="1" width="8" height="2" fill="#000000"/>
          <rect x="-22" y="5" width="8" height="2" fill="#FFFFFF"/>
          <rect x="-22" y="9" width="8" height="2" fill="#000000"/>
        </g>
        
        {/* Navalha direita */}
        <g transform="rotate(45)">
          {/* Lâmina */}
          <path
            d="M 28 -10 L 18 -3 L 18 3 L 28 10"
            stroke="#FFFFFF"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          {/* Alça com listras alternadas (preto e branco) */}
          <rect x="14" y="-7" width="8" height="14" fill="#FFFFFF"/>
          {/* Listras horizontais na alça (alternando preto e branco) */}
          <rect x="14" y="-7" width="8" height="2" fill="#000000"/>
          <rect x="14" y="-3" width="8" height="2" fill="#FFFFFF"/>
          <rect x="14" y="1" width="8" height="2" fill="#000000"/>
          <rect x="14" y="5" width="8" height="2" fill="#FFFFFF"/>
          <rect x="14" y="9" width="8" height="2" fill="#000000"/>
        </g>
      </g>
      
      {/* Estrela abaixo das navalhas */}
      <polygon
        points="100,70 102,77 109,77 103,81 105,88 100,84 95,88 97,81 91,77 98,77"
        fill="#FFFFFF"
      />
      
      {/* Texto MAGANHA - fonte serif com textura/distressed */}
      <text
        x="100"
        y="105"
        fontSize="14"
        fontWeight="bold"
        fill="#FFFFFF"
        textAnchor="middle"
        fontFamily="'Playfair Display', serif"
        letterSpacing="3"
        style={{ 
          textTransform: 'uppercase',
          filter: 'url(#texture)'
        }}
      >
        MAGANHA
      </text>
      
      {/* Texto BARBEARIA - fonte sans-serif maior e bold */}
      <text
        x="100"
        y="130"
        fontSize="26"
        fontWeight="900"
        fill="#FFFFFF"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        letterSpacing="3"
        style={{ 
          textTransform: 'uppercase'
        }}
      >
        BARBEARIA
      </text>
      
      {/* Bigode estilizado na parte inferior */}
      <g transform="translate(100, 150)">
        {/* Curva central */}
        <path
          d="M -30 0 Q 0 -8 30 0"
          stroke="#FFFFFF"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        {/* Curva esquerda */}
        <path
          d="M -30 0 Q -25 -5 -20 0"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Curva direita */}
        <path
          d="M 30 0 Q 25 -5 20 0"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Pontas do bigode */}
        <circle cx="-25" cy="0" r="2" fill="#FFFFFF"/>
        <circle cx="25" cy="0" r="2" fill="#FFFFFF"/>
      </g>
      
      {/* Filtro de textura para o texto MAGANHA */}
      <defs>
        <filter id="texture" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence baseFrequency="0.9" numOctaves="2" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.5"/>
        </filter>
      </defs>
    </svg>
  );
}
