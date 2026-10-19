import { z } from 'zod';

export const playerResponseDTO = z.object({
  id: z.union([z.string(), z.number()]),
  username: z.string(),
  symbol: z.string()
}).strip();

export const matchResponseDTO = z.object({
  id: z.string(),
  players: z.array(playerResponseDTO).optional().default([]),
  board: z.array(z.union([z.string(), z.null()])).default([]),
  currentTurn: z.string().default('X'),
  status: z.string().default('waiting'),
  winner: z.union([z.string(), z.number(), z.null()]).optional(),
  winningLine: z.array(z.number()).nullable().optional(),
  scoreX: z.number().default(0),
  scoreO: z.number().default(0),
  roundsPlayed: z.number().default(0),
  rematchRequestedBy: z.union([z.string(), z.number(), z.null()]).optional(),
  createdAt: z.union([z.date(), z.string()]).optional(),
  endedAt: z.union([z.date(), z.string(), z.null()]).optional()
}).strip();

export const matchListResponseDTO = z.array(matchResponseDTO);

export default {
  playerResponseDTO,
  matchResponseDTO,
  matchListResponseDTO
};
