# 🔐 Configuração do Google OAuth - Google Cloud Console

## 📍 Onde encontrar as URLs necessárias:

### 1. URL do Supabase:
- Acesse: https://supabase.com/dashboard
- Vá em: **Settings** → **API**
- Copie: **Project URL** (exemplo: `https://abcdefghijklmnop.supabase.co`)

---

## 🔧 Configuração no Google Cloud Console:

### Passo 1: Acesse suas credenciais
1. Vá em: **APIs & Services** → **Credentials**
2. Clique no seu **OAuth 2.0 Client ID** (ou crie um novo)

### Passo 2: Preencha os campos:

#### ✅ **Authorized JavaScript origins:**
Adicione as seguintes URLs (uma por linha):

```
https://seu-projeto.supabase.co
```

**Exemplo:**
```
https://abcdefghijklmnop.supabase.co
```

**Nota:** Após fazer deploy na Vercel, você pode adicionar também:
```
https://seu-projeto.vercel.app
```

---

#### ✅ **Authorized redirect URIs:**
Adicione as seguintes URLs (uma por linha):

```
https://seu-projeto.supabase.co/auth/v1/callback
http://localhost:3000/auth/callback
```

**Exemplo:**
```
https://abcdefghijklmnop.supabase.co/auth/v1/callback
http://localhost:3000/auth/callback
```

**Nota:** Após fazer deploy na Vercel, adicione também:
```
https://seu-projeto.vercel.app/auth/callback
```

---

### Passo 3: Salvar
- Clique em **"Save"** no final da página
- Aguarde alguns segundos para as alterações serem aplicadas

---

## ✅ Resumo Rápido:

### **Authorized JavaScript origins:**
```
https://seu-projeto.supabase.co
```

### **Authorized redirect URIs:**
```
https://seu-projeto.supabase.co/auth/v1/callback
http://localhost:3000/auth/callback
```

---

## 🔍 Como encontrar sua URL do Supabase:

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em: **Settings** (ícone de engrenagem) → **API**
4. Copie a **Project URL** que aparece no topo

---

## ⚠️ Importante:

- Substitua `seu-projeto` pela URL real do seu projeto Supabase
- A URL deve começar com `https://` e não pode ter barra `/` no final
- Após o deploy na Vercel, você precisará adicionar a URL da Vercel também
