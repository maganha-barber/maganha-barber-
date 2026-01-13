"use client";

import { useRouter } from "next/navigation";
import { Clock, Plus } from "lucide-react";

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
  const router = useRouter();

  function handleAgendar(serviceId: string) {
    router.push(`/agendar?servico=${serviceId}`);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">Nossos Serviços</h2>
            <div className="w-20 h-0.5 bg-gold-500 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white border border-neutral-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                {/* Imagem/Placeholder */}
                <div className="h-48 bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                  <Clock className="h-16 w-16 text-neutral-400" />
                </div>
                
                {/* Conteúdo */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">
                    {service.nome}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-sm text-neutral-600 mb-3">
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
                    <p className="text-sm text-neutral-600 mb-4 line-clamp-3 flex-1">
                      {service.descricao}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl font-bold text-neutral-900">
                      R$ {service.preco.toFixed(2)}
                    </span>
                    {service.precoOriginal && (
                      <>
                        <span className="text-sm text-neutral-400 line-through">
                          R$ {service.precoOriginal.toFixed(2)}
                        </span>
                        {service.desconto && (
                          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                            -{service.desconto}%
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleAgendar(service.id)}
                    className="w-full px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="h-5 w-5" />
                    Agendar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
