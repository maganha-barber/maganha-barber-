-- ============================================
-- MAGANHA BARBEARIA - SETUP COMPLETO DO BANCO DE DADOS (CORRIGIDO)
-- ============================================
-- Execute este script no SQL Editor do Supabase
-- Vá em: Supabase Dashboard → SQL Editor → New Query
-- Cole este código e execute (Run)

-- ============================================
-- 1. EXTENSÕES
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 2. TABELAS
-- ============================================

-- Tabela de Serviços (com todas as colunas necessárias)
CREATE TABLE IF NOT EXISTS servicos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  duracao_minutos INTEGER NOT NULL,
  preco DECIMAL(10, 2) NOT NULL,
  preco_original DECIMAL(10, 2), -- Para descontos
  desconto INTEGER, -- Percentual de desconto
  itens_inclusos TEXT[], -- Array de strings
  observacoes TEXT,
  ativo BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0, -- Para ordenar na exibição
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Se a tabela já existe, adicionar colunas que podem estar faltando
ALTER TABLE servicos 
  ADD COLUMN IF NOT EXISTS preco_original DECIMAL(10, 2),
  ADD COLUMN IF NOT EXISTS desconto INTEGER,
  ADD COLUMN IF NOT EXISTS itens_inclusos TEXT[],
  ADD COLUMN IF NOT EXISTS observacoes TEXT,
  ADD COLUMN IF NOT EXISTS ordem INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ativo BOOLEAN DEFAULT true;

-- Tabela de Barbeiros
CREATE TABLE IF NOT EXISTS barbeiros (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(100) NOT NULL,
  especialidade TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Horários de Funcionamento
CREATE TABLE IF NOT EXISTS horarios_funcionamento (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dia_semana INTEGER NOT NULL CHECK (dia_semana BETWEEN 0 AND 6), -- 0 = Domingo, 1 = Segunda, etc.
  aberto BOOLEAN DEFAULT false,
  horario_manha_inicio TIME,
  horario_manha_fim TIME,
  horario_tarde_inicio TIME,
  horario_tarde_fim TIME,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(dia_semana)
);

-- Tabela de Agendamentos
CREATE TABLE IF NOT EXISTS agendamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id TEXT NOT NULL, -- Email do Google OAuth
  usuario_email TEXT NOT NULL,
  usuario_nome TEXT,
  servico_id UUID NOT NULL REFERENCES servicos(id) ON DELETE RESTRICT,
  barbeiro_id UUID NOT NULL REFERENCES barbeiros(id) ON DELETE RESTRICT,
  data DATE NOT NULL,
  hora TIME NOT NULL,
  status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'cancelado', 'concluido')),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Evitar overbooking: constraint único por barbeiro, data e hora
  CONSTRAINT unique_barbeiro_data_hora UNIQUE (barbeiro_id, data, hora, status) 
    DEFERRABLE INITIALLY DEFERRED
);

-- ============================================
-- 3. ÍNDICES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_agendamentos_usuario_email ON agendamentos(usuario_email);
CREATE INDEX IF NOT EXISTS idx_agendamentos_data ON agendamentos(data);
CREATE INDEX IF NOT EXISTS idx_agendamentos_status ON agendamentos(status);
CREATE INDEX IF NOT EXISTS idx_agendamentos_barbeiro_data ON agendamentos(barbeiro_id, data);
CREATE INDEX IF NOT EXISTS idx_agendamentos_barbeiro_data_hora ON agendamentos(barbeiro_id, data, hora);

-- ============================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE barbeiros ENABLE ROW LEVEL SECURITY;
ALTER TABLE horarios_funcionamento ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para Serviços (todos podem ler, apenas admin pode editar)
DROP POLICY IF EXISTS "Serviços são públicos para leitura" ON servicos;
CREATE POLICY "Serviços são públicos para leitura"
  ON servicos FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admin pode gerenciar serviços" ON servicos;
CREATE POLICY "Admin pode gerenciar serviços"
  ON servicos FOR ALL
  USING (true) -- Validação será feita no código da aplicação
  WITH CHECK (true);

-- Políticas RLS para Barbeiros (todos podem ler, apenas admin pode editar)
DROP POLICY IF EXISTS "Barbeiros são públicos para leitura" ON barbeiros;
CREATE POLICY "Barbeiros são públicos para leitura"
  ON barbeiros FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admin pode gerenciar barbeiros" ON barbeiros;
CREATE POLICY "Admin pode gerenciar barbeiros"
  ON barbeiros FOR ALL
  USING (true)
  WITH CHECK (true);

-- Políticas RLS para Horários (todos podem ler, apenas admin pode editar)
DROP POLICY IF EXISTS "Horários são públicos para leitura" ON horarios_funcionamento;
CREATE POLICY "Horários são públicos para leitura"
  ON horarios_funcionamento FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admin pode gerenciar horários" ON horarios_funcionamento;
