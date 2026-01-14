-- ============================================
-- ADICIONAR COLUNA duracao_minutos NA TABELA servicos
-- ============================================
-- Execute este script no SQL Editor do Supabase se a coluna duracao_minutos não existir
-- Vá em: Supabase Dashboard → SQL Editor → New Query → Cole este código e execute (Run)

-- Adicionar coluna duracao_minutos se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'servicos' 
    AND column_name = 'duracao_minutos'
  ) THEN
    ALTER TABLE servicos 
    ADD COLUMN duracao_minutos INTEGER NOT NULL DEFAULT 30;
    
    -- Atualizar registros existentes com um valor padrão se necessário
    UPDATE servicos 
    SET duracao_minutos = 30 
    WHERE duracao_minutos IS NULL;
  END IF;
END $$;

-- Verificar se a coluna foi criada
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'servicos' 
AND column_name = 'duracao_minutos';
