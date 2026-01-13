"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Scissors, User, Check, AlertCircle, Shield } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getUser, setUser } from "@/lib/auth";

interface Service {
  id: string;
  nome: string;
  duracao_minutos: number;
  preco: number;
}

interface Barber {
  id: string;
  nome: string;
}

interface TimeSlot {
  hora: string;
  disponivel: boolean;
}

// Dados mockados
const MOCK_SERVICES: Service[] = [
  { id: "1", nome: "Corte Clássico", duracao_minutos: 30, preco: 35 },
  { id: "2", nome: "Barba Premium", duracao_minutos: 20, preco: 25 },
  { id: "3", nome: "Combo Completo", duracao_minutos: 50, preco: 55 },
];

const MOCK_BARBERS: Barber[] = [
  { id: "1", nome: "João Silva" },
  { id: "2", nome: "Carlos Santos" },
  { id: "3", nome: "Pedro Oliveira" },
];

export function BookingForm() {
  const router = useRouter();
  const [user, setUserState] = useState(getUser());
  const [step, setStep] = useState(1);
  const [services] = useState<Service[]>(MOCK_SERVICES);
  const [barbers] = useState<Barber[]>(MOCK_BARBERS);
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedBarber, setSelectedBarber] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  useEffect(() => {
    setUserState(getUser());
  }, []);

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

    const slots: TimeSlot[] = [];
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
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
    if (step === 1 && selectedService) {
      setStep(2);
    } else if (step === 2 && selectedBarber) {
      setStep(3);
    } else if (step === 3 && selectedDate) {
      setStep(4);
    }
  }

  function handleBack() {
    if (step > 1) {
      setStep(step - 1);
    }
  }

  async function handleSubmit() {
    if (!selectedService || !selectedBarber || !selectedDate || !selectedTime) {
      return;
    }

    // Verificar se usuário está logado
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
      status: "pendente", // Pendente até admin confirmar
      servico_id: selectedService,
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
    router.push("/meus-agendamentos?success=true");
  }

  // Gerar próximos 30 dias disponíveis
  const availableDates: Date[] = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    if (date.getDay() !== 0) {
      availableDates.push(date);
    }
  }

  const selectedServiceData = services.find(s => s.id === selectedService);
  const selectedBarberData = barbers.find(b => b.id === selectedBarber);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Resumo lateral (desktop) */}
      {step > 1 && (
        <div className="hidden lg:block fixed right-8 top-32 w-80 bg-white border border-neutral-200 rounded-lg p-6 shadow-lg">
          <h3 className="font-serif text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-gold-500" />
            Resumo do Agendamento
          </h3>
          <div className="space-y-3 text-sm">
            {selectedServiceData && (
              <div className="flex justify-between">
                <span className="text-neutral-600">Serviço:</span>
                <span className="font-semibold text-neutral-900">{selectedServiceData.nome}</span>
              </div>
            )}
            {selectedBarberData && (
              <div className="flex justify-between">
                <span className="text-neutral-600">Barbeiro:</span>
                <span className="font-semibold text-neutral-900">{selectedBarberData.nome}</span>
              </div>
            )}
            {selectedDate && (
              <div className="flex justify-between">
                <span className="text-neutral-600">Data:</span>
                <span className="font-semibold text-neutral-900">
                  {format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}
                </span>
              </div>
            )}
            {selectedTime && (
              <div className="flex justify-between">
                <span className="text-neutral-600">Horário:</span>
                <span className="font-semibold text-neutral-900">{selectedTime}</span>
              </div>
            )}
            {selectedServiceData && (
              <div className="pt-3 border-t border-neutral-200 flex justify-between">
                <span className="text-neutral-600">Total:</span>
                <span className="font-bold text-gold-500 text-lg">R$ {selectedServiceData.preco.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Progress Steps - Melhorado */}
      <div className="mb-10">
        <div className="flex justify-between items-center">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex-1 flex items-center">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 font-bold transition-all ${
                    step >= s
                      ? "bg-gold-500 text-neutral-900 border-gold-500 shadow-md"
                      : "bg-white text-neutral-400 border-neutral-300"
                  }`}
                >
                  {step > s ? <Check className="h-6 w-6" /> : s}
                </div>
                <span className={`text-xs mt-2 font-medium ${step >= s ? 'text-neutral-900' : 'text-neutral-400'}`}>
                  {s === 1 ? 'Serviço' : s === 2 ? 'Barbeiro' : s === 3 ? 'Data' : 'Horário'}
                </span>
              </div>
              {s < 4 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded transition-all ${
                    step > s ? "bg-gold-500" : "bg-neutral-200"
                  }`}
                />
              )}
            </div>
          ))}
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

      {/* Step 1: Selecionar Serviço */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl font-bold text-neutral-900 mb-2 flex items-center justify-center gap-3">
              <Scissors className="h-8 w-8 text-gold-500" />
              Selecione o Serviço
            </h2>
            <p className="text-neutral-600">Escolha o serviço que deseja agendar</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={`p-6 border text-left transition-all rounded-lg group ${
                  selectedService === service.id
                    ? "border-gold-500 bg-gold-500 text-neutral-900 shadow-lg scale-105"
                    : "border-neutral-200 bg-white text-neutral-900 hover:border-gold-500/50 hover:shadow-md"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-serif text-xl font-bold">{service.nome}</h3>
                  <span className={`text-lg font-bold ${selectedService === service.id ? 'text-neutral-900' : 'text-gold-500'}`}>
                    R$ {service.preco.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-neutral-600 mb-3">{service.duracao_minutos} minutos</p>
                {selectedService === service.id && (
                  <div className="flex items-center gap-2 text-sm text-neutral-700">
                    <Check className="h-4 w-4" />
                    <span>Selecionado</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Selecionar Barbeiro */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl font-bold text-neutral-900 mb-2 flex items-center justify-center gap-3">
              <User className="h-8 w-8 text-gold-500" />
              Selecione o Barbeiro
            </h2>
            <p className="text-neutral-600">Escolha o profissional de sua preferência</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {barbers.map((barber) => (
              <button
                key={barber.id}
                onClick={() => setSelectedBarber(barber.id)}
                className={`p-6 border text-center transition-all rounded-lg ${
                  selectedBarber === barber.id
                    ? "border-gold-500 bg-gold-500 text-neutral-900 shadow-lg scale-105 font-semibold"
                    : "border-neutral-200 bg-white text-neutral-900 hover:border-gold-500/50 hover:shadow-md"
                }`}
              >
                <User className={`h-12 w-12 mx-auto mb-3 ${selectedBarber === barber.id ? 'text-neutral-900' : 'text-gold-500'}`} />
                <h3 className="font-serif text-xl font-bold">{barber.nome}</h3>
                {selectedBarber === barber.id && (
                  <div className="flex items-center justify-center gap-2 text-sm mt-2">
                    <Check className="h-4 w-4" />
                    <span>Selecionado</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Selecionar Data */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl font-bold text-neutral-900 mb-2 flex items-center justify-center gap-3">
              <Calendar className="h-8 w-8 text-gold-500" />
              Selecione a Data
            </h2>
            <p className="text-neutral-600">Escolha a data para seu agendamento</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {availableDates.map((date, index) => (
              <button
                key={index}
                onClick={() => setSelectedDate(date)}
                className={`p-4 border text-center transition-all rounded-lg ${
                  selectedDate?.toDateString() === date.toDateString()
                    ? "border-gold-500 bg-gold-500 text-neutral-900 shadow-md font-semibold"
                    : "border-neutral-200 bg-white text-neutral-900 hover:border-gold-500/50 hover:shadow-sm"
                }`}
              >
                <div className="text-xs font-medium mb-1">
                  {format(date, "EEE", { locale: ptBR })}
                </div>
                <div className="text-xl font-bold">
                  {format(date, "d")}
                </div>
                <div className="text-xs text-neutral-600">
                  {format(date, "MMM", { locale: ptBR })}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Selecionar Horário */}
      {step === 4 && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl font-bold text-neutral-900 mb-2 flex items-center justify-center gap-3">
              <Clock className="h-8 w-8 text-gold-500" />
              Selecione o Horário
            </h2>
            <p className="text-neutral-600">Escolha o melhor horário para você</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {timeSlots.map((slot, index) => (
              <button
                key={index}
                onClick={() => slot.disponivel && setSelectedTime(slot.hora)}
                disabled={!slot.disponivel}
                className={`p-3 border text-center transition-all rounded-md font-medium ${
                  !slot.disponivel
                    ? "border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed"
                    : selectedTime === slot.hora
                    ? "border-gold-500 bg-gold-500 text-neutral-900 shadow-md"
                    : "border-neutral-200 bg-white text-neutral-900 hover:border-gold-500/50 hover:shadow-sm"
                }`}
              >
                {slot.hora}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-10 pt-6 border-t border-neutral-200">
        <button
          onClick={handleBack}
          disabled={step === 1}
          className={`px-6 py-3 border border-neutral-300 font-semibold rounded-md transition-all ${
            step === 1
              ? "bg-neutral-100 text-neutral-400 cursor-not-allowed border-neutral-200"
              : "bg-white text-neutral-900 hover:border-gold-500 hover:text-gold-500"
          }`}
        >
          Voltar
        </button>
        {step < 4 ? (
          <button
            onClick={handleNext}
            disabled={
              (step === 1 && !selectedService) ||
              (step === 2 && !selectedBarber) ||
              (step === 3 && !selectedDate)
            }
            className={`px-8 py-3 bg-gold-500 text-neutral-900 font-semibold rounded-md transition-all shadow-md hover:shadow-lg ${
              (step === 1 && !selectedService) ||
              (step === 2 && !selectedBarber) ||
              (step === 3 && !selectedDate)
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gold-400"
            }`}
          >
            Próximo
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!selectedTime || loading}
            className={`px-8 py-3 bg-gold-500 text-neutral-900 font-semibold rounded-md transition-all shadow-lg hover:shadow-xl ${
              !selectedTime || loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gold-400"
            }`}
          >
            {loading ? "Confirmando..." : "Confirmar Agendamento"}
          </button>
        )}
      </div>
    </div>
  );
}
