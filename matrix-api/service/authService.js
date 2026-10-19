import { UserRepository } from '../repository/userRepository.js';
import { hashPassword, comparePassword } from '../config/utils/password.js';
import { generateToken } from '../config/utils/jwt.js';
import { ConflictException, UnauthorizedException, NotFoundException } from '../config/exceptions/index.js';

export const AuthService = {
  async register({ username, password }) {
    const existing = await UserRepository.findByUsername(username);
    if (existing) {
      throw new ConflictException('Nome de usuário já cadastrado');
    }

    const hashedPassword = await hashPassword(password);
    const user = await UserRepository.create({
      username,
      password: hashedPassword,
      status: 'online'
    });

    const token = generateToken({ id: user.id, username: user.username });
    return { user, token };
  },

  async login({ username, password }) {
    const user = await UserRepository.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    await UserRepository.update(user.id, { status: 'online' });

    const token = generateToken({ id: user.id, username: user.username });
    return { user: { ...user, status: 'online' }, token };
  },

  async getMe(id) {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }
};

export default AuthService;
