"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Calendar, Clock, Scissors, User, CheckCircle, X, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Booking {
  id: string;
  data: string;
  hora: string;
  status: string;
  servico_id: string;
  barbeiro_id: string;
  usuario_id?: string;
  usuario_email?: string;
  usuario_nome?: string;
}

const SERVICE_LABELS: Record<string, string> = {
  "1": "Completo (Corte, Barba, Sobrancelhas)",
  "2": "Corte de cabelo",
  "3": "Barba",
  "4": "Sobrancelhas",
  "5": "Pezinho",
};

const BARBER_LABELS: Record<string, string> = {
  "1": "Ronnie Maganha",
};

function MyBookingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    
    if (status === "unauthenticated") {
      router.push("/auth?redirect=/meus-agendamentos");
      return;
    }

    if (session) {
      loadBookings();
    }

    if (searchParams.get("success") === "true") {
      setTimeout(() => {
        alert("Agendamento confirmado com sucesso! Aguarde a confirmação do administrador.");
      }, 100);
    }
  }, [status, session, router, searchParams]);

  function loadBookings() {
    if (typeof window === "undefined" || !session?.user?.email) return;

    const stored = window.localStorage.getItem("magbarber_bookings");
    const parsed: Booking[] = stored ? JSON.parse(stored) : [];

    // Filtrar apenas agendamentos do usuário logado (por email ou ID)
    const userEmail = session.user.email;
    const userId = session.user.email || session.user.name || "";
    
    const userBookings = parsed.filter(
      (b) => b.usuario_email === userEmail || b.usuario_id === userId
    );

    // Manter apenas agendamentos futuros ou pendentes/confirmados
    const todayStr = new Date().toISOString().split("T")[0];
    const future = userBookings.filter(
      (b) => b.data >= todayStr || b.status === "pendente" || b.status === "confirmado"
    );

    // Ordenar por data e hora
    future.sort((a, b) => {
      if (a.data === b.data) {
        return a.hora.localeCompare(b.hora);
      }
      return a.data.localeCompare(b.data);
    });

    setBookings(future);
    setLoading(false);
  }

  function handleCancel(bookingId: string) {
    if (!confirm("Tem certeza que deseja cancelar este agendamento?")) {
      return;
    }

    setCancellingId(bookingId);

    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem("magbarber_bookings");
    const parsed: Booking[] = stored ? JSON.parse(stored) : [];

    const updated = parsed.map((b) =>
      b.id === bookingId ? { ...b, status: "cancelado" } : b
    );

    window.localStorage.setItem("magbarber_bookings", JSON.stringify(updated));
    
    setTimeout(() => {
      loadBookings();
      setCancellingId(null);
    }, 300);
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
                  <span>{SERVICE_LABELS[booking.servico_id] ?? "Serviço"}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-700">
                  <User className="h-5 w-5 text-neutral-500" />
                  <span>{BARBER_LABELS[booking.barbeiro_id] ?? "Barbeiro"}</span>
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
