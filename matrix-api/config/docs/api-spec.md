# Matrix API Mainframe Documentation

## Endpoints HTTP

### Autenticação (/api/auth)
- **POST `/api/auth/register`**
  - Body: `{ "username": "neo", "password": "matrix_password" }`
  - Resposta: `{ "success": true, "data": { "user": { ... }, "token": "..." } }`
- **POST `/api/auth/login`**
  - Body: `{ "username": "neo", "password": "matrix_password" }`
  - Resposta: `{ "success": true, "data": { "user": { ... }, "token": "..." } }`
- **GET `/api/auth/me`**
  - Header: `Authorization: Bearer <token>`
  - Resposta: `{ "success": true, "user": { "id": 1, "username": "neo" } }`

### Operadores (/api/users)
- **GET `/api/users`**
  - Retorna a lista de operadores com ranking ELO e status online/offline/busy.
- **GET `/api/users/:id`**
  - Retorna detalhes de um operador específico.

### Partidas (/api/matches)
- **GET `/api/matches`**
  - Lista todas as partidas ativas ou aguardando no lobby.
- **POST `/api/matches`**
  - Cria uma nova partida e retorna o objeto com ID hexadecimal (ex: `0x8A1`).
- **GET `/api/matches/:matchId`**
  - Retorna o estado atual do tabuleiro (9 casas), turno ('X' ou 'O') e jogadores.
- **POST `/api/matches/:matchId/join`**
  - Segundo jogador entra na partida.
- **POST `/api/matches/:matchId/move`**
  - Realiza uma jogada em um índice de 0 a 8.

---

## Eventos Socket.io (Tempo Real)

- **`create_match`**: Emite criação de partida. O servidor responde com `match_created`.
- **`join_match`**: Emite `{ matchId }`. O servidor emite `match_started` para a sala.
- **`make_move`**: Emite `{ matchId, moveIndex }`. O servidor emite `move_made` e `match_updated` com o resultado do tabuleiro e vencedor.
- **`register_presence`**: Emite dados do operador para atualizar status online no lobby.
