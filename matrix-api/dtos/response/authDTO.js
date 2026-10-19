import { z } from 'zod';
import { userResponseDTO } from './userDTO.js';

export const authResponseDTO = z.object({
  user: userResponseDTO,
  token: z.string()
}).strip();

export { userResponseDTO };

export default {
  authResponseDTO,
  userResponseDTO
};
