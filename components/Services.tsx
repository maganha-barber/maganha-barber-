import { Scissors, Sparkles, Crown } from "lucide-react";

const services = [
  {
    icon: Scissors,
    title: "Corte Clássico",
    description: "Corte tradicional com acabamento impecável",
    price: "R$ 35",
    duration: "30 min",
  },
  {
    icon: Sparkles,
    title: "Barba Premium",
    description: "Aparar e modelar com técnicas profissionais",
    price: "R$ 25",
    duration: "20 min",
  },
  {
    icon: Crown,
    title: "Combo Completo",
    description: "Corte + barba + acabamentos especiais",
    price: "R$ 55",
    duration: "50 min",
  },
];

export function Services() {
  return (
    <section id="servicos" className="w-full py-20 bg-gradient-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Nossos Serviços
          </h2>
          <div className="w-20 h-0.5 bg-gold-500 mx-auto mb-4"></div>
          <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
            Oferecemos os melhores serviços de cuidados masculinos com qualidade premium
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white border border-neutral-200 p-8 text-center hover:border-gold-500/50 hover:shadow-lg transition-all rounded-lg group"
            >
              <div className="w-14 h-14 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-gold-500 transition-colors">
                <service.icon className="h-7 w-7 text-gold-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3 text-neutral-900">
                {service.title}
              </h3>
              <p className="text-neutral-600 mb-4 text-sm">{service.description}</p>
              <div className="flex items-center justify-center gap-3 text-sm">
                <span className="text-gold-500 font-semibold">{service.price}</span>
                <span className="text-neutral-300">•</span>
                <span className="text-neutral-500">{service.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
