import { z } from 'zod';

export const registerRequestDTO = z.object({
  username: z
    .string({ required_error: 'Username é obrigatório' })
    .min(3, 'Username deve conter ao menos 3 caracteres')
    .max(30, 'Username pode conter no máximo 30 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username deve conter apenas letras, números e sublinhados'),
  password: z
    .string({ required_error: 'Senha é obrigatória' })
    .min(4, 'Senha deve ter no mínimo 4 caracteres')
});

export const loginRequestDTO = z.object({
  username: z
    .string({ required_error: 'Username é obrigatório' })
    .min(1, 'Username não pode ser vazio'),
  password: z
    .string({ required_error: 'Senha é obrigatória' })
    .min(1, 'Senha não pode ser vazia')
});

// Retrocompatibilidade de nomes
export const registerDTO = registerRequestDTO;
export const loginDTO = loginRequestDTO;

export default {
  registerRequestDTO,
  loginRequestDTO,
  registerDTO,
  loginDTO
};
