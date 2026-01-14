# 📋 Como Atualizar Dados no Supabase

Este guia explica como atualizar os dados (serviços, barbeiros e horários) no Supabase.

## 🚀 Método 1: Usando o Script SQL (Recomendado)

1. **Acesse o Supabase Dashboard**
   - Vá para: https://supabase.com/dashboard
   - Selecione seu projeto

2. **Abra o SQL Editor**
   - No menu lateral, clique em **SQL Editor**
   - Clique em **New Query**

3. **Execute o Script**
   - Abra o arquivo `supabase/atualizar-dados.sql`
   - Copie todo o conteúdo
   - Cole no SQL Editor do Supabase
   - Clique em **Run** (ou pressione `Ctrl+Enter`)

4. **Verifique os Dados**
   - Execute as queries de verificação no final do script:
     ```sql
     SELECT * FROM servicos ORDER BY ordem;
     SELECT * FROM barbeiros;
     SELECT * FROM horarios_funcionamento ORDER BY dia_semana;
     ```

## 🎨 Método 2: Usando o Painel Admin do Site

1. **Faça Login como Admin**
   - Acesse: `https://seu-site.com/admin`
   - Faça login com o email: `lpmragi@gmail.com`

2. **Editar Serviços**
   - Clique na aba **Serviços**
   - Clique no ícone de editar (✏️) ao lado do serviço
   - Altere os dados desejados
   - Clique em **Salvar**

3. **Editar Horários**
   - Clique na aba **Horários**
   - Clique no ícone de editar (✏️) ao lado do dia da semana
   - Marque/desmarque "Aberto"
   - Configure os horários de manhã e tarde
   - Clique em **Salvar**

## 📝 Dados Padrão

### Serviços
- **Completo (Corte, Barba, Sobrancelhas)** - R$ 78,00 (80 min)
- **Corte de cabelo** - R$ 40,00 (40 min)
- **Barba** - R$ 35,00 (30 min)
- **Sobrancelhas** - R$ 20,00 (10 min)
- **Pezinho** - R$ 12,00 (10 min)

### Barbeiros
- **Ronnie Maganha** - Especialista em todos os serviços

### Horários de Funcionamento
- **Segunda a Sexta**: 09:00 - 12:00 e 14:00 - 19:00
- **Sábado**: 09:00 - 12:00 e 13:00 - 19:00
- **Domingo**: Fechado

## ⚠️ Importante

- Os dados são atualizados usando `ON CONFLICT DO UPDATE`, então você pode executar o script quantas vezes quiser sem duplicar registros
- Se você criar novos serviços/barbeiros pelo painel admin, eles serão salvos automaticamente no Supabase
- Os horários de funcionamento afetam diretamente a disponibilidade de agendamentos
