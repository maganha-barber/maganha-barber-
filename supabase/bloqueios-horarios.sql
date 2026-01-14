-- ============================================
-- TABELA DE BLOQUEIOS DE HORÁRIOS
-- ============================================
-- Permite ao admin bloquear horários específicos (ex: compromissos pessoais)
-- Execute este script no SQL Editor do Supabase
-- Vá em: Supabase Dashboard → SQL Editor → New Query → Cole este código e execute (Run)

-- Verificar se a extensão uuid-ossp existe
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar tabela de bloqueios de horários
CREATE TABLE IF NOT EXISTS bloqueios_horarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barbeiro_id UUID NOT NULL REFERENCES barbeiros(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  motivo TEXT, -- Opcional: motivo do bloqueio
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_time_range CHECK (hora_fim > hora_inicio)
);

-- Adicionar colunas caso a tabela já exista parcialmente
DO $$ 
BEGIN
  -- Adicionar colunas que podem estar faltando
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bloqueios_horarios' AND column_name = 'motivo') THEN
    ALTER TABLE bloqueios_horarios ADD COLUMN motivo TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bloqueios_horarios' AND column_name = 'created_at') THEN
    ALTER TABLE bloqueios_horarios ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bloqueios_horarios' AND column_name = 'updated_at') THEN
    ALTER TABLE bloqueios_horarios ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_bloqueios_barbeiro_data ON bloqueios_horarios(barbeiro_id, data);
CREATE INDEX IF NOT EXISTS idx_bloqueios_data ON bloqueios_horarios(data);

-- Habilitar RLS (Row Level Security)
ALTER TABLE bloqueios_horarios ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Todos podem ver bloqueios" ON bloqueios_horarios;
DROP POLICY IF EXISTS "Admins podem gerenciar bloqueios" ON bloqueios_horarios;
DROP POLICY IF EXISTS "Permitir inserção de bloqueios" ON bloqueios_horarios;
DROP POLICY IF EXISTS "Permitir atualização de bloqueios" ON bloqueios_horarios;
DROP POLICY IF EXISTS "Permitir exclusão de bloqueios" ON bloqueios_horarios;

-- Política: Todos podem ver bloqueios (para verificar disponibilidade)
CREATE POLICY "Todos podem ver bloqueios"
  ON bloqueios_horarios FOR SELECT
  USING (true);

-- Política: Permitir inserção (controle será feito no código)
CREATE POLICY "Permitir inserção de bloqueios"
  ON bloqueios_horarios FOR INSERT
  WITH CHECK (true);

-- Política: Permitir atualização (controle será feito no código)
CREATE POLICY "Permitir atualização de bloqueios"
  ON bloqueios_horarios FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Política: Permitir exclusão (controle será feito no código)
CREATE POLICY "Permitir exclusão de bloqueios"
  ON bloqueios_horarios FOR DELETE
  USING (true);

-- Comentário na tabela
COMMENT ON TABLE bloqueios_horarios IS 'Tabela para bloquear horários específicos (ex: compromissos pessoais do barbeiro)';
