"use client";

import Link from "next/link";
import { Calendar, Phone } from "lucide-react";

export function CTA() {
  return (
    <section className="w-full py-20 bg-gradient-to-br from-neutral-800 to-neutral-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-64 h-64 border border-gold-500/20 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 border border-gold-500/20 rounded-full translate-x-1/2 translate-y-1/2"></div>
      </div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-white">
          Pronto para sua Transformação?
        </h2>
        <p className="text-lg mb-10 text-neutral-300 font-medium">
          Agende seu horário agora e experimente o melhor atendimento
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/agendar"
            className="inline-flex items-center gap-3 bg-gold-500 text-neutral-900 px-8 py-4 text-base font-semibold hover:bg-gold-400 transition-all shadow-lg hover:shadow-xl rounded-md"
          >
            <Calendar className="h-5 w-5" />
            Agendar Agora
          </Link>
          <a
            href="tel:+5511987654321"
            className="inline-flex items-center gap-3 border border-gold-500/50 text-gold-400 px-8 py-4 text-base font-medium hover:bg-gold-500/10 hover:border-gold-500 transition-all rounded-md"
          >
            <Phone className="h-5 w-5" />
            Ligar Agora
          </a>
        </div>
      </div>
    </section>
  );
}
