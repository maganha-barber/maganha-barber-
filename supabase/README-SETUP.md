# 🗄️ Guia de Setup do Banco de Dados - MagBarber

## 📋 Passo a Passo

### 1. Acesse o SQL Editor do Supabase

1. Vá para: https://supabase.com/dashboard/project/wsjuhkszeyzrphmyjttd
2. Clique em **SQL Editor** no menu lateral
3. Clique em **New Query**

### 2. Execute o Script SQL

1. Abra o arquivo `supabase/setup-completo.sql`
2. **Copie TODO o conteúdo** do arquivo
3. **Cole no SQL Editor** do Supabase
4. Clique em **Run** (ou pressione Ctrl+Enter)

### 3. Verifique se Funcionou

Execute esta query para verificar se as tabelas foram criadas:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('servicos', 'barbeiros', 'agendamentos');
```

Você deve ver 3 tabelas listadas.

### 4. Verifique os Dados Iniciais

```sql
-- Ver serviços
SELECT * FROM servicos;

-- Ver barbeiros
SELECT * FROM barbeiros;
```

Você deve ver 3 serviços e 3 barbeiros.

## 📊 Estrutura das Tabelas

### `servicos`
- **id**: UUID (chave primária)
- **nome**: Nome do serviço
- **descricao**: Descrição do serviço
- **duracao_minutos**: Duração em minutos
- **preco**: Preço do serviço
- **ativo**: Se o serviço está ativo

### `barbeiros`
- **id**: UUID (chave primária)
- **nome**: Nome do barbeiro
- **especialidade**: Especialidade do barbeiro
- **ativo**: Se o barbeiro está ativo

### `agendamentos`
- **id**: UUID (chave primária)
- **usuario_id**: ID do usuário (string - pode ser ID do Google)
- **usuario_email**: Email do usuário
- **usuario_nome**: Nome do usuário
- **servico_id**: ID do serviço (foreign key)
- **barbeiro_id**: ID do barbeiro (foreign key)
- **data**: Data do agendamento
- **hora**: Hora do agendamento
- **status**: Status (pendente, confirmado, cancelado, concluido)
- **observacoes**: Observações do agendamento

## 🔒 Segurança (RLS)

As políticas RLS estão configuradas, mas como estamos usando OAuth direto com Google (não Supabase Auth), a validação principal será feita no código da aplicação.

## ✅ Pronto!

Após executar o script, seu banco de dados estará configurado e pronto para uso!
