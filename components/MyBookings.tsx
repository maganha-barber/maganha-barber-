"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Calendar, Clock, Scissors, User, CheckCircle, X, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getAgendamentosUsuario, updateAgendamentoStatus, getServicos, getBarbeiros, type Booking, type Service, type Barber } from "@/lib/supabase/services";

function MyBookingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    
    if (status === "unauthenticated") {
      router.push("/auth?redirect=/meus-agendamentos");
      return;
    }

    if (session?.user?.email) {
      loadData();
    }

    if (searchParams.get("success") === "true") {
      setTimeout(() => {
        alert("Agendamento confirmado com sucesso! Aguarde a confirmação do administrador.");
      }, 100);
    }
  }, [status, session, router, searchParams]);

  async function loadData() {
    if (!session?.user?.email) return;

    try {
      const [bookingsData, servicesData, barbersData] = await Promise.all([
        getAgendamentosUsuario(session.user.email),
        getServicos(),
        getBarbeiros(),
      ]);

      setBookings(bookingsData);
      setServices(servicesData);
      setBarbers(barbersData);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setLoading(false);
    }
  }

  async function handleCancel(bookingId: string) {
    if (!confirm("Tem certeza que deseja cancelar este agendamento?")) {
      return;
    }

    setCancellingId(bookingId);

    try {
      const success = await updateAgendamentoStatus(bookingId, "cancelado");
      if (success) {
        await loadData();
      } else {
        alert("Erro ao cancelar agendamento. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao cancelar agendamento:", error);
      alert("Erro ao cancelar agendamento. Tente novamente.");
    } finally {
      setCancellingId(null);
    }
  }

  function getServiceName(serviceId: string): string {
    return services.find(s => s.id === serviceId)?.nome || "Serviço";
  }

  function getBarberName(barberId: string): string {
    return barbers.find(b => b.id === barberId)?.nome || "Barbeiro";
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "confirmado":
        return "text-green-600 bg-green-50 border-green-200";
      case "pendente":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "cancelado":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-neutral-600 bg-neutral-50 border-neutral-200";
    }
  }

  function getStatusLabel(status: string) {
    switch (status) {
      case "confirmado":
        return "Confirmado";
      case "pendente":
        return "Aguardando Confirmação";
      case "cancelado":
        return "Cancelado";
      default:
        return status;
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600">Carregando agendamentos...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 border border-neutral-200 bg-white rounded-lg p-8">
        <Calendar className="h-12 w-12 mx-auto mb-4 text-gold-500" />
        <p className="text-neutral-600 text-lg mb-6">
          Você não possui agendamentos futuros
        </p>
        <a
          href="/agendar"
          className="inline-block bg-gold-500 text-neutral-900 px-6 py-3 font-semibold hover:bg-gold-400 transition-all rounded-md shadow-md hover:shadow-lg"
        >
          Fazer um Agendamento
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const bookingDate = new Date(booking.data);
        const canCancel = booking.status !== "cancelado" && booking.status !== "concluido";
        
        return (
          <div
            key={booking.id}
            className="border border-neutral-200 bg-white p-6 hover:border-gold-500/50 hover:shadow-md transition-all rounded-lg"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gold-500" />
                  <span className="font-serif text-xl font-semibold text-neutral-900">
                    {format(bookingDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-neutral-700">
                  <Clock className="h-5 w-5 text-neutral-500" />
                  <span className="text-lg font-medium">{booking.hora}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-700">
                  <Scissors className="h-5 w-5 text-neutral-500" />
                    <span>{getServiceName(booking.servico_id)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-700">
                    <User className="h-5 w-5 text-neutral-500" />
                    <span>{getBarberName(booking.barbeiro_id)}</span>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-3">
                <div className={`px-3 py-1.5 rounded-md border text-sm font-semibold ${getStatusColor(booking.status)}`}>
                  {getStatusLabel(booking.status)}
                </div>
                
                {canCancel && (
                  <button
                    onClick={() => handleCancel(booking.id)}
                    disabled={cancellingId === booking.id}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                  >
                    {cancellingId === booking.id ? (
                      <>
                        <AlertCircle className="h-4 w-4 animate-spin" />
                        Cancelando...
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4" />
                        Cancelar
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function MyBookings() {
  return (
    <Suspense fallback={
      <div className="text-center py-12">
        <p className="text-neutral-600">Carregando agendamentos...</p>
      </div>
    }>
      <MyBookingsContent />
    </Suspense>
  );
}
