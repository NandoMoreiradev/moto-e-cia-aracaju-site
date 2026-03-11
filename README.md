# Moto e Cia Aracaju — Novo Site

## Setup Rápido

### 1. Pré-requisitos
- Node.js >= 20
- pnpm >= 9 (já instalado via `npm install -g pnpm`)
- PostgreSQL (local ou Render/Supabase)

### 2. Configurar variáveis de ambiente

**Backend:**
```bash
cp apps/api/.env.example apps/api/.env
# Edite apps/api/.env com suas credenciais
```

**Frontend:**
```bash
cp apps/web/.env.example apps/web/.env.local
# Edite apps/web/.env.local
```

### 3. Instalar dependências
```bash
pnpm install
```

### 4. Configurar banco de dados
```bash
# Gerar o cliente Prisma
pnpm --filter @moto-e-cia/api db:generate

# Rodar migrations
pnpm --filter @moto-e-cia/api db:migrate

# Criar dados iniciais (admin user)
cd apps/api && npx ts-node -r tsconfig-paths/register ../../prisma/seed.ts
```

### 5. Rodar em desenvolvimento
```bash
# Rodar tudo junto
pnpm dev

# Ou separado:
pnpm --filter @moto-e-cia/api dev    # Backend em :4000
pnpm --filter @moto-e-cia/web dev    # Frontend em :3000
```

### 6. Acessar
- **Site:** http://localhost:3000
- **Admin:** http://localhost:3000/admin
- **API:** http://localhost:4000/api
- **Swagger:** http://localhost:4000/docs

---

## Estrutura do Projeto

```
moto-e-cia-aracaju-site/
├── apps/
│   ├── api/          # NestJS (porta 4000) → deploy: Render
│   └── web/          # Next.js (porta 3000) → deploy: Vercel
├── packages/
│   └── shared/       # Tipos TypeScript + Theme compartilhados
└── prisma/           # Schema único compartilhado
```

## Deploy

### Backend (Render)
1. Criar novo Web Service no [Render](https://render.com)
2. Build command: `pnpm install && pnpm --filter @moto-e-cia/api build`
3. Start command: `pnpm --filter @moto-e-cia/api start`
4. Configurar variáveis de ambiente (ver `apps/api/.env.example`)

### Frontend (Vercel)
1. Importar repositório no [Vercel](https://vercel.com)
2. Root directory: `apps/web`
3. Framework: Next.js (auto-detect)
4. Configurar `NEXT_PUBLIC_API_URL` apontando para o Render

## Variáveis de Ambiente Necessárias

| Variável | Onde configurar | Descrição |
|---|---|---|
| `DATABASE_URL` | Render (API) | PostgreSQL connection string |
| `JWT_SECRET` | Render (API) | Chave secreta JWT (mín. 32 chars) |
| `R2_ACCOUNT_ID` | Render (API) | ID da conta Cloudflare |
| `R2_BUCKET_NAME` | Render (API) | Nome do bucket R2 |
| `R2_ACCESS_KEY_ID` | Render (API) | Access key do R2 |
| `R2_SECRET_ACCESS_KEY` | Render (API) | Secret key do R2 |
| `R2_PUBLIC_URL` | Render (API) | URL pública do bucket |
| `META_ACCESS_TOKEN` | Render (API) | Token da Meta Graph API |
| `META_CATALOG_ID` | Render (API) | ID do catálogo Meta |
| `NEXT_PUBLIC_API_URL` | Vercel (Web) | URL do backend Render |
| `NEXT_PUBLIC_WHATSAPP` | Vercel (Web) | Número WhatsApp (com DDI) |
