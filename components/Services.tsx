"use client";

import { useState } from "react";
import { Clock, Plus, X } from "lucide-react";
import { ServiceModal } from "./ServiceModal";

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

const services: Service[] = [
  {
    id: "1",
    nome: "Completo (Corte, Barba, Sobrancelhas)",
    descricao: "Destinado para quem quer fazer todos os serviços oferecidos aqui na Barbearia",
    duracao_minutos: 80,
    preco: 78,
    precoOriginal: 95,
    desconto: 18,
    itensInclusos: [
      "Corte de cabelo (Somente adultos e crianças acima de 5 anos) - 40 min",
      "Barba - 30 min",
      "Sobrancelhas - 10 min",
    ],
  },
  {
    id: "2",
    nome: "Corte de cabelo",
    descricao: "Um dos requisitos mais importantes em uma imagem, com toda certeza é o cabelo, pois com o cabelo, você consegue \"deixar\" de ser uma pessoa e passa a \"ser\" outra pessoa, trazendo mais confiança para si mesmo e melhorando a forma como até mesmo as pessoas enxergam você 😉 E vai por mim, com certeza é para melhor!!!",
    duracao_minutos: 40,
    preco: 40,
    observacoes: "Somente adultos e crianças acima de 5 anos",
  },
  {
    id: "3",
    nome: "Barba",
    descricao: "Este tipo de serviço não se enquadra a todos, porém para que possamos passar uma autoridade maior e uma melhor imagem, este serviço é imprescindível (para quem possui barba). E claro, para melhorar completamente não podemos esquecer que o cabelo e a barba se formam como um todo 😉",
    duracao_minutos: 30,
    preco: 35,
  },
  {
    id: "4",
    nome: "Sobrancelhas",
    descricao: "Juntamente com o corte e a barba, é indispensável dar uma limpada na sobrancelha, pois muitas pessoas não sabem, porém quando estamos com as sobrancelhas muito grandes, passamos um \"ar\" de tristeza, pois com os cabelos bem aparentes no supercílios, destacam mais um semblante caído, trazendo uma tristeza no semblante, e claro ninguém quer parecer triste 😉",
    duracao_minutos: 10,
    preco: 20,
  },
  {
    id: "5",
    nome: "Pezinho",
    descricao: "Aparar o pezinho para manter o corte sempre alinhado",
    duracao_minutos: 10,
    preco: 12,
    observacoes: "Já incluso no corte de cabelo",
  },
];

export function Services() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleAgendar(service: Service) {
    setSelectedService(service);
    setIsModalOpen(true);
  }

  function formatDuration(minutes: number): string {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h e ${mins} min` : `${hours}h`;
    }
    return `${minutes} min`;
  }

  return (
    <>
      <section id="servicos" className="w-full py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-2">Barbering</h2>
          </div>
          
          <div className="space-y-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white border border-neutral-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-neutral-900 mb-2">
                      {service.nome}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 mb-2">
                      <Clock className="h-4 w-4" />
                      <span>{formatDuration(service.duracao_minutos)}</span>
                      {service.itensInclusos && (
                        <>
                          <span>•</span>
                          <span>{service.itensInclusos.length} serviços</span>
                        </>
                      )}
                    </div>
                    {service.descricao && (
                      <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                        {service.descricao}
                      </p>
                    )}
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-bold text-neutral-900">
                        R$ {service.preco.toFixed(2)}
                      </span>
                      {service.precoOriginal && (
                        <>
                          <span className="text-sm text-neutral-400 line-through">
                            R$ {service.precoOriginal.toFixed(2)}
                          </span>
                          {service.desconto && (
                            <span className="text-sm font-semibold text-green-600">
                              Economize {service.desconto}%
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleAgendar(service)}
                    className="px-6 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-medium rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    <Plus className="h-4 w-4" />
                    Agendar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedService && (
        <ServiceModal
          service={selectedService}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
