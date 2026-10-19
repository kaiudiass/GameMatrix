FROM node:20-alpine

WORKDIR /app

# Copia arquivos de dependências
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o código fonte
COPY . .

# Expõe a porta da API e WebSocket
EXPOSE 3000

# Inicia em modo desenvolvimento com hot-reload
CMD ["npm", "run", "dev"]
