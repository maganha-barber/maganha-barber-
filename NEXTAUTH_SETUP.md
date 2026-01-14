# Configuração do NextAuth

## ⚠️ Erro: "There is a problem with the server configuration"

Este erro ocorre quando faltam variáveis de ambiente necessárias para o NextAuth.

## 🔧 Variáveis de Ambiente Necessárias

Adicione estas variáveis na Vercel (Settings → Environment Variables):

### 1. Variáveis Obrigatórias:

```
GOOGLE_CLIENT_ID=seu-client-id-do-google
GOOGLE_CLIENT_SECRET=seu-client-secret-do-google
NEXTAUTH_SECRET=uma-string-aleatoria-segura
NEXTAUTH_URL=https://maganha-barber-2756.vercel.app
```

### 2. Como gerar NEXTAUTH_SECRET:

Execute no terminal:
```bash
openssl rand -base64 32
```

Ou use qualquer string aleatória longa (mínimo 32 caracteres).

### 3. Para desenvolvimento local (.env.local):

```
GOOGLE_CLIENT_ID=seu-client-id
GOOGLE_CLIENT_SECRET=seu-client-secret
NEXTAUTH_SECRET=sua-string-secreta-local
NEXTAUTH_URL=http://localhost:3000
```

## ✅ Verificação

Após adicionar as variáveis:
1. Faça redeploy na Vercel
2. Aguarde alguns minutos
3. Tente fazer login novamente

## 📝 Google Cloud Console

Certifique-se de que estas URIs estão configuradas:

**Authorized redirect URIs:**
```
https://maganha-barber-2756.vercel.app/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
```

**Authorized JavaScript origins:**
```
https://maganha-barber-2756.vercel.app
http://localhost:3000
```