CREATE POLICY "Admin pode gerenciar horários"
  ON horarios_funcionamento FOR ALL
  USING (true)
  WITH CHECK (true);

-- Políticas RLS para Agendamentos
DROP POLICY IF EXISTS "Usuários podem criar agendamentos" ON agendamentos;
CREATE POLICY "Usuários podem criar agendamentos"
  ON agendamentos FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Usuários podem ver seus agendamentos" ON agendamentos;
CREATE POLICY "Usuários podem ver seus agendamentos"
  ON agendamentos FOR SELECT
  USING (true); -- Filtro será feito no código por usuario_email

DROP POLICY IF EXISTS "Usuários podem atualizar agendamentos" ON agendamentos;
CREATE POLICY "Usuários podem atualizar agendamentos"
  ON agendamentos FOR UPDATE
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Usuários podem cancelar agendamentos" ON agendamentos;
CREATE POLICY "Usuários podem cancelar agendamentos"
  ON agendamentos FOR DELETE
  USING (true);

-- ============================================
-- 5. FUNÇÃO PARA VALIDAR OVERBOOKING
-- ============================================
CREATE OR REPLACE FUNCTION verificar_overbooking(
  p_barbeiro_id UUID,
  p_data DATE,
  p_hora TIME,
  p_duracao_minutos INTEGER,
  p_agendamento_id UUID DEFAULT NULL -- Para atualizações
)
RETURNS BOOLEAN AS $$
DECLARE
  v_conflito BOOLEAN;
BEGIN
  -- Verificar se há conflito de horário
  SELECT EXISTS(
    SELECT 1
    FROM agendamentos
    WHERE barbeiro_id = p_barbeiro_id
      AND data = p_data
      AND status NOT IN ('cancelado', 'concluido')
      AND (
        -- Horário de início dentro de outro agendamento
        (hora <= p_hora AND hora + (duracao_minutos || ' minutes')::INTERVAL > p_hora)
        OR
        -- Horário de fim dentro de outro agendamento
        (p_hora + (p_duracao_minutos || ' minutes')::INTERVAL > hora 
         AND p_hora + (p_duracao_minutos || ' minutes')::INTERVAL <= hora + (duracao_minutos || ' minutes')::INTERVAL)
        OR
        -- Agendamento engloba outro completamente
        (hora >= p_hora AND hora + (duracao_minutos || ' minutes')::INTERVAL <= p_hora + (p_duracao_minutos || ' minutes')::INTERVAL)
      )
      AND (p_agendamento_id IS NULL OR id != p_agendamento_id)
  ) INTO v_conflito;
  
  RETURN NOT v_conflito; -- Retorna true se NÃO houver conflito
END;
$$ LANGUAGE plpgsql;

-- Trigger para validar overbooking antes de inserir/atualizar
CREATE OR REPLACE FUNCTION validar_agendamento()
RETURNS TRIGGER AS $$
DECLARE
  v_duracao INTEGER;
BEGIN
  -- Obter duração do serviço
  SELECT duracao_minutos INTO v_duracao
  FROM servicos
  WHERE id = NEW.servico_id;
  
  -- Validar overbooking
  IF NOT verificar_overbooking(
    NEW.barbeiro_id,
    NEW.data,
    NEW.hora,
    v_duracao,
    NEW.id
  ) THEN
    RAISE EXCEPTION 'Horário já está ocupado para este barbeiro';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_validar_agendamento ON agendamentos;
CREATE TRIGGER trigger_validar_agendamento
  BEFORE INSERT OR UPDATE ON agendamentos
  FOR EACH ROW
  WHEN (NEW.status NOT IN ('cancelado', 'concluido'))
  EXECUTE FUNCTION validar_agendamento();

-- ============================================
-- 6. DADOS INICIAIS
-- ============================================

