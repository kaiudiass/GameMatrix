export const MOCK_USERS = [
  { id: 'u1', username: 'user_neo', status: 'online', elo: 1480 },
  { id: 'u2', username: 'user_cipher', status: 'online', elo: 1220 },
  { id: 'u3', username: 'user_trinity', status: 'busy', elo: 1550 },
];

export const MOCK_MATCH = {
  id: '0x9F4',
  players: [
    { id: 'me', username: 'VOCÊ', symbol: 'X' },
    { id: 'u4', username: 'ENIO', symbol: 'O' }
  ],
  board: Array(9).fill(null),
  currentTurn: 'X'
};
