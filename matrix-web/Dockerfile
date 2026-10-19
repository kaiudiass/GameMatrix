FROM node:20-alpine

WORKDIR /app

# Copia arquivos de dependências
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o código fonte
COPY . .

# Expõe a porta do servidor Vite
EXPOSE 5173

# Configuração para comunicação com o container do backend via proxy do Vite
ENV BACKEND_URL=http://matrix-api:3000
ENV VITE_API_URL=/api
ENV VITE_SOCKET_URL=/

# Inicia o servidor Vite para desenvolvimento
CMD ["npm", "run", "dev"]
