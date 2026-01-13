-- ============================================
-- MAGBARBER - SETUP COMPLETO DO BANCO DE DADOS
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
-- NOTA: usuario_id pode ser UUID do Supabase Auth ou string do Google OAuth
CREATE TABLE IF NOT EXISTS agendamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id TEXT NOT NULL, -- Alterado para TEXT para suportar IDs do Google OAuth
  usuario_email TEXT, -- Email do usuário para facilitar consultas
  usuario_nome TEXT, -- Nome do usuário
  servico_id UUID NOT NULL REFERENCES servicos(id) ON DELETE RESTRICT,
  barbeiro_id UUID NOT NULL REFERENCES barbeiros(id) ON DELETE RESTRICT,
  data DATE NOT NULL,
  hora TIME NOT NULL,
  status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'cancelado', 'concluido')),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Evitar conflitos básicos de horário
  CONSTRAINT unique_barbeiro_data_hora UNIQUE (barbeiro_id, data, hora)
);

-- ============================================
-- 3. ÍNDICES (Para melhor performance)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_agendamentos_usuario_id ON agendamentos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_usuario_email ON agendamentos(usuario_email);
CREATE INDEX IF NOT EXISTS idx_agendamentos_data ON agendamentos(data);
CREATE INDEX IF NOT EXISTS idx_agendamentos_status ON agendamentos(status);
CREATE INDEX IF NOT EXISTS idx_agendamentos_barbeiro_data ON agendamentos(barbeiro_id, data);

-- ============================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE barbeiros ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 5. POLÍTICAS RLS
-- ============================================

-- Serviços: Todos podem ler (público)
DROP POLICY IF EXISTS "Serviços são públicos para leitura" ON servicos;
CREATE POLICY "Serviços são públicos para leitura"
  ON servicos FOR SELECT
  USING (true);

-- Barbeiros: Todos podem ler (público)
DROP POLICY IF EXISTS "Barbeiros são públicos para leitura" ON barbeiros;
CREATE POLICY "Barbeiros são públicos para leitura"
  ON barbeiros FOR SELECT
  USING (true);

-- Agendamentos: Políticas simplificadas (validação será feita no código da aplicação)
-- NOTA: Como estamos usando OAuth direto com Google, as políticas RLS serão mais permissivas
-- A segurança será garantida no código da aplicação que valida o usuario_id

-- Permitir criar agendamentos (validação no código)
DROP POLICY IF EXISTS "Usuários podem criar agendamentos" ON agendamentos;
CREATE POLICY "Usuários podem criar agendamentos"
  ON agendamentos FOR INSERT
  WITH CHECK (true);

-- Permitir ver agendamentos (filtro será feito no código por usuario_id)
DROP POLICY IF EXISTS "Usuários podem ver agendamentos" ON agendamentos;
CREATE POLICY "Usuários podem ver agendamentos"
  ON agendamentos FOR SELECT
  USING (true);

-- Permitir atualizar agendamentos (validação no código)
DROP POLICY IF EXISTS "Usuários podem atualizar agendamentos" ON agendamentos;
CREATE POLICY "Usuários podem atualizar agendamentos"
  ON agendamentos FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Permitir deletar agendamentos (validação no código)
DROP POLICY IF EXISTS "Usuários podem cancelar agendamentos" ON agendamentos;
CREATE POLICY "Usuários podem cancelar agendamentos"
  ON agendamentos FOR DELETE
  USING (true);

-- ============================================
-- 6. DADOS INICIAIS
-- ============================================

-- Serviços (Maganha Barbearia)
INSERT INTO servicos (id, nome, descricao, duracao_minutos, preco) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Completo (Corte, Barba, Sobrancelhas)', 'Destinado para quem quer fazer todos os serviços oferecidos aqui na Barbearia', 80, 78.00),
  ('00000000-0000-0000-0000-000000000002', 'Corte de cabelo', 'Um dos requisitos mais importantes em uma imagem, com toda certeza é o cabelo bem cortado e alinhado', 40, 40.00),
  ('00000000-0000-0000-0000-000000000003', 'Barba', 'Este tipo de serviço não se enquadra a todos, porém para que possamos passar uma boa imagem, é necessário manter a barba sempre bem aparada', 30, 35.00),
  ('00000000-0000-0000-0000-000000000004', 'Sobrancelhas', 'Juntamente com o corte e a barba, é indispensável dar uma limpada na sobrancelha para manter a harmonia do rosto', 10, 20.00),
  ('00000000-0000-0000-0000-000000000005', 'Pezinho', 'Aparar o pezinho para manter o corte sempre alinhado', 10, 12.00)
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  descricao = EXCLUDED.descricao,
  duracao_minutos = EXCLUDED.duracao_minutos,
  preco = EXCLUDED.preco;

-- Barbeiros (apenas Ronnie Maganha)
INSERT INTO barbeiros (id, nome, especialidade) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Ronnie Maganha', 'Especialista em todos os serviços')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  especialidade = EXCLUDED.especialidade;

-- Remover barbeiros antigos (opcional - comente se quiser manter)
-- DELETE FROM barbeiros WHERE id NOT IN ('00000000-0000-0000-0000-000000000001');

-- ============================================
-- 7. FUNÇÕES ÚTEIS (Opcional)
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
-- AND table_name IN ('servicos', 'barbeiros', 'agendamentos');
