-- ============================================
-- MAGANHA BARBEARIA - ATUALIZAR DADOS
-- ============================================
-- Execute este script no SQL Editor do Supabase
-- Vá em: Supabase Dashboard → SQL Editor → New Query
-- Cole este código e execute (Run)
-- 
-- Este script atualiza os dados existentes sem recriar as tabelas

-- ============================================
-- 1. ATUALIZAR SERVIÇOS
-- ============================================

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

-- ============================================
-- 2. ATUALIZAR BARBEIROS
-- ============================================

INSERT INTO barbeiros (id, nome, especialidade, ativo) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Ronnie Maganha', 'Especialista em todos os serviços', true)
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  especialidade = EXCLUDED.especialidade,
  ativo = EXCLUDED.ativo,
  updated_at = NOW();

-- ============================================
-- 3. ATUALIZAR HORÁRIOS DE FUNCIONAMENTO
-- ============================================
-- 0 = Domingo, 1 = Segunda, 2 = Terça, 3 = Quarta, 4 = Quinta, 5 = Sexta, 6 = Sábado

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
-- VERIFICAÇÃO
-- ============================================
-- Execute estas queries para verificar se os dados foram inseridos corretamente:

-- SELECT * FROM servicos ORDER BY ordem;
-- SELECT * FROM barbeiros;
-- SELECT * FROM horarios_funcionamento ORDER BY dia_semana;
