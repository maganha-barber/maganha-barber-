# MagBarber - Sistema de Agendamentos para Barbearia

MVP profissional de um sistema de agendamentos para barbearia desenvolvido com Next.js 14+, TypeScript, Tailwind CSS e Supabase.

## 🎨 Design

- **Tema**: Dourado/Preto/Branco, estilo Premium e Elegante
- **Tipografia**: Playfair Display (títulos) e Inter (corpo)
- **Responsividade**: 100% Mobile-First
- **Navbar**: Sticky no topo com menu dropdown de usuário, menu mobile com h-[50vh]

## 🚀 Funcionalidades

1. **Landing Page**: Hero section premium com CTA "Agendar Agora"
2. **Sistema de Agendamento**: Interface profissional em 4 passos (Serviço → Barbeiro → Data → Horário)
3. **Autenticação**: Google OAuth via Supabase Auth (com fallback para localStorage)
4. **Área do Cliente**: Visualização e cancelamento de agendamentos futuros
5. **Painel Admin**: Dashboard interativo para gerenciar agendamentos
   - Estatísticas em tempo real
   - Confirmar/Cancelar agendamentos
   - Editar horários dos clientes
   - Filtros por status

## 📦 Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
Crie um arquivo `.env.local` com:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

3. Configure o banco de dados:
Execute o script SQL em `supabase/schema.sql` no seu projeto Supabase para criar as tabelas e políticas RLS.

4. Configure o Google OAuth no Supabase:
- Vá em Authentication → Providers → Google
- Adicione suas credenciais do Google OAuth
- Configure a URL de callback: `http://localhost:3000/auth/callback` (desenvolvimento)

5. Execute o projeto:
```bash
npm run dev
```

## 🗄️ Estrutura do Banco de Dados

### Tabelas:
- **servicos**: Serviços oferecidos pela barbearia
- **barbeiros**: Barbeiros disponíveis
- **agendamentos**: Agendamentos dos clientes

### Segurança (RLS):
- Usuários só podem ver/criar/editar seus próprios agendamentos
- Serviços e barbeiros são públicos para leitura

## 👤 Sistema de Usuários

### Clientes:
- Fazem login com Google
- Podem agendar horários
- Visualizam e cancelam seus agendamentos

### Administradores:
- Emails admin: `admin@magbarber.com` ou `dono@magbarber.com`
- Acesso ao painel administrativo (`/admin`)
- Podem confirmar, cancelar e editar agendamentos

## 📁 Estrutura do Projeto

```
├── app/
│   ├── admin/              # Painel administrativo
│   ├── agendar/            # Página de agendamento
│   ├── auth/               # Autenticação Google OAuth
│   ├── meus-agendamentos/  # Área do cliente
│   ├── layout.tsx          # Layout principal com Analytics
│   └── page.tsx            # Landing page
├── components/
│   ├── AdminDashboard.tsx # Dashboard admin
│   ├── AuthSync.tsx        # Sincronização de autenticação
│   ├── BookingForm.tsx     # Formulário de agendamento
│   ├── Footer.tsx          # Rodapé com contatos
│   ├── Hero.tsx           # Hero section
│   ├── Logo.tsx           # Logo da barbearia
│   ├── MyBookings.tsx     # Lista de agendamentos
│   ├── Navbar.tsx         # Navbar com menu de usuário
│   ├── Services.tsx       # Seção de serviços
│   ├── UserMenu.tsx       # Menu dropdown do usuário
│   └── CTA.tsx            # Call-to-action
├── lib/
│   ├── auth.ts            # Sistema de autenticação
│   └── supabase/          # Clientes Supabase (client/server)
└── supabase/
    └── schema.sql         # Script SQL do banco
```

## 🔒 Segurança

- Row Level Security (RLS) habilitado em todas as tabelas
- Políticas de segurança configuradas para proteger dados dos usuários
- Autenticação via Google OAuth
- Verificação de admin baseada em email

## 📊 Monitoramento

- Vercel Analytics integrado
- Vercel Speed Insights integrado

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório GitHub à Vercel
2. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Configure a URL de callback do Google OAuth para: `https://seu-dominio.vercel.app/auth/callback`
4. Deploy automático a cada push!

## 📝 Licença

Este projeto é privado e proprietário.
