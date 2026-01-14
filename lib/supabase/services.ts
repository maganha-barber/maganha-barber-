import { createClient } from "./client";

export interface Service {
  id: string;
  nome: string;
  descricao: string;
  duracao_minutos: number;
  preco: number;
  preco_original?: number;
  desconto?: number;
  itens_inclusos?: string[];
  observacoes?: string;
  ativo: boolean;
  ordem: number;
}

export interface Barber {
  id: string;
  nome: string;
  especialidade?: string;
  ativo: boolean;
}

export interface HorarioFuncionamento {
  id: string;
  dia_semana: number; // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  aberto: boolean;
  horario_manha_inicio?: string;
  horario_manha_fim?: string;
  horario_tarde_inicio?: string;
  horario_tarde_fim?: string;
}

export interface Booking {
  id: string;
  usuario_id: string;
  usuario_email: string;
  usuario_nome?: string;
  servico_id: string;
  barbeiro_id: string;
  data: string;
  hora: string;
  status: "pendente" | "confirmado" | "cancelado" | "concluido";
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

// Carregar serviços ativos
export async function getServicos(): Promise<Service[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("servicos")
    .select("*")
    .eq("ativo", true)
    .order("ordem", { ascending: true });

  if (error) {
    console.error("Erro ao carregar serviços:", error);
    return [];
  }

  return data || [];
}

// Carregar todos os serviços (para admin)
export async function getAllServicos(): Promise<Service[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("servicos")
    .select("*")
    .order("ordem", { ascending: true });

  if (error) {
    console.error("Erro ao carregar serviços:", error);
    return [];
  }

  return data || [];
}

// Criar novo serviço (admin)
export async function createServico(servico: Omit<Service, "id">): Promise<string | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("servicos")
    .insert({
      nome: servico.nome,
      descricao: servico.descricao,
      duracao_minutos: servico.duracao_minutos,
      preco: servico.preco,
      preco_original: servico.preco_original,
      desconto: servico.desconto,
      itens_inclusos: servico.itens_inclusos,
      observacoes: servico.observacoes,
      ativo: servico.ativo,
      ordem: servico.ordem,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Erro ao criar serviço:", error);
    return null;
  }

  return data?.id || null;
}

// Atualizar serviço (admin)
export async function updateServico(servico: Partial<Service> & { id: string }): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from("servicos")
    .update({
      nome: servico.nome,
      descricao: servico.descricao,
      duracao_minutos: servico.duracao_minutos,
      preco: servico.preco,
      preco_original: servico.preco_original,
      desconto: servico.desconto,
      itens_inclusos: servico.itens_inclusos,
      observacoes: servico.observacoes,
      ativo: servico.ativo,
      ordem: servico.ordem,
    })
    .eq("id", servico.id);

  if (error) {
    console.error("Erro ao atualizar serviço:", error);
    return false;
  }

  return true;
}

// Excluir serviço (admin)
export async function deleteServico(servicoId: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from("servicos")
    .delete()
    .eq("id", servicoId);

  if (error) {
    console.error("Erro ao excluir serviço:", error);
    return false;
  }

  return true;
}

// Carregar barbeiros ativos
export async function getBarbeiros(): Promise<Barber[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("barbeiros")
    .select("*")
    .eq("ativo", true);

  if (error) {
    console.error("Erro ao carregar barbeiros:", error);
    return [];
  }

  return data || [];
}

// Carregar horários de funcionamento
export async function getHorariosFuncionamento(): Promise<HorarioFuncionamento[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("horarios_funcionamento")
    .select("*")
    .order("dia_semana", { ascending: true });

  if (error) {
    console.error("Erro ao carregar horários:", error);
    return [];
  }

  return data || [];
}

