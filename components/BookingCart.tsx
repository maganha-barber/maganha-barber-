"use client";

import { Logo } from "./Logo";
import { Star, MapPin } from "lucide-react";

interface Service {
  id: string;
  nome: string;
  duracao_minutos: number;
  preco: number;
  precoOriginal?: number;
  desconto?: number;
}

interface BookingCartProps {
  service: Service;
  barberName: string;
}

export function BookingCart({ service, barberName }: BookingCartProps) {
  function formatDuration(minutes: number): string {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h e ${mins} min` : `${hours}h`;
    }
    return `${minutes} min`;
  }

  const subtotal = service.precoOriginal || service.preco;
  const desconto = service.precoOriginal ? service.precoOriginal - service.preco : 0;
  const total = service.preco;

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-lg">
      {/* Logo e Info da Barbearia */}
      <div className="flex items-start gap-4 mb-6 pb-6 border-b border-neutral-200">
        <Logo className="h-16 w-16" />
        <div className="flex-1">
          <h3 className="font-bold text-lg text-neutral-900 mb-1">Maganha Barbearia</h3>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-sm text-neutral-600">5,0</span>
            <span className="text-sm text-neutral-400">(19)</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <MapPin className="h-4 w-4" />
            <span>Rua Marquês de Abrantes, Barbearia, Jardim Bom Astor, Minas Gerais</span>
          </div>
        </div>
      </div>

      {/* Resumo do Serviço */}
      <div className="mb-6 pb-6 border-b border-neutral-200">
        <h4 className="font-semibold text-neutral-900 mb-2">{service.nome}</h4>
        <div className="text-sm text-neutral-600 mb-3">
          {formatDuration(service.duracao_minutos)} • {service.precoOriginal ? "3 serviços" : "1 serviço"} com {barberName}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-neutral-900">R$ {total.toFixed(2)}</span>
          {service.precoOriginal && (
            <span className="text-sm text-neutral-400 line-through">R$ {subtotal.toFixed(2)}</span>
          )}
        </div>
      </div>

      {/* Resumo de Preços */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-600">Subtotal</span>
          <span className="text-neutral-900">R$ {subtotal.toFixed(2)}</span>
        </div>
        {desconto > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600">Descontos</span>
            <span className="text-green-600">-R$ {desconto.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between pt-2 border-t border-neutral-200">
          <span className="font-bold text-neutral-900">Total</span>
          <span className="font-bold text-lg text-neutral-900">R$ {total.toFixed(2)}</span>
        </div>
      </div>

    </div>
  );
}
