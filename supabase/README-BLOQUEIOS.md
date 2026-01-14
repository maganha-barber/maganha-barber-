# Como Criar a Tabela de Bloqueios de Horários

## Passo a Passo

1. Acesse o **Supabase Dashboard**
2. Vá em **SQL Editor** (no menu lateral)
3. Clique em **New Query**
4. Abra o arquivo `supabase/bloqueios-horarios.sql` e copie **TODO** o conteúdo
5. Cole no editor SQL do Supabase
6. Clique em **Run** (ou pressione Ctrl+Enter)

## Verificação

Após executar o script, você pode verificar se a tabela foi criada:

```sql
SELECT * FROM bloqueios_horarios LIMIT 1;
```

Se não houver erro, a tabela foi criada com sucesso!

## Estrutura da Tabela

A tabela `bloqueios_horarios` possui os seguintes campos:
- `id` - UUID (chave primária)
- `barbeiro_id` - UUID (referência ao barbeiro)
- `data` - DATE (data do bloqueio)
- `hora_inicio` - TIME (hora de início do bloqueio)
- `hora_fim` - TIME (hora de fim do bloqueio)
- `motivo` - TEXT (opcional, motivo do bloqueio)
- `created_at` - TIMESTAMP (data de criação)
- `updated_at` - TIMESTAMP (última atualização)

## Uso

Após criar a tabela, você poderá usar a funcionalidade de bloqueios no painel admin:
1. Acesse `/admin`
2. Vá na aba **Horários**
3. Role até a seção **Bloqueios de Horários**
4. Clique em **Novo Bloqueio**
5. Preencha os dados e salve
