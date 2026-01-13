# Guia de Configuração - MagBarber

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase (gratuita)
- Conta no Google Cloud Console (para OAuth)

## 🔧 Passo a Passo

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto
2. Anote a URL do projeto e a chave anônima (anon key)
3. Vá em **SQL Editor** e execute o conteúdo do arquivo `supabase/schema.sql`
4. Verifique se as tabelas foram criadas em **Table Editor**

### 3. Configurar Google OAuth

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto ou selecione um existente
3. Vá em **APIs & Services** → **Credentials**
4. Clique em **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure:
   - Application type: **Web application**
   - Authorized redirect URIs: 
     - `https://seu-projeto.supabase.co/auth/v1/callback` (produção)
     - `http://localhost:3000/auth/callback` (desenvolvimento)
6. Copie o **Client ID** e **Client Secret**

### 4. Configurar OAuth no Supabase

1. No Supabase, vá em **Authentication** → **Providers**
2. Ative o provider **Google**
3. Cole o **Client ID** e **Client Secret** do Google
4. Salve as alterações

### 5. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
```

### 6. Executar o Projeto

```bash
npm run dev
```

Acesse `http://localhost:3000` no navegador.

## ✅ Verificações

- [ ] Tabelas criadas no Supabase (servicos, barbeiros, agendamentos)
- [ ] Políticas RLS configuradas
- [ ] Google OAuth configurado e funcionando
- [ ] Variáveis de ambiente configuradas
- [ ] Projeto rodando sem erros

## 🐛 Troubleshooting

### Erro de autenticação
- Verifique se as URLs de callback estão corretas no Google Cloud Console
- Confirme que o OAuth está ativado no Supabase

### Erro ao carregar serviços/barbeiros
- Verifique se os dados iniciais foram inseridos (execute novamente o INSERT do schema.sql)
- Confirme que as políticas RLS estão corretas

### Erro ao criar agendamento
- Verifique se o usuário está autenticado
- Confirme que as foreign keys estão corretas
- Verifique os logs do Supabase em **Logs** → **Postgres Logs**
