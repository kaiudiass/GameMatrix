# ⚡ Matrix API (Express + Sequelize + PostgreSQL + Socket.io)

API RESTful e Servidor em Tempo Real do jogo Matrix em JavaScript puro (sem TypeScript, ES Modules com `"type": "module"`).

## 📁 Estrutura de Diretórios

```
matrix-api/
├── config/
│   ├── database/             # Conexão Sequelize e inicialização do PostgreSQL
│   │   ├── index.js
│   │   └── sequelize.js
│   ├── docs/                 # Documentação e especificações de rotas
│   │   └── api-spec.md
│   ├── exceptions/           # Classes de erro customizadas (AppError, NotFound, etc.)
│   │   ├── AppError.js
│   │   └── index.js
│   ├── middleware/           # Middlewares (autenticação JWT, validação Zod, erro)
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── validationMiddleware.js
│   └── utils/                # Funções utilitárias (JWT, Bcrypt, Constantes)
│       ├── constants.js
│       ├── jwt.js
│       └── password.js
├── controller/               # Camada de controle HTTP (Express)
│   ├── authController.js
│   ├── matchController.js
│   └── userController.js
├── coverage/                 # Relatórios de cobertura de testes
├── dtos/                     # Schemas de validação e tipagem com Zod
│   ├── request/              # DTOs de entrada / requisições (separados por responsabilidade)
│   │   ├── authDTO.js
│   │   ├── matchDTO.js
│   │   ├── userDTO.js
│   │   └── index.js
│   ├── response/             # DTOs de saída / respostas (separados por responsabilidade)
│   │   ├── authDTO.js
│   │   ├── matchDTO.js
│   │   ├── userDTO.js
│   │   └── index.js
│   ├── authDTO.js            # Wrapper de retrocompatibilidade
│   ├── matchDTO.js           # Wrapper de retrocompatibilidade
│   ├── userDTO.js            # Wrapper de retrocompatibilidade
│   └── index.js              # Exportação central unificada
├── node_modules/             # Dependências instaladas
├── repository/               # Camada de acesso a dados e modelos Sequelize
│   ├── models/
│   │   ├── Match.js
│   │   ├── User.js
│   │   └── index.js          # Relacionamentos e associações
│   ├── matchRepository.js
│   └── userRepository.js
├── routes/                   # Definição e roteamento de endpoints
│   ├── authRoutes.js
│   ├── index.js
│   ├── matchRoutes.js
│   └── userRoutes.js
├── service/                  # Regras de negócio e lógica de partida (3x3)
│   ├── authService.js
│   ├── matchService.js
│   └── userService.js
├── socket/                   # Manipuladores de eventos Socket.io em tempo real
│   └── socketHandler.js
├── tests/                    # Testes unitários da lógica de jogo
│   └── game.test.js
├── .env
├── .env.example
├── .gitignore
├── package.json
└── server.js                 # Ponto de entrada da aplicação
```

## 🛠️ Tecnologias Instaladas

- **express** (`^5.3.0`): Servidor HTTP
- **sequelize** (`^6.37.8`): ORM para PostgreSQL
- **pg** (`^8.23.1`) & **pg-hstore**: Driver para PostgreSQL
- **socket.io** (`^4.8.4`): Comunicação bidirecional em tempo real
- **zod** (`^4.6.5`): Validação de tipos e DTOs
- **bcryptjs** (`^3.0.3`): Criptografia de senhas
- **jsonwebtoken** (`^9.0.3`): Tokens de acesso stateless (JWT)
- **cors** (`^2.8.6`): Compartilhamento de recursos entre origens
- **dotenv** (`^18.0.7`): Gestão de variáveis de ambiente
- **nodemon** (`^3.1.14`): Monitoramento e hot-reload no desenvolvimento

## 🚀 Como Executar

### 1. Instalar dependências
```bash
cd matrix-api
npm install
```

### 2. Configurar o `.env`
Edite o arquivo `.env` com suas credenciais do PostgreSQL:
```env
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/matrix_db
CLIENT_URL=http://localhost:5173
JWT_SECRET=super_secret_matrix_jwt_token_key_change_me
```

### 3. Executar o servidor
- **Modo Desenvolvimento (com Nodemon)**:
  ```bash
  npm run dev
  ```
- **Modo Produção**:
  ```bash
  npm start
  ```
- **Testes**:
  ```bash
  npm test
  ```
