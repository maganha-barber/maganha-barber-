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
  Settings,
  Save,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  getAllAgendamentos,
  getAllServicos,
  getHorariosFuncionamento,
  updateServico,
  updateHorarioFuncionamento,
  updateAgendamento,
  updateAgendamentoStatus,
  type Booking,
  type Service,
  type HorarioFuncionamento,
} from "@/lib/supabase/services";

const ADMIN_EMAILS = ["lpmragi@gmail.com"];

type Tab = "agendamentos" | "servicos" | "horarios";

export function AdminDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<Tab>("agendamentos");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [horarios, setHorarios] = useState<HorarioFuncionamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"todos" | "pendente" | "confirmado" | "cancelado">("todos");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState<string>("");
  const [editTime, setEditTime] = useState<string>("");
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editingHorarioId, setEditingHorarioId] = useState<number | null>(null);
  const [editedServices, setEditedServices] = useState<Record<string, Service>>({});
  const [editedHorarios, setEditedHorarios] = useState<Record<number, HorarioFuncionamento>>({});

  useEffect(() => {
    if (status === "loading") return;
    
    if (status === "unauthenticated") {
      router.push("/auth?redirect=/admin");
      return;
    }
    
    if (session) {
      loadData();
    }
  }, [status, session, router]);

  async function loadData() {
    try {
      const [bookingsData, servicesData, horariosData] = await Promise.all([
        getAllAgendamentos(),
        getAllServicos(),
        getHorariosFuncionamento(),
      ]);

      setBookings(bookingsData);
      setServices(servicesData);
      setHorarios(horariosData);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setLoading(false);
    }
  }

  async function handleStatusChange(bookingId: string, newStatus: string) {
    try {
      const success = await updateAgendamentoStatus(bookingId, newStatus as Booking["status"]);
      if (success) {
        await loadData();
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Erro ao atualizar status do agendamento.");
    }
  }

  function handleEdit(booking: Booking) {
    setEditingId(booking.id);
    setEditDate(booking.data);
    setEditTime(booking.hora);
  }

  async function handleSaveEdit(bookingId: string) {
    if (!editDate || !editTime) return;

    try {
      const success = await updateAgendamento(bookingId, {
        data: editDate,
        hora: editTime,
      });
      if (success) {
        setEditingId(null);
        await loadData();
      }
    } catch (error) {
      console.error("Erro ao salvar edição:", error);
      alert("Erro ao salvar alterações.");
    }
  }

  async function handleSaveService(serviceId: string) {
    const service = editedServices[serviceId];
    if (!service) return;

    try {
      const success = await updateServico({
        id: service.id,
        nome: service.nome,
        descricao: service.descricao,
        duracao_minutos: service.duracao_minutos,
        preco: service.preco,
        preco_original: service.preco_original,
        desconto: service.desconto,
        itens_inclusos: service.itens_inclusos,
        observacoes: service.observacoes,
        ativo: service.ativo,
        ordem: service.ordem,
      });
      if (success) {
        setEditingServiceId(null);
        const newEditedServices = { ...editedServices };
        delete newEditedServices[serviceId];
        setEditedServices(newEditedServices);
        await loadData();
        alert("Serviço atualizado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao salvar serviço:", error);
      alert("Erro ao salvar serviço.");
    }
  }

  async function handleSaveHorario(diaSemana: number) {
    const horario = editedHorarios[diaSemana];
    if (!horario) return;

    try {
      const success = await updateHorarioFuncionamento({
        dia_semana: horario.dia_semana,
        aberto: horario.aberto,
        horario_manha_inicio: horario.horario_manha_inicio,
        horario_manha_fim: horario.horario_manha_fim,
        horario_tarde_inicio: horario.horario_tarde_inicio,
        horario_tarde_fim: horario.horario_tarde_fim,
      });
      if (success) {
        setEditingHorarioId(null);
        const newEditedHorarios = { ...editedHorarios };
        delete newEditedHorarios[diaSemana];
        setEditedHorarios(newEditedHorarios);
        await loadData();
        alert("Horário atualizado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao salvar horário:", error);
      alert("Erro ao salvar horário.");
    }
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
  
  // Verificar se é admin usando email
  const userIsAdmin = session?.user?.email && ADMIN_EMAILS.includes(session.user.email.toLowerCase());

  if (loading || status === "loading") {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-soft">
        <p className="text-neutral-600">Carregando...</p>
      </div>
    );
  }

  const diasSemana = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-soft py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-gold-500" />
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900">
                Painel Administrativo
              </h1>
            </div>
            <p className="text-sm sm:text-base text-neutral-600">Gerencie agendamentos, serviços e horários</p>
          </div>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 px-3 py-2 sm:px-4 text-sm sm:text-base text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors w-full sm:w-auto justify-center"
          >
            <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
            Sair
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-neutral-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab("agendamentos")}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === "agendamentos"
                ? "text-gold-500 border-b-2 border-gold-500"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Agendamentos
          </button>
          <button
            onClick={() => setActiveTab("servicos")}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === "servicos"
                ? "text-gold-500 border-b-2 border-gold-500"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Serviços
          </button>
          <button
            onClick={() => setActiveTab("horarios")}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === "horarios"
                ? "text-gold-500 border-b-2 border-gold-500"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Horários
          </button>
        </div>

        {/* Stats Cards */}
        {activeTab === "agendamentos" && (
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
        )}

        {/* Agendamentos Tab */}
        {activeTab === "agendamentos" && (
          <>
            {/* Filters */}
            <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
              {(["todos", "pendente", "confirmado", "cancelado"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
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

            {/* Bookings - Desktop Table / Mobile Cards */}
            <div className="bg-white border border-neutral-200 rounded-lg shadow-sm overflow-hidden">
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                        Serviço
                      </th>
                      <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                        Horário
                      </th>
                      <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                          Nenhum agendamento encontrado
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((booking) => {
                        const bookingDate = new Date(booking.data);
                        const isEditing = editingId === booking.id;
                        const servico = services.find(s => s.id === booking.servico_id);

                        return (
                          <tr key={booking.id} className="hover:bg-neutral-50">
                            <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                              <div>
                                <p className="text-sm font-medium text-neutral-900">
                                  {booking.usuario_nome || "Cliente"}
                                </p>
                                <p className="text-xs text-neutral-500">{booking.usuario_email}</p>
                              </div>
                            </td>
                            <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-neutral-700">
                                {servico?.nome || "Serviço"}
                              </span>
                            </td>
                            <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                              {isEditing ? (
                                <input
                                  type="date"
                                  value={editDate}
                                  onChange={(e) => setEditDate(e.target.value)}
                                  className="px-2 py-1 border border-neutral-300 rounded text-sm w-full"
                                />
                              ) : (
                                <span className="text-sm text-neutral-700">
                                  {format(bookingDate, "dd/MM/yyyy", { locale: ptBR })}
                                </span>
                              )}
                            </td>
                            <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                              {isEditing ? (
                                <input
                                  type="time"
                                  value={editTime}
                                  onChange={(e) => setEditTime(e.target.value)}
                                  className="px-2 py-1 border border-neutral-300 rounded text-sm w-full"
                                />
                              ) : (
                                <span className="text-sm text-neutral-700">{booking.hora}</span>
                              )}
                            </td>
                            <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                              <select
                                value={booking.status}
                                onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                                className={`px-2 lg:px-3 py-1 rounded-md text-xs font-semibold border w-full ${
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
                            <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
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

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-neutral-200">
                {filteredBookings.length === 0 ? (
                  <div className="px-6 py-12 text-center text-neutral-500">
                    Nenhum agendamento encontrado
                  </div>
                ) : (
                  filteredBookings.map((booking) => {
                    const bookingDate = new Date(booking.data);
                    const isEditing = editingId === booking.id;
                    const servico = services.find(s => s.id === booking.servico_id);

                    return (
                      <div key={booking.id} className="p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-neutral-900">
                              {booking.usuario_nome || "Cliente"}
                            </p>
                            <p className="text-xs text-neutral-500">{booking.usuario_email}</p>
                          </div>
                          {!isEditing && (
                            <button
                              onClick={() => handleEdit(booking)}
                              className="p-1.5 text-gold-500 hover:bg-gold-50 rounded transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <span className="text-xs text-neutral-500">Serviço:</span>
                            <p className="text-sm text-neutral-700">{servico?.nome || "Serviço"}</p>
                          </div>
                          
                          {isEditing ? (
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-xs text-neutral-500 block mb-1">Data</label>
                                <input
                                  type="date"
                                  value={editDate}
                                  onChange={(e) => setEditDate(e.target.value)}
                                  className="w-full px-2 py-1 border border-neutral-300 rounded text-sm"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-neutral-500 block mb-1">Horário</label>
                                <input
                                  type="time"
                                  value={editTime}
                                  onChange={(e) => setEditTime(e.target.value)}
                                  className="w-full px-2 py-1 border border-neutral-300 rounded text-sm"
                                />
                              </div>
                            </div>
                          ) : (
                            <>
                              <div>
                                <span className="text-xs text-neutral-500">Data:</span>
                                <p className="text-sm text-neutral-700">
                                  {format(bookingDate, "dd/MM/yyyy", { locale: ptBR })}
                                </p>
                              </div>
                              <div>
                                <span className="text-xs text-neutral-500">Horário:</span>
                                <p className="text-sm text-neutral-700">{booking.hora}</p>
                              </div>
                            </>
                          )}
                          
                          <div>
                            <span className="text-xs text-neutral-500">Status:</span>
                            <select
                              value={booking.status}
                              onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                              className={`mt-1 w-full px-3 py-1.5 rounded-md text-xs font-semibold border ${
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
                          </div>
                        </div>

                        {isEditing && (
                          <div className="flex gap-2 pt-2">
                            <button
                              onClick={() => handleSaveEdit(booking.id)}
                              className="flex-1 px-3 py-2 bg-green-500 text-white rounded-md text-sm font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Salvar
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="flex-1 px-3 py-2 bg-red-500 text-white rounded-md text-sm font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                            >
                              <X className="h-4 w-4" />
                              Cancelar
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </>
        )}

        {/* Serviços Tab */}
        {activeTab === "servicos" && (
          <div className="bg-white border border-neutral-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">Gerenciar Serviços</h2>
              <div className="space-y-4">
                {services.map((service) => {
                  const isEditing = editingServiceId === service.id;
                  const editedService = editedServices[service.id] || service;

                  return (
                    <div
                      key={service.id}
                      className="border border-neutral-200 rounded-lg p-4"
                    >
                      {isEditing ? (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                              Nome
                            </label>
                            <input
                              type="text"
                              value={editedService.nome}
                              onChange={(e) =>
                                setEditedServices({
                                  ...editedServices,
                                  [service.id]: { ...editedService, nome: e.target.value },
                                })
                              }
                              className="w-full px-3 py-2 border border-neutral-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                              Descrição
                            </label>
                            <textarea
                              value={editedService.descricao || ""}
                              onChange={(e) =>
                                setEditedServices({
                                  ...editedServices,
                                  [service.id]: { ...editedService, descricao: e.target.value },
                                })
                              }
                              className="w-full px-3 py-2 border border-neutral-300 rounded-md"
                              rows={3}
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-neutral-700 mb-1">
                                Duração (minutos)
                              </label>
                              <input
                                type="number"
                                value={editedService.duracao_minutos}
                                onChange={(e) =>
                                  setEditedServices({
                                    ...editedServices,
                                    [service.id]: {
                                      ...editedService,
                                      duracao_minutos: parseInt(e.target.value) || 0,
                                    },
                                  })
                                }
                                className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-neutral-700 mb-1">
                                Preço (R$)
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={Number(editedService.preco)}
                                onChange={(e) =>
                                  setEditedServices({
                                    ...editedServices,
                                    [service.id]: {
                                      ...editedService,
                                      preco: parseFloat(e.target.value) || 0,
                                    },
                                  })
                                }
                                className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm"
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={editedService.ativo}
                              onChange={(e) =>
                                setEditedServices({
                                  ...editedServices,
                                  [service.id]: { ...editedService, ativo: e.target.checked },
                                })
                              }
                              className="rounded"
                            />
                            <label className="text-sm text-neutral-700">Ativo</label>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveService(service.id)}
                              className="px-4 py-2 bg-gold-500 text-neutral-900 rounded-md font-semibold hover:bg-gold-400 transition-colors flex items-center gap-2"
                            >
                              <Save className="h-4 w-4" />
                              Salvar
                            </button>
                            <button
                              onClick={() => {
                                setEditingServiceId(null);
                                const newEditedServices = { ...editedServices };
                                delete newEditedServices[service.id];
                                setEditedServices(newEditedServices);
                              }}
                              className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded-md font-semibold hover:bg-neutral-300 transition-colors"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-lg text-neutral-900">{service.nome}</h3>
                            <p className="text-sm text-neutral-600">{service.descricao}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-sm text-neutral-600">
                                {service.duracao_minutos} min
                              </span>
                              <span className="text-lg font-bold text-gold-600">
                                R$ {Number(service.preco).toFixed(2)}
                              </span>
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  service.ativo
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {service.ativo ? "Ativo" : "Inativo"}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setEditingServiceId(service.id);
                              setEditedServices({
                                ...editedServices,
                                [service.id]: { ...service },
                              });
                            }}
                            className="p-2 text-gold-500 hover:bg-gold-50 rounded transition-colors"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Horários Tab */}
        {activeTab === "horarios" && (
          <div className="bg-white border border-neutral-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-4">Horários de Funcionamento</h2>
              <div className="space-y-4">
                {horarios.map((horario) => {
                  const isEditing = editingHorarioId === horario.dia_semana;
                  const editedHorario = editedHorarios[horario.dia_semana] || horario;

                  return (
                    <div
                      key={horario.id}
                      className="border border-neutral-200 rounded-lg p-4"
                    >
                      {isEditing ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={editedHorario.aberto}
                              onChange={(e) =>
                                setEditedHorarios({
                                  ...editedHorarios,
                                  [horario.dia_semana]: { ...editedHorario, aberto: e.target.checked },
                                })
                              }
                              className="rounded"
                            />
                            <label className="text-sm font-medium text-neutral-700">
                              {diasSemana[horario.dia_semana]} - Aberto
                            </label>
                          </div>
                          {editedHorario.aberto && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">
                                  Manhã - Início
                                </label>
                                <input
                                  type="time"
                                  value={editedHorario.horario_manha_inicio || ""}
                                  onChange={(e) =>
                                    setEditedHorarios({
                                      ...editedHorarios,
                                      [horario.dia_semana]: {
                                        ...editedHorario,
                                        horario_manha_inicio: e.target.value,
                                      },
                                    })
                                  }
                                  className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">
                                  Manhã - Fim
                                </label>
                                <input
                                  type="time"
                                  value={editedHorario.horario_manha_fim || ""}
                                  onChange={(e) =>
                                    setEditedHorarios({
                                      ...editedHorarios,
                                      [horario.dia_semana]: {
                                        ...editedHorario,
                                        horario_manha_fim: e.target.value,
                                      },
                                    })
                                  }
                                  className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">
                                  Tarde - Início
                                </label>
                                <input
                                  type="time"
                                  value={editedHorario.horario_tarde_inicio || ""}
                                  onChange={(e) =>
                                    setEditedHorarios({
                                      ...editedHorarios,
                                      [horario.dia_semana]: {
                                        ...editedHorario,
                                        horario_tarde_inicio: e.target.value,
                                      },
                                    })
                                  }
                                  className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">
                                  Tarde - Fim
                                </label>
                                <input
                                  type="time"
                                  value={editedHorario.horario_tarde_fim || ""}
                                  onChange={(e) =>
                                    setEditedHorarios({
                                      ...editedHorarios,
                                      [horario.dia_semana]: {
                                        ...editedHorario,
                                        horario_tarde_fim: e.target.value,
                                      },
                                    })
                                  }
                                  className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm"
                                />
                              </div>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveHorario(horario.dia_semana)}
                              className="px-4 py-2 bg-gold-500 text-neutral-900 rounded-md font-semibold hover:bg-gold-400 transition-colors flex items-center gap-2"
                            >
                              <Save className="h-4 w-4" />
                              Salvar
                            </button>
                            <button
                              onClick={() => {
                                setEditingHorarioId(null);
                                const newEditedHorarios = { ...editedHorarios };
                                delete newEditedHorarios[horario.dia_semana];
                                setEditedHorarios(newEditedHorarios);
                              }}
                              className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded-md font-semibold hover:bg-neutral-300 transition-colors"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-lg text-neutral-900">
                              {diasSemana[horario.dia_semana]}
                            </h3>
                            {horario.aberto ? (
                              <div className="mt-2 text-sm text-neutral-600">
                                {horario.horario_manha_inicio && horario.horario_manha_fim && (
                                  <span>
                                    Manhã: {horario.horario_manha_inicio} - {horario.horario_manha_fim}
                                  </span>
                                )}
                                {horario.horario_manha_inicio &&
                                  horario.horario_tarde_inicio &&
                                  " | "}
                                {horario.horario_tarde_inicio && horario.horario_tarde_fim && (
                                  <span>
                                    Tarde: {horario.horario_tarde_inicio} - {horario.horario_tarde_fim}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-sm text-red-600 font-semibold">Fechado</span>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              setEditingHorarioId(horario.dia_semana);
                              setEditedHorarios({
                                ...editedHorarios,
                                [horario.dia_semana]: { ...horario },
                              });
                            }}
                            className="p-2 text-gold-500 hover:bg-gold-50 rounded transition-colors"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
