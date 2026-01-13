"use client";

import { useRouter } from "next/navigation";
import { Scissors, Sparkles, Clock } from "lucide-react";

interface Service {
  id: string;
  nome: string;
  descricao: string;
  duracao_minutos: number;
  preco: number;
  icon: React.ReactNode;
}

const services: Service[] = [
  {
    id: "1",
    nome: "Completo (Corte, Barba, Sobrancelhas)",
    descricao: "Destinado para quem quer fazer todos os serviços oferecidos aqui na Barbearia",
    duracao_minutos: 80,
    preco: 78,
    icon: <Sparkles className="h-12 w-12 text-gold-500" />,
  },
  {
    id: "2",
    nome: "Corte de cabelo",
    descricao: "Um dos requisitos mais importantes em uma imagem, com toda certeza é o cabelo, pois com o cabelo, você consegue \"deixar\" de ser uma pessoa e passa a \"ser\" outra pessoa, trazendo mais confiança para si mesmo e melhorando a forma como até mesmo as pessoas enxergam você 😉",
    duracao_minutos: 40,
    preco: 40,
    icon: <Scissors className="h-12 w-12 text-gold-500" />,
  },
  {
    id: "3",
    nome: "Barba",
    descricao: "Este tipo de serviço não se enquadra a todos, porém para que possamos passar uma autoridade maior e uma melhor imagem, este serviço é imprescindível (para quem possui barba). E claro, para melhorar completamente não podemos esquecer que o cabelo e a barba se formam como um todo 😉",
    duracao_minutos: 30,
    preco: 35,
    icon: <Clock className="h-12 w-12 text-gold-500" />,
  },
];

export function Services() {
  const router = useRouter();

  function handleAgendar() {
    router.push("/agendar");
  }

  return (
    <>
      <section id="servicos" className="w-full py-20 bg-gradient-to-b from-white to-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              Nossos Serviços
            </h2>
            <div className="w-20 h-0.5 bg-gold-500 mx-auto mb-6"></div>
            <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
              Oferecemos serviços premium de cuidados masculinos com atenção aos detalhes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="group bg-white rounded-lg p-8 border border-neutral-200 hover:border-gold-500/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-6 p-4 bg-gold-500/10 rounded-full group-hover:bg-gold-500/20 transition-colors duration-300 group-hover:scale-110 transform">
                    {service.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-gold-600 transition-colors">
                    {service.nome}
                  </h3>
                  
                  <p className="text-sm text-neutral-600 mb-6 line-clamp-3">
                    {service.descricao}
                  </p>
                  
                  <div className="w-full pt-6 border-t border-neutral-200">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-neutral-500">Duração</span>
                      <span className="text-sm font-semibold text-neutral-900">
                        {service.duracao_minutos} min
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-500">Preço</span>
                      <span className="text-2xl font-bold text-gold-600">
                        R$ {service.preco.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={handleAgendar}
              className="px-8 py-4 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center gap-2"
            >
              Agendar Agora
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
