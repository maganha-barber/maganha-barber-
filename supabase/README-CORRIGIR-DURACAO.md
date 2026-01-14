# Como Corrigir o Erro: "column duracao_minutos does not exist"

## Problema

Se você está recebendo o erro `column "duracao_minutos" does not exist`, significa que a tabela `servicos` no Supabase não possui a coluna `duracao_minutos`.

## Solução Rápida

Execute o script `supabase/adicionar-duracao-minutos.sql` no Supabase:

1. Acesse o **Supabase Dashboard**
2. Vá em **SQL Editor** (no menu lateral)
3. Clique em **New Query**
4. Abra o arquivo `supabase/adicionar-duracao-minutos.sql` e copie **TODO** o conteúdo
5. Cole no editor SQL do Supabase
6. Clique em **Run** (ou pressione Ctrl+Enter)

## Solução Alternativa

Se preferir, você também pode executar o script `supabase/corrigir-tabela-servicos.sql` que corrige todas as colunas faltantes, incluindo `duracao_minutos`.

## Verificação

Após executar o script, você pode verificar se a coluna foi criada:

```sql
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'servicos' 
AND column_name = 'duracao_minutos';
```

Se retornar uma linha com `duracao_minutos` e `integer`, a coluna foi criada com sucesso!

## O que o script faz

- Verifica se a coluna `duracao_minutos` existe
- Se não existir, cria a coluna como `INTEGER NOT NULL` com valor padrão `30`
- Atualiza registros existentes que possam ter `NULL` com o valor padrão
- Garante que a coluna seja `NOT NULL`

## Próximos Passos

Após executar o script, recarregue a página da aplicação. O erro deve desaparecer.
