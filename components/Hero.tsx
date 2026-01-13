"use client";

import Link from "next/link";
import { Calendar } from "lucide-react";

export function Hero() {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Imagem de fundo */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')"
        }}
      >
        {/* Overlay escuro para melhorar legibilidade */}
        <div className="absolute inset-0 bg-neutral-900/60"></div>
      </div>

      {/* Conteúdo centralizado */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center z-10">
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 drop-shadow-lg">
          Maganha Barbearia
        </h1>
        <p className="text-xl md:text-2xl text-white mb-12 max-w-3xl mx-auto font-light drop-shadow-md">
          Especialistas em cuidados masculinos premium. Agende seu horário e experimente o melhor atendimento da região.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/agendar"
            className="inline-flex items-center gap-3 bg-gold-500 text-neutral-900 px-8 py-4 text-lg font-semibold hover:bg-gold-400 transition-all shadow-lg hover:shadow-xl rounded-lg"
          >
            <Calendar className="h-6 w-6" />
            Agendar Agora
          </Link>
        </div>
      </div>
    </section>
  );
}
