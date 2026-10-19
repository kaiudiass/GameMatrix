import { User } from './models/User.js';

// Memória de fallback caso o banco não esteja rodando localmente
const memoryUsers = new Map();

export const UserRepository = {
  async findByUsername(username) {
    try {
      const user = await User.findOne({ where: { username } });
      if (user) return user.get({ plain: true });
    } catch (err) {
      console.warn('[UserRepository] Aviso no banco em findByUsername:', err.message);
    }
    return memoryUsers.get(username) || null;
  },

  async findById(id) {
    try {
      const user = await User.findByPk(id);
      if (user) return user.get({ plain: true });
    } catch (err) {
      console.warn('[UserRepository] Aviso no banco em findById:', err.message);
    }
    for (const u of memoryUsers.values()) {
      if (String(u.id) === String(id)) return u;
    }
    return null;
  },

  async create(userData) {
    try {
      const user = await User.create(userData);
      const plain = user.get({ plain: true });
      memoryUsers.set(plain.username, plain);
      return plain;
    } catch (err) {
      console.warn('[UserRepository] Aviso no banco em create:', err.message);
      const id = memoryUsers.size + 1;
      const fallbackUser = {
        id,
        username: userData.username,
        password: userData.password,
        status: userData.status || 'offline',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memoryUsers.set(fallbackUser.username, fallbackUser);
      return fallbackUser;
    }
  },

  async update(id, fields) {
    try {
      await User.update(fields, { where: { id } });
    } catch (err) {
      console.warn('[UserRepository] Aviso no banco em update:', err.message);
    }

    for (const [key, u] of memoryUsers.entries()) {
      if (String(u.id) === String(id)) {
        memoryUsers.set(key, { ...u, ...fields, updatedAt: new Date() });
      }
    }
    return true;
  },

  async findAll(limit = 50) {
    try {
      const users = await User.findAll({
        attributes: ['id', 'username', 'status', 'created_at'],
        order: [['created_at', 'DESC']],
        limit
      });
      if (users.length > 0) {
        return users.map((u) => u.get({ plain: true }));
      }
    } catch (err) {
      console.warn('[UserRepository] Aviso no banco em findAll:', err.message);
    }

    if (memoryUsers.size > 0) {
      return Array.from(memoryUsers.values()).map(({ password, ...u }) => u);
    }

    // Usuários padrão para desenvolvimento
    return [
      { id: 1, username: 'neo', status: 'online' },
      { id: 2, username: 'cipher', status: 'online' },
      { id: 3, username: 'trinity', status: 'busy' },
      { id: 4, username: 'morpheus', status: 'online' }
    ];
  }
};

export default UserRepository;