-- Serviços
INSERT INTO servicos (id, nome, descricao, duracao_minutos, preco, preco_original, desconto, itens_inclusos, observacoes, ordem, ativo) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Completo (Corte, Barba, Sobrancelhas)', 'Destinado para quem quer fazer todos os serviços oferecidos aqui na Barbearia', 80, 78.00, 95.00, 18, ARRAY['Corte de cabelo (Somente adultos e crianças acima de 5 anos) - 40 min', 'Barba - 30 min', 'Sobrancelhas - 10 min'], NULL, 1, true),
  ('00000000-0000-0000-0000-000000000002', 'Corte de cabelo', 'Um dos requisitos mais importantes em uma imagem, com toda certeza é o cabelo, pois com o cabelo, você consegue "deixar" de ser uma pessoa e passa a "ser" outra pessoa, trazendo mais confiança para si mesmo e melhorando a forma como até mesmo as pessoas enxergam você 😉 E vai por mim, com certeza é para melhor!!!', 40, 40.00, NULL, NULL, NULL, 'Somente adultos e crianças acima de 5 anos', 2, true),
  ('00000000-0000-0000-0000-000000000003', 'Barba', 'Este tipo de serviço não se enquadra a todos, porém para que possamos passar uma autoridade maior e uma melhor imagem, este serviço é imprescindível (para quem possui barba). E claro, para melhorar completamente não podemos esquecer que o cabelo e a barba se formam como um todo 😉', 30, 35.00, NULL, NULL, NULL, NULL, 3, true),
  ('00000000-0000-0000-0000-000000000004', 'Sobrancelhas', 'Juntamente com o corte e a barba, é indispensável dar uma limpada na sobrancelha, pois muitas pessoas não sabem, porém quando estamos com as sobrancelhas muito grandes, passamos um "ar" de tristeza, pois com os cabelos bem aparentes no supercílios, destacam mais um semblante caído, trazendo uma tristeza no semblante, e claro ninguém quer parecer triste 😉', 10, 20.00, NULL, NULL, NULL, NULL, 4, true),
  ('00000000-0000-0000-0000-000000000005', 'Pezinho', 'Aparar o pezinho para manter o corte sempre alinhado', 10, 12.00, NULL, NULL, NULL, NULL, 5, true)
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  descricao = EXCLUDED.descricao,
  duracao_minutos = EXCLUDED.duracao_minutos,
  preco = EXCLUDED.preco,
  preco_original = EXCLUDED.preco_original,
  desconto = EXCLUDED.desconto,
  itens_inclusos = EXCLUDED.itens_inclusos,
  observacoes = EXCLUDED.observacoes,
  ordem = EXCLUDED.ordem,
  ativo = EXCLUDED.ativo,
  updated_at = NOW();

-- Barbeiros
INSERT INTO barbeiros (id, nome, especialidade, ativo) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Ronnie Maganha', 'Especialista em todos os serviços', true)
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  especialidade = EXCLUDED.especialidade,
  ativo = EXCLUDED.ativo,
  updated_at = NOW();

-- Horários de Funcionamento (0 = Domingo, 1 = Segunda, ..., 6 = Sábado)
INSERT INTO horarios_funcionamento (dia_semana, aberto, horario_manha_inicio, horario_manha_fim, horario_tarde_inicio, horario_tarde_fim) VALUES
  (0, false, NULL, NULL, NULL, NULL), -- Domingo: Fechado
  (1, true, '09:00', '12:00', '14:00', '19:00'), -- Segunda: 09:00-12:00, 14:00-19:00
  (2, true, '09:00', '12:00', '14:00', '19:00'), -- Terça: 09:00-12:00, 14:00-19:00
  (3, true, '09:00', '12:00', '14:00', '19:00'), -- Quarta: 09:00-12:00, 14:00-19:00
  (4, true, '09:00', '12:00', '14:00', '19:00'), -- Quinta: 09:00-12:00, 14:00-19:00
  (5, true, '09:00', '12:00', '14:00', '19:00'), -- Sexta: 09:00-12:00, 14:00-19:00
  (6, true, '09:00', '12:00', '13:00', '19:00')  -- Sábado: 09:00-12:00, 13:00-19:00
ON CONFLICT (dia_semana) DO UPDATE SET
  aberto = EXCLUDED.aberto,
  horario_manha_inicio = EXCLUDED.horario_manha_inicio,
  horario_manha_fim = EXCLUDED.horario_manha_fim,
  horario_tarde_inicio = EXCLUDED.horario_tarde_inicio,
  horario_tarde_fim = EXCLUDED.horario_tarde_fim,
  updated_at = NOW();

-- ============================================
-- 7. FUNÇÕES ÚTEIS
-- ============================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
DROP TRIGGER IF EXISTS update_servicos_updated_at ON servicos;
CREATE TRIGGER update_servicos_updated_at
  BEFORE UPDATE ON servicos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_barbeiros_updated_at ON barbeiros;
CREATE TRIGGER update_barbeiros_updated_at
  BEFORE UPDATE ON barbeiros
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_horarios_updated_at ON horarios_funcionamento;
CREATE TRIGGER update_horarios_updated_at
  BEFORE UPDATE ON horarios_funcionamento
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_agendamentos_updated_at ON agendamentos;
CREATE TRIGGER update_agendamentos_updated_at
  BEFORE UPDATE ON agendamentos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FIM DO SCRIPT
-- ============================================
-- Verifique se todas as tabelas foram criadas:
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name IN ('servicos', 'barbeiros', 'horarios_funcionamento', 'agendamentos');
