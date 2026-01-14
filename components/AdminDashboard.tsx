"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Calendar,
  Clock,
  Scissors,
  User,
  CheckCircle,
  X,
  Edit,
  TrendingUp,
  Users,
  AlertCircle,
  Shield,
  LogOut,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const ADMIN_EMAILS = ["lpmragi@gmail.com"];

interface Booking {
  id: string;
  data: string;
  hora: string;
  status: string;
  servico_id: string;
  barbeiro_id: string;
  usuario_id: string;
  usuario_email: string;
  usuario_nome: string;
  created_at: string;
}

const SERVICE_LABELS: Record<string, string> = {
  "1": "Corte Clássico",
  "2": "Barba Premium",
  "3": "Combo Completo",
};

const BARBER_LABELS: Record<string, string> = {
  "1": "João Silva",
  "2": "Carlos Santos",
  "3": "Pedro Oliveira",
};

export function AdminDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"todos" | "pendente" | "confirmado" | "cancelado">("todos");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState<string>("");
  const [editTime, setEditTime] = useState<string>("");

  useEffect(() => {
    if (status === "loading") return;
    
    // Se não estiver logado, redireciona para login
    if (status === "unauthenticated") {
      router.push("/auth?redirect=/admin");
      return;
    }
    
    if (session) {
      loadBookings();
    }
  }, [status, session, router]);

  function loadBookings() {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem("magbarber_bookings");
    const parsed: Booking[] = stored ? JSON.parse(stored) : [];

    // Ordenar por data e hora (mais recentes primeiro)
    parsed.sort((a, b) => {
      if (a.data === b.data) {
        return b.hora.localeCompare(a.hora);
      }
      return b.data.localeCompare(a.data);
    });

    setBookings(parsed);
    setLoading(false);
  }

  function handleStatusChange(bookingId: string, newStatus: string) {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem("magbarber_bookings");
    const parsed: Booking[] = stored ? JSON.parse(stored) : [];

    const updated = parsed.map((b) =>
      b.id === bookingId ? { ...b, status: newStatus } : b
    );

    window.localStorage.setItem("magbarber_bookings", JSON.stringify(updated));
    loadBookings();
  }

  function handleEdit(booking: Booking) {
    setEditingId(booking.id);
    setEditDate(booking.data);
    setEditTime(booking.hora);
  }

  function handleSaveEdit(bookingId: string) {
    if (!editDate || !editTime) return;

    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem("magbarber_bookings");
    const parsed: Booking[] = stored ? JSON.parse(stored) : [];

    const updated = parsed.map((b) =>
      b.id === bookingId ? { ...b, data: editDate, hora: editTime } : b
    );

    window.localStorage.setItem("magbarber_bookings", JSON.stringify(updated));
    setEditingId(null);
    loadBookings();
  }

  function getStats() {
    const today = new Date().toISOString().split("T")[0];
    const todayBookings = bookings.filter((b) => b.data === today && b.status !== "cancelado");
    const pending = bookings.filter((b) => b.status === "pendente").length;
    const confirmed = bookings.filter((b) => b.status === "confirmado").length;
    const total = bookings.filter((b) => b.status !== "cancelado").length;

    return { todayBookings: todayBookings.length, pending, confirmed, total };
  }

  const filteredBookings = bookings.filter((b) => {
    if (filter === "todos") return true;
    return b.status === filter;
  });

  const stats = getStats();
  
  // Verificar se é admin
  const userIsAdmin = session?.user?.email && ADMIN_EMAILS.includes(session.user.email);

  if (status === "loading" || loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-soft">
        <p className="text-neutral-600">Carregando...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="w-full min-h-screen bg-gradient-soft py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Aviso se não for admin */}
        {!userIsAdmin && session && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-amber-900 mb-1">Modo de Teste</p>
                <p className="text-sm text-amber-800">
                  Você está acessando como usuário comum. Para acesso completo como admin, 
                  faça login com: <strong>lpmragi@gmail.com</strong>
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-8 w-8 text-gold-500" />
              <h1 className="font-serif text-4xl font-bold text-neutral-900">
                Painel Administrativo
              </h1>
            </div>
            <p className="text-neutral-600">Gerencie agendamentos e clientes</p>
          </div>
          <button
            onClick={() => {
              signOut();
            }}
            className="flex items-center gap-2 px-4 py-2 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sair
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-neutral-600">Hoje</span>
              <Calendar className="h-5 w-5 text-gold-500" />
            </div>
            <p className="text-3xl font-bold text-neutral-900">{stats.todayBookings}</p>
            <p className="text-xs text-neutral-500 mt-1">Agendamentos hoje</p>
          </div>
          <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-neutral-600">Pendentes</span>
              <AlertCircle className="h-5 w-5 text-amber-500" />
            </div>
            <p className="text-3xl font-bold text-neutral-900">{stats.pending}</p>
            <p className="text-xs text-neutral-500 mt-1">Aguardando confirmação</p>
          </div>
          <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-neutral-600">Confirmados</span>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-neutral-900">{stats.confirmed}</p>
            <p className="text-xs text-neutral-500 mt-1">Agendamentos confirmados</p>
          </div>
          <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-neutral-600">Total</span>
              <TrendingUp className="h-5 w-5 text-gold-500" />
            </div>
            <p className="text-3xl font-bold text-neutral-900">{stats.total}</p>
            <p className="text-xs text-neutral-500 mt-1">Total de agendamentos</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-2">
          {(["todos", "pendente", "confirmado", "cancelado"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-gold-500 text-neutral-900"
                  : "bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200"
              }`}
            >
              {f === "todos"
                ? "Todos"
                : f === "pendente"
                ? "Pendentes"
                : f === "confirmado"
                ? "Confirmados"
                : "Cancelados"}
            </button>
          ))}
        </div>

        {/* Bookings Table */}
        <div className="bg-white border border-neutral-200 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Serviço
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Barbeiro
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Horário
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-neutral-500">
                      Nenhum agendamento encontrado
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => {
                    const bookingDate = new Date(booking.data);
                    const isEditing = editingId === booking.id;

                    return (
                      <tr key={booking.id} className="hover:bg-neutral-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-neutral-900">
                              {booking.usuario_nome || "Cliente"}
                            </p>
                            <p className="text-xs text-neutral-500">{booking.usuario_email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-neutral-700">
                            {SERVICE_LABELS[booking.servico_id] ?? "Serviço"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-neutral-700">
                            {BARBER_LABELS[booking.barbeiro_id] ?? "Barbeiro"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isEditing ? (
                            <input
                              type="date"
                              value={editDate}
                              onChange={(e) => setEditDate(e.target.value)}
                              className="px-2 py-1 border border-neutral-300 rounded text-sm"
                            />
                          ) : (
                            <span className="text-sm text-neutral-700">
                              {format(bookingDate, "dd/MM/yyyy", { locale: ptBR })}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isEditing ? (
                            <input
                              type="time"
                              value={editTime}
                              onChange={(e) => setEditTime(e.target.value)}
                              className="px-2 py-1 border border-neutral-300 rounded text-sm"
                            />
                          ) : (
                            <span className="text-sm text-neutral-700">{booking.hora}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={booking.status}
                            onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                            className={`px-3 py-1 rounded-md text-xs font-semibold border ${
                              booking.status === "confirmado"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : booking.status === "pendente"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-red-50 text-red-700 border-red-200"
                            }`}
                          >
                            <option value="pendente">Pendente</option>
                            <option value="confirmado">Confirmado</option>
                            <option value="cancelado">Cancelado</option>
                            <option value="concluido">Concluído</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => handleSaveEdit(booking.id)}
                                  className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                                  title="Salvar"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                  title="Cancelar"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleEdit(booking)}
                                className="p-1.5 text-gold-500 hover:bg-gold-50 rounded transition-colors"
                                title="Editar horário"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
