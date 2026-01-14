-- Adicionar coluna telefone na tabela agendamentos
ALTER TABLE agendamentos 
ADD COLUMN IF NOT EXISTS telefone VARCHAR(20);

-- Comentário na coluna
COMMENT ON COLUMN agendamentos.telefone IS 'Telefone de contato do cliente';
