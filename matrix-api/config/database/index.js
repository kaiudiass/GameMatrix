import { sequelize } from './sequelize.js';
import '../../repository/models/index.js'; // Ensure models and associations are registered

export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('[PostgreSQL/Sequelize] Conexão estabelecida com sucesso.');
    
    // Auto-sync tables in development
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('[PostgreSQL/Sequelize] Modelos sincronizados com o banco de dados.');
    return true;
  } catch (error) {
    console.warn('[PostgreSQL/Sequelize] Aviso: Não foi possível conectar ao PostgreSQL.');
    console.warn(`[PostgreSQL/Sequelize] Motivo: ${error.message}`);
    console.warn('[PostgreSQL/Sequelize] A API continuará em execução com fallback resiliente.');
    return false;
  }
};

export { sequelize };
export default {
  sequelize,
  connectDatabase
};
