import { UserService } from '../service/userService.js';
import { userResponseDTO, userListResponseDTO } from '../dtos/response/userDTO.js';

export const UserController = {
  async getUsers(req, res, next) {
    try {
      const users = await UserService.getAllUsers();
      const responseData = userListResponseDTO.parse(users);
      res.status(200).json({
        success: true,
        data: responseData
      });
    } catch (error) {
      next(error);
    }
  },

  async getUserById(req, res, next) {
    try {
      const user = await UserService.getUserById(req.params.id);
      const responseData = userResponseDTO.parse(user);
      res.status(200).json({
        success: true,
        data: responseData
      });
    } catch (error) {
      next(error);
    }
  }
};

export default UserController;
