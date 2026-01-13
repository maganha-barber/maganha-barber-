# 🚀 Guia de Deploy - MagBarber

## 📋 Passo 1: Enviar para o GitHub

### 1.1 Criar repositório no GitHub

1. Acesse [github.com](https://github.com) e faça login
2. Clique no botão **"+"** no canto superior direito → **"New repository"**
3. Preencha:
   - **Repository name**: `MagBarber` (ou o nome que preferir)
   - **Description**: "Sistema de agendamentos para barbearia"
   - **Visibility**: Escolha **Private** (recomendado) ou **Public**
   - **NÃO marque** "Initialize with README" (já temos um)
4. Clique em **"Create repository"**

### 1.2 Conectar e enviar código

Execute os seguintes comandos no terminal (substitua `SEU_USUARIO` pelo seu username do GitHub):

```bash
# Adicionar o repositório remoto
git remote add origin https://github.com/SEU_USUARIO/MagBarber.git

# Renomear branch para main (se necessário)
git branch -M main

# Enviar código para o GitHub
git push -u origin main
```

**Nota**: Se você criou o repositório com outro nome, ajuste a URL acima.

## 📋 Passo 2: Deploy na Vercel

### 2.1 Criar conta na Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"Sign Up"**
3. Escolha **"Continue with GitHub"** (recomendado)
4. Autorize a Vercel a acessar seus repositórios

### 2.2 Importar projeto

1. No dashboard da Vercel, clique em **"Add New..."** → **"Project"**
2. Selecione o repositório **MagBarber** da lista
3. Clique em **"Import"**

### 2.3 Configurar projeto

A Vercel detectará automaticamente que é um projeto Next.js. Configure:

#### Framework Preset
- ✅ Deve estar como **Next.js** (detectado automaticamente)

#### Environment Variables
Adicione as variáveis de ambiente:
- `NEXT_PUBLIC_SUPABASE_URL` = sua URL do Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = sua chave anônima do Supabase

#### Build and Output Settings
- Deixe os valores padrão (a Vercel detecta automaticamente)

### 2.4 Deploy

1. Clique em **"Deploy"**
2. Aguarde o build (geralmente 1-2 minutos)
3. Quando concluir, você receberá uma URL: `https://magbarber-xxxxx.vercel.app`

### 2.5 Configurar domínio customizado (opcional)

1. No projeto na Vercel, vá em **Settings** → **Domains**
2. Adicione seu domínio customizado
3. Siga as instruções para configurar DNS

## 📋 Passo 3: Atualizar Google OAuth

Após o deploy, você precisa atualizar as URLs de callback no Google Cloud Console:

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Vá em **APIs & Services** → **Credentials**
3. Clique no seu **OAuth 2.0 Client ID**
4. Em **Authorized redirect URIs**, adicione:
   - `https://seu-dominio.vercel.app/auth/callback`
   - `https://magbarber-xxxxx.vercel.app/auth/callback` (URL gerada pela Vercel)

5. Salve as alterações

## 📋 Passo 4: Atualizar Supabase

1. No Supabase, vá em **Authentication** → **URL Configuration**
2. Adicione nas **Redirect URLs**:
   - `https://seu-dominio.vercel.app/auth/callback`
   - `https://magbarber-xxxxx.vercel.app/auth/callback`

## ✅ Verificações Finais

- [ ] Código enviado para o GitHub
- [ ] Projeto deployado na Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Google OAuth atualizado com URLs de produção
- [ ] Supabase atualizado com URLs de produção
- [ ] Site funcionando em produção

## 🔄 Deploy Automático

A partir de agora, a cada `git push` para o GitHub, a Vercel fará deploy automático!

```bash
# Fazer alterações
git add .
git commit -m "Sua mensagem"
git push
```

A Vercel detectará automaticamente e fará o deploy! 🚀
