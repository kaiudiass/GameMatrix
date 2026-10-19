import http from 'http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import apiRoutes from './routes/index.js';
import { errorHandler } from './config/middleware/errorMiddleware.js';
import { setupSocketHandlers } from './socket/socketHandler.js';
import { connectDatabase } from './config/database/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

// Configuração flexível de CORS (suporta localhost, Docker e túneis como Cloudflare)
const allowedOrigins = CLIENT_URL
  ? CLIENT_URL.split(',').map((u) => u.trim())
  : [];

const corsOptions = {
  origin: (origin, callback) => {
    // Permite conexões sem origin (ex: chamadas internas, curl, mobile)
    if (!origin) return callback(null, true);

    // Em desenvolvimento ou se '*' estiver configurado
    if (process.env.NODE_ENV !== 'production' || allowedOrigins.includes('*')) {
      return callback(null, true);
    }

    // Permite túneis (Cloudflare, localtunnel, ngrok) e origens cadastradas
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.trycloudflare.com') ||
      origin.endsWith('.loca.lt') ||
      origin.endsWith('.ngrok-free.app') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1')
    ) {
      return callback(null, true);
    }

    return callback(new Error(`Origem ${origin} não permitida por CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
};

// Middlewares Globais
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP Server & Socket.io
const server = http.createServer(app);

const io = new Server(server, {
  cors: corsOptions
});

// Inicialização dos Sockets em tempo real
setupSocketHandlers(io);

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    system: 'MATRIX_API',
    version: '2.0.0 (Sequelize + PostgreSQL)',
    status: 'ONLINE',
    documentation: '/config/docs/api-spec.md'
  });
});

// Rotas da API
app.use('/api', apiRoutes);

// Middleware centralizado de tratamento de exceções
app.use(errorHandler);

// Inicializar Servidor e Sequelize
server.listen(PORT, async () => {
  console.log(`\n======================================================`);
  console.log(`  🟢 [MATRIX API] Servidor Express iniciado com sucesso! `);
  console.log(`  🌐 HTTP Port:      http://localhost:${PORT}`);
  console.log(`  ⚡ Socket.io:      Uplink em tempo real ativo`);
  console.log(`  🐘 ORM:            Sequelize + PostgreSQL`);
  console.log(`======================================================\n`);

  // Conectar e sincronizar Sequelize com PostgreSQL
  await connectDatabase();
});

export { app, server, io };
