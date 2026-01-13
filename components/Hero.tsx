"use client";

import Link from "next/link";
import { Calendar, Scissors } from "lucide-react";
import { Logo } from "./Logo";

export function Hero() {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 overflow-hidden">
      {/* Decorative elements - mais sutis */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-40 h-40 border border-gold-500/30 rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 border border-gold-500/30 rotate-45"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center z-10">
        <div className="flex justify-center mb-6">
          <Logo className="h-20 w-20 text-gold-400" />
        </div>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4">
          MagBarber
        </h1>
        <p className="text-lg md:text-xl text-gold-400 font-medium mb-2 tracking-wider">
          BARBERSHOP PREMIUM
        </p>
        <p className="text-base md:text-lg text-neutral-300 mb-12 max-w-2xl mx-auto">
          Estilo premium. Agendamento simples. Experiência única.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/agendar"
            className="inline-flex items-center gap-3 bg-gold-500 text-neutral-900 px-8 py-4 text-base font-semibold hover:bg-gold-400 transition-all shadow-lg hover:shadow-xl rounded-md"
          >
            <Calendar className="h-5 w-5" />
            Agendar Agora
          </Link>
          <Link
            href="/#servicos"
            className="inline-flex items-center gap-3 border border-gold-500/50 text-gold-400 px-8 py-4 text-base font-medium hover:bg-gold-500/10 hover:border-gold-500 transition-all rounded-md"
          >
            <Scissors className="h-5 w-5" />
            Ver Serviços
          </Link>
        </div>
      </div>
    </section>
  );
}
