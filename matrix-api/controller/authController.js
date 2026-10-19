import { AuthService } from '../service/authService.js';
import { authResponseDTO } from '../dtos/response/authDTO.js';
import { userResponseDTO } from '../dtos/response/userDTO.js';

export const AuthController = {
  async register(req, res, next) {
    try {
      const data = await AuthService.register(req.body);
      const responseData = authResponseDTO.parse(data);

      res.status(201).json({
        success: true,
        message: 'Usuário registrado com sucesso',
        data: responseData
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const data = await AuthService.login(req.body);
      const responseData = authResponseDTO.parse(data);

      res.status(200).json({
        success: true,
        message: 'Acesso concedido ao sistema',
        data: responseData
      });
    } catch (error) {
      next(error);
    }
  },

  async me(req, res, next) {
    try {
      const user = await AuthService.getMe(req.user.id);
      const responseData = userResponseDTO.parse(user);

      res.status(200).json({
        success: true,
        user: responseData,
        data: responseData
      });
    } catch (error) {
      next(error);
    }
  }
};

export default AuthController;
