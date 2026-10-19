// Testes importando diretamente da nova estrutura separada (request e response por responsabilidade)
import { registerRequestDTO, loginRequestDTO } from '../dtos/request/authDTO.js';
import { userIdParamDTO } from '../dtos/request/userDTO.js';
import { createMatchRequestDTO, makeMoveRequestDTO } from '../dtos/request/matchDTO.js';

import { authResponseDTO } from '../dtos/response/authDTO.js';
import { userResponseDTO, userListResponseDTO } from '../dtos/response/userDTO.js';
import { matchResponseDTO } from '../dtos/response/matchDTO.js';

// Testes de retrocompatibilidade (dtos/authDTO.js, dtos/userDTO.js, dtos/matchDTO.js, dtos/index.js)
import LegacyAuthDTO from '../dtos/authDTO.js';
import LegacyUserDTO from '../dtos/userDTO.js';
import LegacyMatchDTO from '../dtos/matchDTO.js';
import * as RootDTOs from '../dtos/index.js';

console.log('--- EXECUTANDO TESTES DE DTOs (REQUEST / RESPONSE / RESPONSABILIDADES) ---');

// 1. userResponseDTO: Deve remover a senha (strip)
const userWithPassword = {
  id: 1,
  username: 'neo',
  password: 'superSecretHash123',
  status: 'online',
  createdAt: new Date()
};
const safeUser = userResponseDTO.parse(userWithPassword);
if (!safeUser.password && safeUser.username === 'neo') {
  console.log('✓ Test 1: userResponseDTO sanitizou a senha com sucesso.');
} else {
  console.error('✗ Test 1 falhou: senha não foi removida.');
  process.exit(1);
}

// 2. authResponseDTO: Deve conter user seguro e token
const authData = {
  user: userWithPassword,
  token: 'jwt-matrix-token'
};
const safeAuth = authResponseDTO.parse(authData);
if (!safeAuth.user.password && safeAuth.token === 'jwt-matrix-token') {
  console.log('✓ Test 2: authResponseDTO validou estrutura e ocultou senha.');
} else {
  console.error('✗ Test 2 falhou no authResponseDTO.');
  process.exit(1);
}

// 3. userListResponseDTO: Lista de usuários sem senha
const userList = [userWithPassword, { id: 2, username: 'trinity', password: 'xyz', status: 'busy' }];
const safeList = userListResponseDTO.parse(userList);
if (safeList.length === 2 && !safeList[0].password && !safeList[1].password) {
  console.log('✓ Test 3: userListResponseDTO limpou lista de usuários com sucesso.');
} else {
  console.error('✗ Test 3 falhou no userListResponseDTO.');
  process.exit(1);
}

// 4. makeMoveRequestDTO: Deve coagir string para number
const moveReq = makeMoveRequestDTO.parse({ moveIndex: '4', userId: 'user-1' });
if (moveReq.moveIndex === 4 && typeof moveReq.moveIndex === 'number') {
  console.log('✓ Test 4: makeMoveRequestDTO converteu índice numérico com sucesso.');
} else {
  console.error('✗ Test 4 falhou na coerção do moveIndex.');
  process.exit(1);
}

// 5. matchResponseDTO: Estrutura da partida
const matchSample = {
  id: '0xABCD',
  players: [{ id: 1, username: 'neo', symbol: 'X' }],
  board: Array(9).fill(null),
  currentTurn: 'X',
  status: 'in_progress',
  scoreX: 1,
  scoreO: 0,
  roundsPlayed: 1
};
const safeMatch = matchResponseDTO.parse(matchSample);
if (safeMatch.id === '0xABCD' && safeMatch.currentTurn === 'X' && safeMatch.players[0].symbol === 'X') {
  console.log('✓ Test 5: matchResponseDTO validado com sucesso.');
} else {
  console.error('✗ Test 5 falhou no matchResponseDTO.');
  process.exit(1);
}

// 6. Request validations (register, login, userIdParam, createMatch)
const validRegister = registerRequestDTO.parse({ username: 'trinity_01', password: 'mypassword' });
const validLogin = loginRequestDTO.parse({ username: 'trinity_01', password: 'mypassword' });
const validUserId = userIdParamDTO.parse({ id: 'user-123' });
const validCreateMatch = createMatchRequestDTO.parse({});

if (validRegister.username && validLogin.username && validUserId.id && validCreateMatch) {
  console.log('✓ Test 6: Request DTOs (auth, user, match) validados com sucesso.');
} else {
  console.error('✗ Test 6 falhou nos request DTOs.');
  process.exit(1);
}

// 7. Retrocompatibilidade: exportações nos arquivos raiz e barrels
if (
  LegacyAuthDTO.registerRequestDTO &&
  LegacyAuthDTO.authResponseDTO &&
  LegacyUserDTO.userIdParamDTO &&
  LegacyUserDTO.userResponseDTO &&
  LegacyMatchDTO.makeMoveRequestDTO &&
  LegacyMatchDTO.matchResponseDTO &&
  RootDTOs.registerRequestDTO &&
  RootDTOs.matchResponseDTO
) {
  console.log('✓ Test 7: Retrocompatibilidade e barrels (dtos/index.js) funcionando perfeitamente.');
} else {
  console.error('✗ Test 7 falhou na retrocompatibilidade.');
  process.exit(1);
}

console.log('--- TODOS OS TESTES DE DTOs PASSARAM COM SUCESSO ---');
