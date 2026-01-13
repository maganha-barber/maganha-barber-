"use client";

import { Phone, Mail, MapPin, Clock, Instagram, Facebook } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="w-full bg-neutral-900 text-white border-t border-gold-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo e Descrição */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Logo className="h-10 w-10 text-gold-400" />
              <span className="font-serif text-2xl font-bold text-gold-400">
                MagBarber
              </span>
            </div>
            <p className="text-neutral-300 mb-4 max-w-md text-sm">
              A melhor experiência em cuidados masculinos. Estilo premium,
              atendimento excepcional e agendamento digital simples.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 bg-gold-500/10 hover:bg-gold-500/20 rounded-full flex items-center justify-center transition-colors border border-gold-500/20"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4 text-gold-400" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-gold-500/10 hover:bg-gold-500/20 rounded-full flex items-center justify-center transition-colors border border-gold-500/20"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4 text-gold-400" />
              </a>
            </div>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-serif text-lg font-bold text-gold-400 mb-4">
              Contato
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-gold-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-neutral-300 text-sm">(11) 98765-4321</p>
                  <p className="text-neutral-400 text-xs">(11) 3456-7890</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-gold-400 mt-0.5 flex-shrink-0" />
                <p className="text-neutral-300 text-sm">contato@magbarber.com.br</p>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-gold-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-neutral-300 text-sm">
                    Rua das Barbearias, 123
                  </p>
                  <p className="text-neutral-400 text-xs">
                    Centro - São Paulo, SP
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Horários */}
          <div>
            <h3 className="font-serif text-lg font-bold text-gold-400 mb-4">
              Horários
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gold-400" />
                <span className="text-neutral-300 text-sm">
                  <strong>Seg - Sex:</strong> 9h às 19h
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gold-400" />
                <span className="text-neutral-300 text-sm">
                  <strong>Sábado:</strong> 8h às 18h
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-neutral-600" />
                <span className="text-neutral-500 text-sm">
                  <strong>Domingo:</strong> Fechado
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="border-t border-neutral-800 pt-6">
          <p className="text-center text-neutral-400 text-xs">
            © {new Date().getFullYear()} MagBarber. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
