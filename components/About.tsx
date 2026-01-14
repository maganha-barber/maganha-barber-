"use client";

export function About() {
  return (
    <section id="sobre" className="w-full py-20 bg-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Coluna Esquerda - Texto */}
          <div className="text-white">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              Sobre a Maganha Barbearia
            </h2>
            <p className="text-neutral-300 text-lg leading-relaxed mb-8">
              Maganha Barbearia é o seu destino para cortes de cabelo, barba e pezinho, com atendimento especializado e um ambiente acolhedor. Não nos limitamos aos cortes masculinos, oferecendo também serviços para todos os estilos e necessidades. Nosso objetivo é proporcionar uma experiência completa, onde cada detalhe é cuidadosamente pensado para garantir sua satisfação. Venha nos visitar e descubra porque somos referência em cuidado e estilo. Maganha Barbearia: tradição, modernidade e excelência em cada atendimento.
            </p>
            
            {/* Estatísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-1 gap-6">
              <div>
                <p className="text-3xl md:text-4xl font-bold text-gold-400 mb-2">
                  +5 anos
                </p>
                <p className="text-neutral-300 text-sm">
                  Salvando vidas
                </p>
              </div>
            </div>
          </div>

          {/* Coluna Direita - Logo */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              <Logo className="h-full w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Componente Logo inline para a seção Sobre
function Logo({ className = "h-64 w-64" }: { className?: string }) {
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
          {/* Alça com listras */}
          <rect x="-22" y="-7" width="8" height="14" fill="#FFFFFF"/>
          {/* Listras horizontais na alça */}
          <line x1="-20" y1="-5" x2="-14" y2="-5" stroke="#000000" strokeWidth="0.8"/>
          <line x1="-20" y1="-1" x2="-14" y2="-1" stroke="#000000" strokeWidth="0.8"/>
          <line x1="-20" y1="3" x2="-14" y2="3" stroke="#000000" strokeWidth="0.8"/>
          <line x1="-20" y1="7" x2="-14" y2="7" stroke="#000000" strokeWidth="0.8"/>
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
          {/* Alça com listras */}
          <rect x="14" y="-7" width="8" height="14" fill="#FFFFFF"/>
          {/* Listras horizontais na alça */}
          <line x1="16" y1="-5" x2="20" y2="-5" stroke="#000000" strokeWidth="0.8"/>
          <line x1="16" y1="-1" x2="20" y2="-1" stroke="#000000" strokeWidth="0.8"/>
          <line x1="16" y1="3" x2="20" y2="3" stroke="#000000" strokeWidth="0.8"/>
          <line x1="16" y1="7" x2="20" y2="7" stroke="#000000" strokeWidth="0.8"/>
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
