"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, Clock, User, Check, AlertCircle, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { format, addDays, startOfWeek, addWeeks, isSameDay, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getUser } from "@/lib/auth";
import { BookingCart } from "./BookingCart";

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

interface Barber {
  id: string;
  nome: string;
}

interface TimeSlot {
  hora: string;
  disponivel: boolean;
}

// Serviços atualizados
const SERVICES: Service[] = [
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
  },
];

// Apenas Ronnie Maganha
const BARBERS: Barber[] = [
  { id: "1", nome: "Ronnie Maganha" },
];

function NewBookingFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user] = useState(getUser());
  
  // Pegar serviço da URL ou estado
  const serviceIdFromUrl = searchParams.get("servico");
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    serviceIdFromUrl || ""
  );
  
  // Step 0: Selecionar serviço, Step 1: Barbeiro, Step 2: Horário, Step 3: Confirmar
  const [step, setStep] = useState(serviceIdFromUrl ? 1 : 0);
  const [selectedBarber, setSelectedBarber] = useState<string>("1"); // Sempre Ronnie
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const selectedService = SERVICES.find(s => s.id === selectedServiceId);

  useEffect(() => {
    if (serviceIdFromUrl) {
      setSelectedServiceId(serviceIdFromUrl);
      setStep(1); // Se veio da URL, vai direto para seleção de barbeiro
    } else {
      // Se não veio da URL, começa no step 0 (seleção de serviço)
      setStep(0);
    }
  }, [serviceIdFromUrl]);

  useEffect(() => {
    if (selectedDate && selectedBarber) {
      loadTimeSlots();
    }
  }, [selectedDate, selectedBarber]);

  function loadTimeSlots() {
    if (!selectedDate || !selectedBarber) return;

    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const existing = typeof window !== "undefined" 
      ? window.localStorage.getItem("magbarber_bookings")
      : null;
    const bookings = existing ? JSON.parse(existing) : [];
    
    const bookedTimes = bookings
      .filter((b: any) => b.data === dateStr && b.barbeiro_id === selectedBarber && b.status !== 'cancelado')
      .map((b: any) => b.hora);

    // Horários de 9:00 às 18:00, de 10 em 10 minutos
    const slots: TimeSlot[] = [];
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 10) {
        const timeStr = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        slots.push({
          hora: timeStr,
          disponivel: !bookedTimes.includes(timeStr),
        });
      }
    }
    setTimeSlots(slots);
  }

  function handleNext() {
    if (step === 0 && selectedServiceId) {
      setStep(1); // Ir para seleção de barbeiro
    } else if (step === 1 && selectedBarber) {
      setStep(2); // Ir para horários
    }
  }

  function handleBack() {
    if (step > 0) {
      setStep(step - 1);
    } else {
      router.push("/");
    }
  }

  async function handleSubmit() {
    if (!selectedServiceId || !selectedBarber || !selectedDate || !selectedTime) {
      return;
    }

    const currentUser = getUser();
    if (!currentUser) {
      setShowAuthPrompt(true);
      return;
    }

    setLoading(true);

    const booking = {
      id: crypto.randomUUID(),
      usuario_id: currentUser.id,
      usuario_email: currentUser.email,
      usuario_nome: currentUser.name,
      data: format(selectedDate, "yyyy-MM-dd"),
      hora: selectedTime,
      status: "pendente",
      servico_id: selectedServiceId,
      barbeiro_id: selectedBarber,
      created_at: new Date().toISOString(),
    };

    const existing = typeof window !== "undefined"
      ? window.localStorage.getItem("magbarber_bookings")
      : null;
    const parsed = existing ? JSON.parse(existing) : [];
    const updated = [...parsed, booking];

    if (typeof window !== "undefined") {
      window.localStorage.setItem("magbarber_bookings", JSON.stringify(updated));
    }

    setLoading(false);
    router.push(`/agendar/confirmacao?id=${booking.id}`);
  }

  // Gerar dias da semana atual
  const weekDays: Date[] = [];
  for (let i = 0; i < 7; i++) {
    weekDays.push(addDays(currentWeekStart, i));
  }

  // Filtrar apenas dias úteis (segunda a sábado)
  const availableDays = weekDays.filter(date => getDay(date) !== 0);

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Conteúdo Principal */}
        <div className="flex-1">
          {/* Breadcrumb */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <span className={step >= 0 ? "font-semibold text-neutral-900" : ""}>Serviços</span>
              <span>›</span>
              <span className={step >= 2 ? "font-semibold text-neutral-900" : ""}>Horário</span>
              <span>›</span>
              <span>Confirmar</span>
            </div>
          </div>

          {/* Alerta de autenticação */}
          {showAuthPrompt && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-amber-900 mb-1">Login necessário</p>
                <p className="text-sm text-amber-800 mb-3">
                  Você precisa fazer login com Google para confirmar o agendamento.
                </p>
                <button
                  onClick={() => router.push("/auth?redirect=/agendar")}
                  className="bg-gold-500 text-neutral-900 px-4 py-2 rounded-md text-sm font-semibold hover:bg-gold-400 transition-colors"
                >
                  Fazer Login
                </button>
              </div>
            </div>
          )}

          {/* Step 0: Selecionar Serviço */}
          {step === 0 && (
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Serviços</h2>
              <p className="text-neutral-600 mb-6">Barbering</p>
              <div className="space-y-4">
                {SERVICES.map((service) => {
                  const isSelected = selectedServiceId === service.id;
                  const formatDuration = (minutes: number): string => {
                    if (minutes >= 60) {
                      const hours = Math.floor(minutes / 60);
                      const mins = minutes % 60;
                      return mins > 0 ? `${hours}h e ${mins} min` : `${hours}h`;
                    }
                    return `${minutes} min`;
                  };
                  
                  return (
                    <button
                      key={service.id}
                      onClick={() => {
                        setSelectedServiceId(service.id);
                      }}
                      className={`w-full p-6 border-2 rounded-lg text-left transition-all ${
                        isSelected
                          ? "border-purple-500 bg-purple-50"
                          : "border-neutral-200 hover:border-purple-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg text-neutral-900">
                              {service.nome}
                              {service.observacoes && (
                                <span className="text-sm font-normal text-neutral-600 ml-2">
                                  ({service.observacoes})
                                </span>
                              )}
                            </h3>
                          </div>
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
                          <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                            {service.descricao}
                          </p>
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
                        <div className="ml-4">
                          {isSelected ? (
                            <Check className="h-6 w-6 text-purple-500" />
                          ) : (
                            <Plus className="h-6 w-6 text-neutral-400" />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 1: Selecionar Barbeiro */}
          {step === 1 && selectedService && (
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Selecionar profissional</h2>
              <div className="space-y-4">
                {BARBERS.map((barber) => (
                  <button
                    key={barber.id}
                    onClick={() => {
                      setSelectedBarber(barber.id);
                      setTimeout(() => setStep(2), 300);
                    }}
                    className={`w-full p-6 border-2 rounded-lg text-left transition-all ${
                      selectedBarber === barber.id
                        ? "border-purple-500 bg-purple-50"
                        : "border-neutral-200 hover:border-purple-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          selectedBarber === barber.id ? "bg-purple-500" : "bg-neutral-100"
                        }`}>
                          <User className={`h-6 w-6 ${selectedBarber === barber.id ? "text-white" : "text-neutral-600"}`} />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-neutral-900">{barber.nome}</h3>
                          <p className="text-sm text-neutral-600">Com qualquer profissional</p>
                        </div>
                      </div>
                      {selectedBarber === barber.id && (
                        <Check className="h-6 w-6 text-purple-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Selecionar Data e Horário */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
                <Calendar className="h-6 w-6" />
                Selecionar horário
              </h2>

              {/* Navegação de Semana */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setCurrentWeekStart(addWeeks(currentWeekStart, -1))}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 text-neutral-600" />
                </button>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-neutral-600" />
                  <span className="font-semibold text-neutral-900">
                    {format(currentWeekStart, "MMMM 'de' yyyy", { locale: ptBR })}
                  </span>
                </div>
                <button
                  onClick={() => setCurrentWeekStart(addWeeks(currentWeekStart, 1))}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-neutral-600" />
                </button>
              </div>

              {/* Dias da Semana */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {availableDays.map((date, index) => {
                  const isSelected = selectedDate && isSameDay(date, selectedDate);
                  const isToday = isSameDay(date, new Date());
                  const dayOfWeek = format(date, "EEE", { locale: ptBR }).toLowerCase();
                  const dayNumber = format(date, "d");
                  
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(date)}
                      className={`flex flex-col items-center justify-center min-w-[60px] p-3 rounded-lg transition-all ${
                        isSelected
                          ? "bg-purple-500 text-white shadow-md"
                          : isToday
                          ? "bg-neutral-100 text-neutral-900"
                          : "bg-white border border-neutral-200 text-neutral-900 hover:border-purple-300"
                      }`}
                    >
                      <span className="text-xs font-medium mb-1">{dayOfWeek}</span>
                      <span className={`text-xl font-bold ${isSelected ? "text-white" : ""}`}>
                        {dayNumber}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Horários */}
              {selectedDate && (
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Horários disponíveis</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {timeSlots.map((slot, index) => (
                      <button
                        key={index}
                        onClick={() => slot.disponivel && setSelectedTime(slot.hora)}
                        disabled={!slot.disponivel}
                        className={`p-3 border rounded-lg text-center font-medium transition-all ${
                          !slot.disponivel
                            ? "border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed"
                            : selectedTime === slot.hora
                            ? "border-purple-500 bg-purple-500 text-white shadow-md"
                            : "border-neutral-200 bg-white text-neutral-900 hover:border-purple-300"
                        }`}
                      >
                        {slot.hora}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Botões de Navegação */}
          {step === 0 && (
            <div className="flex justify-between mt-8 pt-6 border-t border-neutral-200">
              <button
                onClick={handleBack}
                className="px-6 py-3 border border-neutral-300 font-semibold rounded-lg bg-white text-neutral-900 hover:border-purple-500 transition-all"
              >
                Voltar
              </button>
              <button
                onClick={handleNext}
                disabled={!selectedServiceId}
                className={`px-8 py-3 bg-neutral-900 text-white font-semibold rounded-lg transition-all ${
                  !selectedServiceId
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-neutral-800"
                }`}
              >
                Próximo
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="flex justify-between mt-8 pt-6 border-t border-neutral-200">
              <button
                onClick={handleBack}
                className="px-6 py-3 border border-neutral-300 font-semibold rounded-lg bg-white text-neutral-900 hover:border-purple-500 transition-all"
              >
                Voltar
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="flex justify-between mt-8 pt-6 border-t border-neutral-200">
              <button
                onClick={handleBack}
                className="px-6 py-3 border border-neutral-300 font-semibold rounded-lg bg-white text-neutral-900 hover:border-purple-500 transition-all"
              >
                Voltar
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedTime || loading}
                className={`px-8 py-3 bg-neutral-900 text-white font-semibold rounded-lg transition-all ${
                  !selectedTime || loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-neutral-800"
                }`}
              >
                {loading ? "Confirmando..." : "Continuar"}
              </button>
            </div>
          )}
        </div>

        {/* Sidebar - Carrinho */}
        {step >= 0 && selectedService && (
          <div className="lg:w-96">
            <BookingCart
              service={selectedService}
              barberName={BARBERS.find(b => b.id === selectedBarber)?.nome || "Ronnie Maganha"}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function NewBookingForm() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-neutral-600">Carregando...</p>
        </div>
      </div>
    }>
      <NewBookingFormContent />
    </Suspense>
  );
}
