"use client";

import { Logo } from "./Logo";

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
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div>
                <p className="text-4xl md:text-5xl font-bold text-gold-400 mb-2">
                  +500
                </p>
                <p className="text-neutral-300 text-xs md:text-sm uppercase tracking-wider">
                  Cliente satisfeitos
                </p>
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-bold text-gold-400 mb-2">
                  +5 anos
                </p>
                <p className="text-neutral-300 text-xs md:text-sm uppercase tracking-wider">
                  Salvando vidas
                </p>
              </div>
            </div>
          </div>

          {/* Coluna Direita - Logo */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md md:max-w-lg lg:max-w-xl">
              <Logo className="h-96 w-96 md:h-[28rem] md:w-[28rem] lg:h-[32rem] lg:w-[32rem] mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
