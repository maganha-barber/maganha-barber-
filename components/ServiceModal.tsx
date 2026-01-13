"use client";

import { X, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

interface Service {
  id: string;
  nome: string;
  descricao: string;
  duracao_minutos: number;
  preco: number;
  precoOriginal?: number;
  desconto?: number;
  itensInclusos?: string[];
  observacoes?: string;
}

interface ServiceModalProps {
  service: Service;
  isOpen: boolean;
  onClose: () => void;
}

export function ServiceModal({ service, isOpen, onClose }: ServiceModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  function formatDuration(minutes: number): string {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h e ${mins} min` : `${hours}h`;
    }
    return `${minutes} min`;
  }

  function handleAdicionarReserva() {
    // Redirecionar para página de agendamento com o serviço selecionado
    router.push(`/agendar?servico=${service.id}`);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-neutral-900">{service.nome}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-neutral-600" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Descrição */}
          <p className="text-neutral-600 mb-6">{service.descricao}</p>

          {/* Itens Inclusos */}
          {service.itensInclusos && service.itensInclusos.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-neutral-900 mb-3">Itens inclusos</h3>
              <div className="space-y-3">
                {service.itensInclusos.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between text-sm text-neutral-700">
                      <span>{item.split(" - ")[0]}</span>
                      {item.includes(" - ") && (
                        <span className="text-neutral-500">{item.split(" - ")[1]}</span>
                      )}
                    </div>
                    {index < service.itensInclusos!.length - 1 && (
                      <div className="h-px bg-neutral-200 my-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Observações */}
          {service.observacoes && (
            <div className="mb-6">
              <p className="text-sm text-neutral-600 italic">{service.observacoes}</p>
            </div>
          )}

          {/* Preço e Duração */}
          <div className="border-t border-neutral-200 pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-neutral-600">
                <Clock className="h-5 w-5" />
                <span>{formatDuration(service.duracao_minutos)}</span>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-neutral-900">
                    R$ {service.preco.toFixed(2)}
                  </span>
                  {service.precoOriginal && (
                    <span className="text-sm text-neutral-400 line-through">
                      R$ {service.precoOriginal.toFixed(2)}
                    </span>
                  )}
                </div>
                {service.desconto && (
                  <span className="text-sm font-semibold text-green-600">
                    Economize {service.desconto}%
                  </span>
                )}
              </div>
            </div>
            {service.itensInclusos && (
              <div className="text-sm text-neutral-600">
                <span>{service.itensInclusos.length} serviços</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-neutral-200 px-6 py-4 flex justify-end">
          <button
            onClick={handleAdicionarReserva}
            className="px-8 py-3 bg-neutral-900 text-white font-semibold rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Adicionar à reserva
          </button>
        </div>
      </div>
    </div>
  );
}
