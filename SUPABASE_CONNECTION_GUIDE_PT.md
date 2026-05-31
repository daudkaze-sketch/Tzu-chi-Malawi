# 🔗 Guia de Conexão: Supabase + Projeto Tzu Chi Malawi

## Passo 1: Obtenha as Credenciais do Supabase

### No Dashboard do Supabase:

1. **Acesse seu projeto** em supabase.com
2. Clique em **Settings** (⚙️) na barra lateral
3. Clique em **Database** 
4. Na seção **Connection String**, copie a **URI** completa

Você verá algo assim:
```
postgresql://postgres.xxxxxxxxxxxx:AbCdEfGhIjKlMnOp@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

## Passo 2: Atualize o Arquivo .env

Abra o arquivo `.env` (criado na raiz do projeto) e substitua:

```env
# ANTES (comentado):
# DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?schema=public"

# DEPOIS (com suas credenciais):
DATABASE_URL="postgresql://postgres.xxxxxxxxxxxx:AbCdEfGhIjKlMnOp@aws-0-us-east-1.pooler.supabase.com:5432/postgres?schema=public"
DIRECT_URL="postgresql://postgres.xxxxxxxxxxxx:AbCdEfGhIjKlMnOp@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

### ⚠️ Importante:
- **NUNCA committe o arquivo `.env`** com senhas reais no GitHub
- O `.gitignore` já está configurado para ignorar este arquivo
- Mantenha as chaves seguras!

## Passo 3: Instale as Dependências

```bash
npm install
```

## Passo 4: Gere o Cliente Prisma

```bash
npx prisma generate
```

## Passo 5: Sincronize o Schema

Se a schema ainda não foi criada no Supabase, execute:

```bash
npx prisma db push
```

Isso vai criar todas as 18 tabelas no seu banco de dados Supabase.

## Passo 6: Teste a Conexão

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse `http://localhost:3000` e teste:

✅ **Testes para fazer:**
1. Tente criar uma conta
2. Faça login
3. Crie um Daily Report
4. Adicione um Task
5. Verifique se os dados aparecem no Supabase

### Verifique no Supabase:

1. Vá para **Table Editor** no Supabase
2. Clique em **User** table
3. Você deve ver seus dados!

## Passo 7: Gere Chaves Seguras

### Para NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### Para JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copie os resultados e atualize o `.env`

## 🐛 Troubleshooting

### Erro: "Can't reach database server"
```bash
# Verifique:
1. Sua internet está funcionando?
2. A senha no .env está correta?
3. O projeto Supabase está ativo?
```

### Erro: "relation \"User\" does not exist"
```bash
# Execute novamente:
npx prisma db push
```

### Erro: "Prisma Client Generation Error"
```bash
# Limpe o cache:
rm -rf node_modules/.prisma
npx prisma generate
```

### Erro de Autenticação
```bash
# Verifique o arquivo .env:
- DATABASE_URL tem a URL correta?
- Tem ?schema=public no final?
- A senha está correta?
```

## 📊 Estrutura de Conexão

```
Your Application
       ↓
   Prisma ORM
       ↓
  NextAuth (Authentication)
       ↓
 Supabase PostgreSQL
       ↓
   18 Database Tables
```

## 🔑 Variáveis de Ambiente Necessárias

```env
# OBRIGATÓRIO
DATABASE_URL=               # URL de conexão PostgreSQL
DIRECT_URL=                 # URL direta (sem pool)
NEXTAUTH_SECRET=            # Chave de segurança NextAuth
NEXTAUTH_URL=               # URL da aplicação

# OPCIONAL (para recursos extras)
JWT_SECRET=                 # Token JWT
SUPABASE_URL=               # URL do Supabase
SUPABASE_ANON_KEY=          # Chave anônima
```

## ✅ Checklist de Conexão

- [ ] Arquivo `.env` criado com as credenciais
- [ ] `npm install` executado
- [ ] `npx prisma generate` executado
- [ ] `npm run dev` iniciado sem erros
- [ ] Página de login carrega em `http://localhost:3000`
- [ ] Consegue criar uma conta
- [ ] Consegue fazer login
- [ ] Dados aparecem no Supabase Dashboard
- [ ] Tabelas aparecem em "Table Editor"

## 📚 Próximos Passos

1. **Configurar Row Level Security (RLS)**
   - Ver `SUPABASE_SETUP.md` para políticas de segurança

2. **Backup Automático**
   - Settings → Backups
   - Configure daily backups

3. **Monitoring**
   - Settings → Logs & Monitoring
   - Configure alertas

4. **Deploy em Produção**
   - Ver `DEPLOYMENT.md`
   - Usar Vercel ou outro hosting

## 🆘 Precisa de Ajuda?

Consulte também:
- `SUPABASE_SETUP.md` - Guia detalhado do Supabase
- `SUPABASE_SCHEMA_SETUP.md` - Informações sobre as tabelas
- `DATABASE_SCHEMA.md` - Diagrama do banco de dados
- `SUPABASE_COMMON_QUERIES.sql` - Queries úteis

---

**Depois de conectar, você terá acesso a:**
- ✅ Autenticação de usuários
- ✅ Armazenamento de dados em produção
- ✅ 18 tabelas otimizadas
- ✅ Backups automáticos
- ✅ Dashboard em tempo real
