import { z } from 'zod';

export const userIdParamDTO = z.object({
  id: z.string({ required_error: 'ID do usuário é obrigatório' }).min(1, 'ID não pode ser vazio')
});

export default {
  userIdParamDTO
};
