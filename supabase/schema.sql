-- Criar extensão UUID se não existir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de Serviços
CREATE TABLE IF NOT EXISTS servicos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  duracao_minutos INTEGER NOT NULL,
  preco DECIMAL(10, 2) NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Barbeiros
CREATE TABLE IF NOT EXISTS barbeiros (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(100) NOT NULL,
  especialidade TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Agendamentos
CREATE TABLE IF NOT EXISTS agendamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  servico_id UUID NOT NULL REFERENCES servicos(id) ON DELETE RESTRICT,
  barbeiro_id UUID NOT NULL REFERENCES barbeiros(id) ON DELETE RESTRICT,
  data DATE NOT NULL,
  hora TIME NOT NULL,
  status VARCHAR(20) DEFAULT 'confirmado' CHECK (status IN ('confirmado', 'cancelado', 'concluido')),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Evitar conflitos básicos de horário (verificação adicional no código da aplicação)
  CONSTRAINT unique_barbeiro_data_hora UNIQUE (barbeiro_id, data, hora)
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_agendamentos_usuario_id ON agendamentos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_data ON agendamentos(data);
CREATE INDEX IF NOT EXISTS idx_agendamentos_barbeiro_data ON agendamentos(barbeiro_id, data);

-- Habilitar Row Level Security (RLS)
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE barbeiros ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para Serviços (todos podem ler)
CREATE POLICY "Serviços são públicos para leitura"
  ON servicos FOR SELECT
  USING (true);

-- Políticas RLS para Barbeiros (todos podem ler)
CREATE POLICY "Barbeiros são públicos para leitura"
  ON barbeiros FOR SELECT
  USING (true);

-- Políticas RLS para Agendamentos
-- Usuários autenticados podem criar seus próprios agendamentos
CREATE POLICY "Usuários podem criar seus próprios agendamentos"
  ON agendamentos FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

-- Usuários podem ver apenas seus próprios agendamentos
CREATE POLICY "Usuários podem ver seus próprios agendamentos"
  ON agendamentos FOR SELECT
  USING (auth.uid() = usuario_id);

-- Usuários podem atualizar apenas seus próprios agendamentos
CREATE POLICY "Usuários podem atualizar seus próprios agendamentos"
  ON agendamentos FOR UPDATE
  USING (auth.uid() = usuario_id)
  WITH CHECK (auth.uid() = usuario_id);

-- Usuários podem cancelar apenas seus próprios agendamentos
CREATE POLICY "Usuários podem cancelar seus próprios agendamentos"
  ON agendamentos FOR DELETE
  USING (auth.uid() = usuario_id);

-- Inserir dados iniciais de exemplo
INSERT INTO servicos (nome, descricao, duracao_minutos, preco) VALUES
  ('Corte Clássico', 'Corte tradicional com acabamento impecável', 30, 35.00),
  ('Barba Premium', 'Aparar e modelar com técnicas profissionais', 20, 25.00),
  ('Combo Completo', 'Corte + barba + acabamentos especiais', 50, 55.00)
ON CONFLICT DO NOTHING;

INSERT INTO barbeiros (nome, especialidade) VALUES
  ('João Silva', 'Cortes clássicos e modernos'),
  ('Carlos Santos', 'Barbas e acabamentos'),
  ('Pedro Oliveira', 'Estilos premium e personalizados')
ON CONFLICT DO NOTHING;
