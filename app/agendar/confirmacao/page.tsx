"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Calendar, Clock, User, Scissors, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";

interface Booking {
  id: string;
  usuario_id: string;
  usuario_email: string;
  usuario_nome: string;
  data: string;
  hora: string;
  status: string;
  servico_id: string;
  barbeiro_id: string;
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

function ConfirmacaoPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) {
      router.push("/agendar");
      return;
    }

    // Buscar agendamento do localStorage
    const stored = typeof window !== "undefined"
      ? window.localStorage.getItem("magbarber_bookings")
      : null;
    
    if (stored) {
      const bookings: Booking[] = JSON.parse(stored);
      const found = bookings.find(b => b.id === bookingId);
      if (found) {
        setBooking(found);
      }
    }
    setLoading(false);
  }, [bookingId, router]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-white">
        <p className="text-neutral-600">Carregando...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-neutral-600 mb-4">Agendamento não encontrado.</p>
          <Link href="/agendar" className="text-gold-500 hover:text-gold-600 font-semibold">
            Voltar para agendamento
          </Link>
        </div>
      </div>
    );
  }

  const bookingDate = new Date(booking.data + "T00:00:00");
  const serviceName = SERVICE_LABELS[booking.servico_id] || "Serviço";
  const barberName = BARBER_LABELS[booking.barbeiro_id] || "Barbeiro";

  return (
    <div className="w-full min-h-screen py-12 bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Ícone de Sucesso */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Agendamento Confirmado!
          </h1>
          <p className="text-neutral-600">
            Seu agendamento foi realizado com sucesso
          </p>
        </div>

        {/* Detalhes do Agendamento */}
        <div className="bg-white border border-neutral-200 rounded-lg p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-bold text-neutral-900 mb-6">Detalhes do Agendamento</h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <Scissors className="h-5 w-5 text-gold-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-neutral-600 mb-1">Serviço</p>
                <p className="font-semibold text-neutral-900">{serviceName}</p>
              </div>
            </div>

            <div className="h-px bg-neutral-200" />

            <div className="flex items-start gap-4">
              <User className="h-5 w-5 text-gold-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-neutral-600 mb-1">Barbeiro</p>
                <p className="font-semibold text-neutral-900">{barberName}</p>
              </div>
            </div>

            <div className="h-px bg-neutral-200" />

            <div className="flex items-start gap-4">
              <Calendar className="h-5 w-5 text-gold-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-neutral-600 mb-1">Data</p>
                <p className="font-semibold text-neutral-900">
                  {format(bookingDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
              </div>
            </div>

            <div className="h-px bg-neutral-200" />

            <div className="flex items-start gap-4">
              <Clock className="h-5 w-5 text-gold-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-neutral-600 mb-1">Horário</p>
                <p className="font-semibold text-neutral-900">{booking.hora}</p>
              </div>
            </div>

            <div className="h-px bg-neutral-200" />

            <div className="flex items-start gap-4">
              <div className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-neutral-600 mb-1">Status</p>
                <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-md text-sm font-semibold">
                  Aguardando Confirmação
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Aviso de Cancelamento */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-900 mb-2">Importante</h3>
              <p className="text-sm text-amber-800 mb-2">
                Para cancelar ou alterar seu agendamento, é necessário fazer isso com pelo menos <strong>2 horas de antecedência</strong>.
              </p>
              <p className="text-sm text-amber-800">
                Você pode gerenciar seus agendamentos na página "Meus Agendamentos".
              </p>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/meus-agendamentos"
            className="flex-1 px-6 py-3 bg-gold-500 text-neutral-900 font-semibold rounded-lg hover:bg-gold-400 transition-colors text-center"
          >
            Ver Meus Agendamentos
          </Link>
          <Link
            href="/"
            className="flex-1 px-6 py-3 border border-neutral-300 text-neutral-900 font-semibold rounded-lg hover:border-gold-500 transition-colors text-center"
          >
            Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmacaoPage() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen flex items-center justify-center bg-white">
        <p className="text-neutral-600">Carregando...</p>
      </div>
    }>
      <ConfirmacaoPageContent />
    </Suspense>
  );
}
