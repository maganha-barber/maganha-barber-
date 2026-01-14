"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Scissors, Sparkles, Clock } from "lucide-react";
import { getServicos, type Service } from "@/lib/supabase/services";

const iconMap: Record<string, React.ReactNode> = {
  "1": <Sparkles className="h-12 w-12 text-gold-500" />,
  "2": <Scissors className="h-12 w-12 text-gold-500" />,
  "3": <Clock className="h-12 w-12 text-gold-500" />,
};

export function Services() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      const data = await getServicos();
      // Mostrar apenas os 3 primeiros serviços na homepage
      const homepageServices = data.slice(0, 3);
      setServices(homepageServices);
      setLoading(false);
    }
    loadServices();
  }, []);

  function handleAgendar() {
    router.push("/agendar");
  }

  if (loading) {
    return (
      <section id="servicos" className="w-full py-20 bg-gradient-to-b from-white to-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-neutral-600">Carregando serviços...</p>
          </div>
        </div>
      </section>
    );
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
                    {iconMap[service.id] || <Scissors className="h-12 w-12 text-gold-500" />}
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
                        R$ {Number(service.preco).toFixed(2)}
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
