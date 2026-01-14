"use client";

import { Phone, Mail, MapPin, Clock, Instagram, MessageCircle, Scissors } from "lucide-react";

export function Footer() {
  const horarios = [
    { dia: "segunda-feira", aberto: false },
    { dia: "terça-feira", horarios: ["09:00 - 12:00", "14:00 - 19:00"] },
    { dia: "quarta-feira", horarios: ["09:00 - 12:00", "14:00 - 19:00"] },
    { dia: "quinta-feira", horarios: ["09:00 - 12:00", "14:00 - 19:00"] },
    { dia: "sexta-feira", horarios: ["09:00 - 12:00", "14:00 - 19:00"] },
    { dia: "sábado", horarios: ["09:00 - 12:00", "13:00 - 19:00"] },
    { dia: "domingo", aberto: false },
  ];

  return (
    <footer className="w-screen bg-neutral-900 text-white border-t border-gold-500/20" style={{ margin: 0, padding: 0 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo e Descrição */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Scissors className="h-8 w-8 md:h-10 md:w-10 text-gold-400" />
              <span className="font-serif text-2xl font-bold text-gold-400">
                Maganha Barbearia
              </span>
            </div>
            <p className="text-neutral-300 mb-4 max-w-md text-sm">
              Tradição, modernidade e excelência em cada atendimento.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/maganha_barbearia/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gold-500/10 hover:bg-gold-500/20 rounded-full flex items-center justify-center transition-colors border border-gold-500/20"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4 text-gold-400" />
              </a>
              <a
                href="https://wa.me/5535998361668"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gold-500/10 hover:bg-gold-500/20 rounded-full flex items-center justify-center transition-colors border border-gold-500/20"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4 text-gold-400" />
              </a>
            </div>
          </div>

          {/* Contato */}
          <div className="col-span-1">
            <h3 className="font-serif text-lg font-bold text-gold-400 mb-4">
              Contato
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-gold-400 mt-0.5 flex-shrink-0" />
                <a href="tel:+5535998361668" className="text-neutral-300 text-sm hover:text-gold-400 transition-colors">
                  35 99836-1668
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-gold-400 mt-0.5 flex-shrink-0" />
                <a href="mailto:contato@maganhabarbearia.com.br" className="text-neutral-300 text-sm hover:text-gold-400 transition-colors break-all">
                  contato@maganhabarbearia.com.br
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-gold-400 mt-0.5 flex-shrink-0" />
                <p className="text-neutral-300 text-sm leading-relaxed">
                  Rua Marquês de Abrantes, Barbearia<br />
                  Jardim Bom Astor, Minas Gerais
                </p>
              </li>
            </ul>
          </div>

          {/* Horários */}
          <div className="col-span-1">
            <h3 className="font-serif text-lg font-bold text-gold-400 mb-4">
              Horários de funcionamento
            </h3>
            <ul className="space-y-2">
              <li className="text-neutral-300 text-sm">
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 mt-0.5 flex-shrink-0 text-neutral-600" />
                  <div>
                    <span className="font-medium capitalize">segunda-feira</span>
                    <p className="text-neutral-500">Fechado</p>
                  </div>
                </div>
              </li>
              <li className="text-neutral-300 text-sm">
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 mt-0.5 flex-shrink-0 text-gold-400" />
                  <div>
                    <span className="font-medium">Terça a Sexta</span>
                    <div className="space-y-1">
                      <p className="text-neutral-300">09:00 - 12:00</p>
                      <p className="text-neutral-300">14:00 - 19:00</p>
                    </div>
                  </div>
                </div>
              </li>
              <li className="text-neutral-300 text-sm">
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 mt-0.5 flex-shrink-0 text-gold-400" />
                  <div>
                    <span className="font-medium capitalize">sábado</span>
                    <div className="space-y-1">
                      <p className="text-neutral-300">09:00 - 12:00</p>
                      <p className="text-neutral-300">13:00 - 19:00</p>
                    </div>
                  </div>
                </div>
              </li>
              <li className="text-neutral-300 text-sm">
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 mt-0.5 flex-shrink-0 text-neutral-600" />
                  <div>
                    <span className="font-medium capitalize">domingo</span>
                    <p className="text-neutral-500">Fechado</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="border-t border-neutral-800 pt-6">
          <p className="text-center text-neutral-400 text-xs">
            © {new Date().getFullYear()} Maganha Barbearia. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
