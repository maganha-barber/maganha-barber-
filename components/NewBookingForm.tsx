"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Calendar, Clock, User, Check, AlertCircle, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { format, addDays, startOfWeek, addWeeks, isSameDay, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BookingCart } from "./BookingCart";
import { 
  getServicos, 
  getBarbeiros, 
  getHorariosFuncionamento,
  verificarDisponibilidade,
  createAgendamento,
  type Service as ServiceType,
  type Barber as BarberType,
  type HorarioFuncionamento
} from "@/lib/supabase/services";

interface Service extends ServiceType {
  precoOriginal?: number;
  desconto?: number;
  itensInclusos?: string[];
  observacoes?: string;
}

interface Barber extends BarberType {}

interface TimeSlot {
  hora: string;
  disponivel: boolean;
}

function NewBookingFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  
  // Estados para dados do Supabase
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [horarios, setHorarios] = useState<HorarioFuncionamento[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  
  // Pegar serviço da URL ou estado
  const serviceIdFromUrl = searchParams.get("servico");
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    serviceIdFromUrl || ""
  );
  
  // Step 0: Selecionar serviço, Step 1: Barbeiro, Step 2: Horário, Step 3: Confirmar
  const [step, setStep] = useState(serviceIdFromUrl ? 1 : 0);
  const [selectedBarber, setSelectedBarber] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  // Carregar dados do Supabase
  useEffect(() => {
    async function loadData() {
      try {
        const [servicosData, barbeirosData, horariosData] = await Promise.all([
          getServicos(),
          getBarbeiros(),
          getHorariosFuncionamento(),
        ]);

        // Converter serviços para o formato esperado
        const servicosFormatados: Service[] = servicosData.map(s => ({
          ...s,
          precoOriginal: s.preco_original ? Number(s.preco_original) : undefined,
          desconto: s.desconto || undefined,
          itensInclusos: s.itens_inclusos || undefined,
          observacoes: s.observacoes || undefined,
        }));

        setServices(servicosFormatados);
        setBarbers(barbeirosData);
        setHorarios(horariosData);
        
        // Selecionar primeiro barbeiro automaticamente
        if (barbeirosData.length > 0) {
          setSelectedBarber(barbeirosData[0].id);
        }
        
        setLoadingData(false);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setLoadingData(false);
      }
    }
    loadData();
  }, []);

  // Atualizar showAuthPrompt baseado no status da sessão
  useEffect(() => {
    if (status === "authenticated") {
      setShowAuthPrompt(false);
    } else if (status === "unauthenticated") {
      setShowAuthPrompt(true);
    }
  }, [status, session]);

  const selectedService = services.find(s => s.id === selectedServiceId);

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
    if (selectedDate && selectedBarber && selectedService && !loadingData) {
      loadTimeSlots();
    }
  }, [selectedDate, selectedBarber, selectedService, loadingData]);

  async function loadTimeSlots() {
    if (!selectedDate || !selectedBarber || !selectedService) return;

    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const dayOfWeek = getDay(selectedDate); // 0 = Domingo, 1 = Segunda, etc.
    
    // Verificar se o dia está aberto
    const horarioDia = horarios.find(h => h.dia_semana === dayOfWeek);
    if (!horarioDia || !horarioDia.aberto) {
      setTimeSlots([]);
      return;
    }

    // Buscar agendamentos existentes do Supabase
    const supabase = (await import("@/lib/supabase/client")).createClient();
    const { data: bookings } = await supabase
      .from("agendamentos")
      .select("hora, servico_id")
      .eq("barbeiro_id", selectedBarber)
      .eq("data", dateStr)
      .in("status", ["pendente", "confirmado"]);

    // Buscar bloqueios de horários
    const { data: bloqueios } = await supabase
      .from("bloqueios_horarios")
      .select("hora_inicio, hora_fim")
      .eq("barbeiro_id", selectedBarber)
      .eq("data", dateStr);

    // Buscar durações dos serviços agendados
    const servicoIds = bookings?.map(b => b.servico_id) || [];
    let servicosData: any[] = [];
    if (servicoIds.length > 0) {
      const { data } = await supabase
        .from("servicos")
        .select("id, duracao_minutos")
        .in("id", servicoIds);
      servicosData = data || [];
    }

    // Criar mapa de horários ocupados
    const horariosOcupados = new Set<string>();
    
    // Adicionar horários ocupados por agendamentos
    bookings?.forEach(booking => {
      const servico = servicosData.find(s => s.id === booking.servico_id);
      if (servico) {
        const [hora, minuto] = booking.hora.split(":").map(Number);
        const duracao = servico.duracao_minutos;
        const inicioMinutos = hora * 60 + minuto;
        const fimMinutos = inicioMinutos + duracao;
        
        // Marcar todos os slots de 10 em 10 minutos que estão ocupados
        for (let min = inicioMinutos; min < fimMinutos; min += 10) {
          const h = Math.floor(min / 60);
          const m = min % 60;
          horariosOcupados.add(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
        }
      }
    });

    // Adicionar horários bloqueados
    bloqueios?.forEach(bloqueio => {
      const [horaInicio, minutoInicio] = bloqueio.hora_inicio.split(":").map(Number);
      const [horaFim, minutoFim] = bloqueio.hora_fim.split(":").map(Number);
      const inicioMinutos = horaInicio * 60 + minutoInicio;
      const fimMinutos = horaFim * 60 + minutoFim;
      
      // Marcar todos os slots de 10 em 10 minutos que estão bloqueados
      for (let min = inicioMinutos; min < fimMinutos; min += 10) {
        const h = Math.floor(min / 60);
        const m = min % 60;
        horariosOcupados.add(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
      }
    });

    // Gerar slots baseados nos horários de funcionamento
    const slots: TimeSlot[] = [];
    const horariosManha = horarioDia.horario_manha_inicio && horarioDia.horario_manha_fim
      ? gerarSlotsEntreHorarios(horarioDia.horario_manha_inicio, horarioDia.horario_manha_fim)
      : [];
    const horariosTarde = horarioDia.horario_tarde_inicio && horarioDia.horario_tarde_fim
      ? gerarSlotsEntreHorarios(horarioDia.horario_tarde_inicio, horarioDia.horario_tarde_fim)
      : [];
    
    const todosHorarios = [...horariosManha, ...horariosTarde];
    
    todosHorarios.forEach(hora => {
      // Verificar se o horário não conflita com agendamentos existentes
      const conflito = Array.from(horariosOcupados).some(ocupado => {
        const [hOcupado, mOcupado] = ocupado.split(":").map(Number);
        const [hSlot, mSlot] = hora.split(":").map(Number);
        const ocupadoMinutos = hOcupado * 60 + mOcupado;
        const slotMinutos = hSlot * 60 + mSlot;
        const duracaoServico = selectedService.duracao_minutos;
        
        // Verificar sobreposição
        return (slotMinutos >= ocupadoMinutos && slotMinutos < ocupadoMinutos + 60) ||
               (slotMinutos + duracaoServico > ocupadoMinutos && slotMinutos + duracaoServico <= ocupadoMinutos + 60) ||
               (slotMinutos <= ocupadoMinutos && slotMinutos + duracaoServico >= ocupadoMinutos + 60);
      });
      
      slots.push({
        hora,
        disponivel: !conflito && !horariosOcupados.has(hora),
      });
    });
    
    setTimeSlots(slots);
  }

  function gerarSlotsEntreHorarios(inicio: string, fim: string): string[] {
    const slots: string[] = [];
    const [hInicio, mInicio] = inicio.split(":").map(Number);
    const [hFim, mFim] = fim.split(":").map(Number);
    
    let horaAtual = hInicio;
    let minutoAtual = mInicio;
    
    while (horaAtual < hFim || (horaAtual === hFim && minutoAtual < mFim)) {
      slots.push(`${horaAtual.toString().padStart(2, "0")}:${minutoAtual.toString().padStart(2, "0")}`);
      minutoAtual += 10;
      if (minutoAtual >= 60) {
        minutoAtual = 0;
        horaAtual++;
      }
    }
    
    return slots;
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
    if (!selectedServiceId || !selectedBarber || !selectedDate || !selectedTime || !selectedService) {
      return;
    }

    if (status === "loading") {
      return; // Aguardar carregamento da sessão
    }

    if (status === "unauthenticated" || !session?.user) {
      setShowAuthPrompt(true);
      router.push("/auth?redirect=/agendar");
      return;
    }

    setLoading(true);

    try {
      // Verificar disponibilidade antes de criar
      const disponivel = await verificarDisponibilidade(
        selectedBarber,
        format(selectedDate, "yyyy-MM-dd"),
        selectedTime,
        selectedService.duracao_minutos
      );

      if (!disponivel) {
        alert("Este horário não está mais disponível. Por favor, escolha outro horário.");
        setLoading(false);
        loadTimeSlots(); // Recarregar slots
        return;
      }

      // Criar agendamento no Supabase
      const booking = await createAgendamento({
        usuario_id: session.user.email || session.user.name || "",
        usuario_email: session.user.email || "",
        usuario_nome: session.user.name || session.user.email || "",
        data: format(selectedDate, "yyyy-MM-dd"),
        hora: selectedTime,
        status: "pendente",
        servico_id: selectedServiceId,
        barbeiro_id: selectedBarber,
      });

      if (booking) {
        router.push(`/agendar/confirmacao?id=${booking.id}`);
      } else {
        alert("Erro ao criar agendamento. Tente novamente.");
        setLoading(false);
      }
    } catch (error: any) {
      console.error("Erro ao criar agendamento:", error);
      alert(error.message || "Erro ao criar agendamento. Tente novamente.");
      setLoading(false);
    }
  }

  // Gerar dias da semana atual
  const weekDays: Date[] = [];
  for (let i = 0; i < 7; i++) {
    weekDays.push(addDays(currentWeekStart, i));
  }

  // Filtrar apenas dias que estão abertos conforme horários de funcionamento
  const availableDays = weekDays.filter(date => {
    const dayOfWeek = getDay(date); // 0 = Domingo, 1 = Segunda, etc.
    const horarioDia = horarios.find(h => h.dia_semana === dayOfWeek);
    return horarioDia?.aberto || false;
  });

  if (loadingData) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-neutral-600">Carregando...</p>
        </div>
      </div>
    );
  }

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

          {/* Alerta de autenticação - só mostra se realmente não estiver autenticado */}
          {status === "unauthenticated" && (
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
                {services.map((service) => {
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
                                R$ {Number(service.preco).toFixed(2)}
                              </span>
                              {service.precoOriginal && (
                                <>
                                  <span className="text-sm text-neutral-400 line-through">
                                    R$ {Number(service.precoOriginal).toFixed(2)}
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
                {barbers.map((barber) => (
                  <button
                    key={barber.id}
                    onClick={() => {
                      setSelectedBarber(barber.id);
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
              <button
                onClick={handleNext}
                disabled={!selectedBarber}
                className={`px-8 py-3 bg-neutral-900 text-white font-semibold rounded-lg transition-all ${
                  !selectedBarber
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-neutral-800"
                }`}
              >
                Próximo
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
              barberName={barbers.find(b => b.id === selectedBarber)?.nome || "Ronnie Maganha"}
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
