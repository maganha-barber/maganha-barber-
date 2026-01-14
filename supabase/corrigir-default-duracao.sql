-- ============================================
-- CORRIGIR DEFAULT DA COLUNA duracao_minutos
-- ============================================
-- Execute este script para definir um valor padrão e garantir que não seja NULL

-- Atualizar registros existentes que possam ter NULL
UPDATE servicos 
SET duracao_minutos = 30 
WHERE duracao_minutos IS NULL;

-- Alterar o default para 30
ALTER TABLE servicos 
ALTER COLUMN duracao_minutos SET DEFAULT 30;

-- Garantir que não aceite NULL
ALTER TABLE servicos 
ALTER COLUMN duracao_minutos SET NOT NULL;

-- Verificar se foi corrigido
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'servicos' 
AND column_name = 'duracao_minutos';
