# 🕹️ Matrix - Game & API (Fullstack Docker)

Monorepo estruturado com o Frontend Web, Backend API em Node.js (Express + Sequelize) e Banco de Dados PostgreSQL, todos orquestrados via Docker Compose.

---

## 📁 Estrutura do Projeto

```
vovóMatrix/
├── docker-compose.yml  # Orquestrador com PostgreSQL, matrix-api e matrix-web
├── matrix-api/         # Backend (Express 5, Sequelize, PostgreSQL, Socket.io)
│   └── Dockerfile
└── matrix-web/         # Frontend (React 19, Vite, Socket.io-client)
    └── Dockerfile
```

---

## 🐳 Como Executar com Docker (Recomendado)

Suba toda a infraestrutura (PostgreSQL, Backend API e Frontend Web) com um único comando na raiz:

```bash
docker compose up --build
```

- **Frontend Web**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3000](http://localhost:3000)
- **Banco PostgreSQL**: `localhost:5432`

> **Hot Reload ativo**: O volume `./matrix-api:/app` e `./matrix-web:/app` permite que qualquer alteração feita no seu editor reflita instantaneamente dentro dos containers.

---

## 🛠️ Comandos Úteis do Docker

- **Rodar em background (modo detached)**:

  ```bash
  docker compose up -d
  ```
- **Ver logs em tempo real**:

  ```bash
  docker compose logs -f
  ```
- **Parar todos os containers**:

  ```bash
  docker compose down
  ```
