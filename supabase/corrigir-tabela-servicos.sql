-- ============================================
-- CORRIGIR TABELA SERVIÇOS - Adicionar colunas faltantes
-- ============================================
-- Execute este script PRIMEIRO se a tabela já existe mas está faltando colunas

-- Adicionar colunas que podem estar faltando
ALTER TABLE servicos 
  ADD COLUMN IF NOT EXISTS duracao_minutos INTEGER DEFAULT 30,
  ADD COLUMN IF NOT EXISTS preco_original DECIMAL(10, 2),
  ADD COLUMN IF NOT EXISTS desconto INTEGER,
  ADD COLUMN IF NOT EXISTS itens_inclusos TEXT[],
  ADD COLUMN IF NOT EXISTS observacoes TEXT,
  ADD COLUMN IF NOT EXISTS ordem INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ativo BOOLEAN DEFAULT true;

-- Garantir que duracao_minutos não seja NULL se já existir
UPDATE servicos SET duracao_minutos = 30 WHERE duracao_minutos IS NULL;
ALTER TABLE servicos ALTER COLUMN duracao_minutos SET NOT NULL;

-- Agora você pode executar o script atualizar-dados.sql normalmente
