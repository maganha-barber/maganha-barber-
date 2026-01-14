"use client";

export function About() {
  return (
    <section id="sobre" className="w-full py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Sobre
          </h2>
          <div className="w-20 h-0.5 bg-gold-500 mx-auto"></div>
        </div>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-neutral-700 text-lg leading-relaxed mb-6">
            Maganha Barbearia é o seu destino para cortes de cabelo, barba e pezinho, com atendimento especializado e um ambiente acolhedor. Não nos limitamos aos cortes masculinos, oferecendo também serviços para todos os estilos e necessidades.
          </p>
          <p className="text-neutral-700 text-lg leading-relaxed mb-6">
            Nosso objetivo é proporcionar uma experiência completa, onde cada detalhe é cuidadosamente pensado para garantir sua satisfação. Venha nos visitar e descubra porque somos referência em cuidado e estilo.
          </p>
          <p className="text-neutral-700 text-lg leading-relaxed font-semibold">
            Maganha Barbearia: tradição, modernidade e excelência em cada atendimento.
          </p>
        </div>
      </div>
    </section>
  );
}
