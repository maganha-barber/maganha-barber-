# Configuração do Google OAuth

## Erro: redirect_uri_mismatch

Este erro ocorre quando o `redirect_uri` enviado ao Google não corresponde **exatamente** ao que está configurado no Google Cloud Console.

## Como corrigir:

### 1. Acesse o Google Cloud Console
- Vá para: https://console.cloud.google.com/
- Selecione seu projeto

### 2. Configure as URIs de redirecionamento autorizadas

**Vá em:** APIs & Services → Credentials → Seu OAuth 2.0 Client ID → Authorized redirect URIs

### 3. Adicione EXATAMENTE estas URIs (sem trailing slash):

**Para desenvolvimento local:**
```
http://localhost:3000/auth/callback
```

**Para produção (Vercel):**
```
https://maganha-barber-2756.vercel.app/auth/callback
```

**IMPORTANTE:**
- ✅ Use `https://` (não `http://`) em produção
- ✅ Não adicione trailing slash (`/`) no final
- ✅ Não adicione query parameters (`?redirect=...`)
- ✅ O caminho deve ser exatamente `/auth/callback`
- ✅ Use o domínio exato do seu site (verifique na Vercel)

### 4. Verifique o domínio na Vercel

1. Acesse seu projeto na Vercel
2. Vá em Settings → Domains
3. Copie o domínio exato (ex: `maganha-barber-2756.vercel.app`)
4. Use esse domínio EXATO no Google Cloud Console

### 5. Exemplo de configuração correta:

```
Authorized redirect URIs:
https://maganha-barber-2756.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

### 6. Após adicionar, aguarde alguns minutos

O Google pode levar alguns minutos para propagar as mudanças.

### 7. Verifique as variáveis de ambiente na Vercel

Certifique-se de que estas variáveis estão configuradas:

```
GOOGLE_CLIENT_ID=seu-client-id-aqui
GOOGLE_CLIENT_SECRET=seu-client-secret-aqui
NEXT_PUBLIC_GOOGLE_CLIENT_ID=seu-client-id-aqui (opcional, para uso no cliente)
```

## Debug

Se ainda estiver com problemas, verifique:

1. O domínio está correto? (sem `www`, sem porta, sem trailing slash)
2. Está usando `https://` em produção?
3. As variáveis de ambiente estão configuradas corretamente?
4. Aguardou alguns minutos após adicionar a URI?

## Formato esperado do redirect_uri:

O código está enviando: `${origin}/auth/callback`

Onde `origin` é:
- Local: `http://localhost:3000`
- Produção: `https://maganha-barber-2756.vercel.app` (ou seu domínio customizado)

Certifique-se de que essa URI EXATA está no Google Cloud Console.
