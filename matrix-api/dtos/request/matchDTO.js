import { z } from 'zod';

export const createMatchRequestDTO = z.object({
  userId: z.union([z.string(), z.number()]).optional(),
  username: z.string().optional()
}).optional().default({});

export const joinMatchRequestDTO = z.object({
  userId: z.union([z.string(), z.number()]).optional(),
  username: z.string().optional()
}).optional().default({});

export const makeMoveRequestDTO = z.object({
  moveIndex: z.coerce
    .number({ required_error: 'moveIndex é obrigatório' })
    .int('moveIndex deve ser um número inteiro')
    .min(0, 'Índice mínimo é 0')
    .max(8, 'Índice máximo é 8'),
  userId: z.union([z.string(), z.number()]).optional()
});

export const matchIdParamDTO = z.object({
  matchId: z.string({ required_error: 'matchId é obrigatório' }).min(1, 'matchId não pode ser vazio')
});

// Retrocompatibilidade de nomes
export const makeMoveDTO = makeMoveRequestDTO;
export const joinMatchDTO = joinMatchRequestDTO;

export default {
  createMatchRequestDTO,
  joinMatchRequestDTO,
  makeMoveRequestDTO,
  matchIdParamDTO,
  makeMoveDTO,
  joinMatchDTO
};
