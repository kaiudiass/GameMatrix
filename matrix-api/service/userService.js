import { UserRepository } from '../repository/userRepository.js';
import { NotFoundException } from '../config/exceptions/index.js';

export const UserService = {
  async getAllUsers() {
    return UserRepository.findAll();
  },

  async getUserById(id) {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  },

  async setStatus(id, status) {
    return UserRepository.update(id, { status });
  }
};

export default UserService;
