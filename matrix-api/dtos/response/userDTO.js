import { z } from 'zod';

export const userResponseDTO = z.object({
  id: z.union([z.string(), z.number()]),
  username: z.string(),
  status: z.string().default('online'),
  createdAt: z.union([z.date(), z.string()]).optional(),
  updatedAt: z.union([z.date(), z.string()]).optional()
}).strip();

export const userListResponseDTO = z.array(userResponseDTO);

export default {
  userResponseDTO,
  userListResponseDTO
};