// Atualizar horário de funcionamento (admin)
export async function updateHorarioFuncionamento(
  horario: Partial<HorarioFuncionamento> & { dia_semana: number }
): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from("horarios_funcionamento")
    .update({
      aberto: horario.aberto,
      horario_manha_inicio: horario.horario_manha_inicio,
      horario_manha_fim: horario.horario_manha_fim,
      horario_tarde_inicio: horario.horario_tarde_inicio,
      horario_tarde_fim: horario.horario_tarde_fim,
    })
    .eq("dia_semana", horario.dia_semana);

  if (error) {
    console.error("Erro ao atualizar horário:", error);
    return false;
  }

  return true;
}

// Criar agendamento
export async function createAgendamento(booking: Omit<Booking, "id" | "created_at" | "updated_at">): Promise<Booking | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("agendamentos")
    .insert({
      usuario_id: booking.usuario_id,
      usuario_email: booking.usuario_email,
      usuario_nome: booking.usuario_nome,
      servico_id: booking.servico_id,
      barbeiro_id: booking.barbeiro_id,
      data: booking.data,
      hora: booking.hora,
      status: booking.status,
      observacoes: booking.observacoes,
    })
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar agendamento:", error);
    throw error;
  }

  return data;
}

// Carregar agendamentos do usuário
export async function getAgendamentosUsuario(email: string): Promise<Booking[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("agendamentos")
    .select("*")
    .eq("usuario_email", email)
    .in("status", ["pendente", "confirmado"])
    .order("data", { ascending: true })
    .order("hora", { ascending: true });

  if (error) {
    console.error("Erro ao carregar agendamentos:", error);
    return [];
  }

  return data || [];
}

// Carregar todos os agendamentos (admin)
export async function getAllAgendamentos(): Promise<Booking[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("agendamentos")
    .select("*")
    .order("data", { ascending: false })
    .order("hora", { ascending: false });

  if (error) {
    console.error("Erro ao carregar agendamentos:", error);
    return [];
  }

  return data || [];
}

// Atualizar status do agendamento
export async function updateAgendamentoStatus(
  id: string,
  status: Booking["status"]
): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from("agendamentos")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("Erro ao atualizar agendamento:", error);
    return false;
  }

  return true;
}

// Atualizar agendamento (admin)
export async function updateAgendamento(
  id: string,
  updates: Partial<Booking>
): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from("agendamentos")
    .update(updates)
    .eq("id", id);

  if (error) {
    console.error("Erro ao atualizar agendamento:", error);
    return false;
  }

  return true;
}

// Verificar disponibilidade de horário
export async function verificarDisponibilidade(
  barbeiroId: string,
  data: string,
  hora: string,
  duracaoMinutos: number
): Promise<boolean> {
  const supabase = createClient();
  
  // Buscar agendamentos conflitantes
  const { data: conflitos, error } = await supabase
    .from("agendamentos")
    .select("hora, servico_id")
    .eq("barbeiro_id", barbeiroId)
    .eq("data", data)
    .in("status", ["pendente", "confirmado"]);

  if (error) {
    console.error("Erro ao verificar disponibilidade:", error);
    return false;
  }

  // Buscar duração dos serviços conflitantes
  if (conflitos && conflitos.length > 0) {
    const servicoIds = conflitos.map(c => c.servico_id);
    const { data: servicos } = await supabase
      .from("servicos")
      .select("id, duracao_minutos")
      .in("id", servicoIds);

    // Verificar sobreposição de horários
    const horaInicio = parseTime(hora);
    const horaFim = horaInicio + duracaoMinutos;

    for (const conflito of conflitos) {
      const servico = servicos?.find(s => s.id === conflito.servico_id);
      if (servico) {
        const conflitoInicio = parseTime(conflito.hora);
        const conflitoFim = conflitoInicio + servico.duracao_minutos;

        // Verificar sobreposição
        if (
          (horaInicio >= conflitoInicio && horaInicio < conflitoFim) ||
          (horaFim > conflitoInicio && horaFim <= conflitoFim) ||
          (horaInicio <= conflitoInicio && horaFim >= conflitoFim)
        ) {
          return false; // Conflito encontrado
        }
      }
    }
  }

  return true; // Sem conflitos
}

function parseTime(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}
