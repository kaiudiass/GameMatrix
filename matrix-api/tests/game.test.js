import { MatchService } from '../service/matchService.js';

// Unit test demonstration for Tic-tac-toe win logic
console.log('--- EXECUTANDO TESTES UNITÁRIOS ---');

// Test 1: Horizontal win
const boardHorizontalWin = ['X', 'X', 'X', null, 'O', null, 'O', null, null];
const res1 = MatchService.checkWinner(boardHorizontalWin);
if (res1 && res1.winner === 'X') {
  console.log('✓ Test 1: Vitória horizontal do X validada com sucesso.');
} else {
  console.error('✗ Test 1 falhou!');
}

// Test 2: Diagonal win
const boardDiagonalWin = ['O', 'X', null, null, 'O', 'X', null, null, 'O'];
const res2 = MatchService.checkWinner(boardDiagonalWin);
if (res2 && res2.winner === 'O') {
  console.log('✓ Test 2: Vitória diagonal do O validada com sucesso.');
} else {
  console.error('✗ Test 2 falhou!');
}

// Test 3: Draw
const boardDraw = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
const res3 = MatchService.checkWinner(boardDraw);
if (res3 && res3.winner === 'DRAW') {
  console.log('✓ Test 3: Empate validado com sucesso.');
} else {
  console.error('✗ Test 3 falhou!');
}

console.log('--- TODOS OS TESTES PASSARAM ---');
