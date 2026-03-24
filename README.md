# 🧑‍💻 Portfolio

<div align="center">

<img src="./.gitassets/capa.png" width="380px" alt="Capa do projeto Portfolio" />

<br />

<img src="https://img.shields.io/github/stars/AlonsoRafael/Portfolio?style=for-the-badge" alt="GitHub stars" />
<img src="https://img.shields.io/github/forks/AlonsoRafael/Portfolio?style=for-the-badge" alt="GitHub forks" />
<img src="https://img.shields.io/github/issues/AlonsoRafael/Portfolio?style=for-the-badge" alt="GitHub issues" />

<br />

<img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
<img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
<img src="https://img.shields.io/badge/n8n-EA4B71?style=for-the-badge&logo=n8n&logoColor=white" alt="n8n" />
<img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />

</div>

## 🌐 Deploy

- Producao: https://alonsotech.vercel.app/

Uma aplicacao full stack para apresentar projetos, tecnologias e experiencias profissionais de forma elegante, objetiva e interativa.

O projeto vai alem da vitrine tradicional: ele inclui um chat inteligente conectado por webhook, permitindo conversas em tempo real sobre stack, repositorios e historico profissional.

## ✨ O que este projeto entrega

- Landing page com destaque de tecnologias
- Sessao de curriculo e apresentacao profissional
- Catalogo de projetos com repositorio e stack associada
- Pagina de experiencias
- Chat flutuante com persistencia local e integracao com n8n
- API REST para consumo do frontend

## 🏛️ Estrutura do monorepo

```text
Portfolio/
|- frontend/   # Next.js 16 + React 19 + Tailwind
|- backend/    # NestJS 11 + Prisma + SupaBase
|- core/       # Tipos/contratos compartilhados
`- .gitassets/ # imagens do README
```

## 🧩 Endpoints da API

Base local padrao: http://localhost:4000

- GET /projetos
- GET /projetos/:id
- GET /tecnologias
- GET /tecnologias/destaques

## 🖥️ Como rodar este projeto

### Requisitos

- Node.js 20+
- Banco PostgreSQL (pode ser local ou Supabase)

### 1. Clone o repositorio

```bash
git clone https://github.com/AlonsoRafael/Portfolio.git
cd Portfolio
```

### 2. Instale as dependencias

```bash
npm install
cd frontend && npm install
cd ../backend && npm install
cd ..
```

### 3. Configure o backend

Crie o arquivo backend/.env:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB
DIRECT_URL=postgresql://USER:PASSWORD@HOST:5432/DB
PORT=4000
```

Obs: se PORT nao for definido, o backend usa 4000 por padrao.

### 4. Rode as migrations do Prisma

Dentro de backend:

```bash
npx prisma migrate deploy
```

Para ambiente de desenvolvimento, voce tambem pode usar:

```bash
npx prisma migrate dev
```

### 5. Configure o frontend

Crie o arquivo frontend/.env.local:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
CHAT_WEBHOOK=https://seu-n8n/webhook/assistente-pessoal
```

Sobre o webhook:

- Crie/importe seu fluxo no n8n
- Copie a URL de producao do webhook
- Cole no valor de CHAT_WEBHOOK
- Ative o workflow

Referencia no repositorio: https://github.com/AlonsoRafael/n8n_Portfolio

### 6. Execute o projeto

Na raiz:

```bash
npm run dev
```

Isso sobe:

- Frontend: http://localhost:3000
- Backend: http://localhost:4000

![](./.gitassets/portifolio_alonsorafael.png)

## 🗒️ Scripts uteis

### Raiz

- npm run dev

### Backend

- npm run start:dev
- npm run build
- npm run test
- npm run test:e2e

### Frontend

- npm run dev
- npm run build
- npm run start
- npm run lint

## 💎 Links uteis

- Next.js: https://nextjs.org/docs
- NestJS: https://docs.nestjs.com
- Prisma: https://www.prisma.io/docs
- PostgreSQL: https://www.postgresql.org/docs
- n8n: https://docs.n8n.io

## Contato

- GitHub: https://github.com/AlonsoRafael
- LinkedIn: https://www.linkedin.com/in/rafael-alonso-5b5099207/
