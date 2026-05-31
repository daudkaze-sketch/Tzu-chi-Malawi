# 🔑 Como Copiar a Connection String do Supabase

## Passo a Passo:

### 1️⃣ Acesse o Dashboard
- Vá para: https://app.supabase.com
- Clique no seu projeto: `ycwjahvjacyiwnqflpeb`

### 2️⃣ Vá para as Configurações de Banco de Dados
- Menu esquerdo → **Settings** (⚙️)
- Clique em **Database**

### 3️⃣ Copie a Connection String
- Na seção **Connection String**
- Clique na aba **URI** (não use "Connection pooler")
- Copie a string completa

Você verá algo assim:
```
postgresql://postgres.ycwjahvjacyiwnqflpeb:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

## ⚠️ IMPORTANTE:

Na Connection String você verá `YOUR_PASSWORD` ou estará oculto como `••••••••`

### Se aparecer `YOUR_PASSWORD`:
```
postgresql://postgres.ycwjahvjacyiwnqflpeb:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres?schema=public
```
- Substitua `YOUR_PASSWORD` pela senha que você criou ao setup do Supabase
- Essa é a mesma senha que você usou quando criou o projeto

### Se a senha estiver oculta:
1. Clique em "Reveal" ou um ícone de olho
2. Copie a string completa com a senha visível

## Copie Exatamente:
```
postgresql://postgres.XXXX:SENHA@aws-0-us-east-1.pooler.supabase.com:5432/postgres?schema=public
```

## Cole no .env:
```env
DATABASE_URL="[Cole a connection string aqui]"
DIRECT_URL="[Cole sem ?schema=public]"
```

### Exemplo Completo:
```env
DATABASE_URL="postgresql://postgres.ycwjahvjacyiwnqflpeb:minhaSenhaSegura123@aws-0-us-east-1.pooler.supabase.com:5432/postgres?schema=public"
DIRECT_URL="postgresql://postgres.ycwjahvjacyiwnqflpeb:minhaSenhaSegura123@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

---

**Depois que tiver a Connection String, me avise e continuamos!**
