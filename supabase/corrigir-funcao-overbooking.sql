-- ============================================
-- CORRIGIR FUNÇÃO verificar_overbooking
-- ============================================
-- Esta função estava tentando acessar duracao_minutos diretamente de agendamentos
-- mas essa coluna só existe na tabela servicos. Vamos corrigir fazendo JOIN.

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
  -- Agora fazemos JOIN com servicos para buscar a duracao_minutos
  SELECT EXISTS(
    SELECT 1
    FROM agendamentos a
    INNER JOIN servicos s ON a.servico_id = s.id
    WHERE a.barbeiro_id = p_barbeiro_id
      AND a.data = p_data
      AND a.status NOT IN ('cancelado', 'concluido')
      AND (
        -- Horário de início dentro de outro agendamento
        (a.hora <= p_hora AND a.hora + (s.duracao_minutos || ' minutes')::INTERVAL > p_hora)
        OR
        -- Horário de fim dentro de outro agendamento
        (p_hora + (p_duracao_minutos || ' minutes')::INTERVAL > a.hora 
         AND p_hora + (p_duracao_minutos || ' minutes')::INTERVAL <= a.hora + (s.duracao_minutos || ' minutes')::INTERVAL)
        OR
        -- Agendamento engloba outro completamente
        (a.hora >= p_hora AND a.hora + (s.duracao_minutos || ' minutes')::INTERVAL <= p_hora + (p_duracao_minutos || ' minutes')::INTERVAL)
      )
      AND (p_agendamento_id IS NULL OR a.id != p_agendamento_id)
  ) INTO v_conflito;
  
  RETURN NOT v_conflito; -- Retorna true se NÃO houver conflito
END;
$$ LANGUAGE plpgsql;

-- Verificar se a função foi criada corretamente
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'verificar_overbooking';
