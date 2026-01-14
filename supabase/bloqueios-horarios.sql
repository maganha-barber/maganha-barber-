-- ============================================
-- TABELA DE BLOQUEIOS DE HORÁRIOS
-- ============================================
-- Permite ao admin bloquear horários específicos (ex: compromissos pessoais)

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

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_bloqueios_barbeiro_data ON bloqueios_horarios(barbeiro_id, data);
CREATE INDEX IF NOT EXISTS idx_bloqueios_data ON bloqueios_horarios(data);

-- RLS: Apenas admins podem gerenciar bloqueios
ALTER TABLE bloqueios_horarios ENABLE ROW LEVEL SECURITY;

-- Política: Todos podem ver bloqueios (para verificar disponibilidade)
DROP POLICY IF EXISTS "Todos podem ver bloqueios" ON bloqueios_horarios;
CREATE POLICY "Todos podem ver bloqueios"
  ON bloqueios_horarios FOR SELECT
  USING (true);

-- Política: Apenas admins podem criar/atualizar/deletar bloqueios
-- Nota: Isso será feito via código, verificando isAdmin no lado do servidor
DROP POLICY IF EXISTS "Admins podem gerenciar bloqueios" ON bloqueios_horarios;
CREATE POLICY "Admins podem gerenciar bloqueios"
  ON bloqueios_horarios FOR ALL
  USING (true)
  WITH CHECK (true);
