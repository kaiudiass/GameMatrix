export const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

export const MATCH_STATUS = {
  WAITING: 'waiting',
  IN_PROGRESS: 'in_progress',
  FINISHED: 'finished',
  DRAW: 'draw'
};

export const PLAYER_SYMBOLS = {
  X: 'X',
  O: 'O'
};

export default {
  WINNING_COMBINATIONS,
  MATCH_STATUS,
  PLAYER_SYMBOLS
};
