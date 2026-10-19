import { User } from './User.js';
import { Match } from './Match.js';

// Setup associations
Match.belongsTo(User, { as: 'playerX', foreignKey: 'playerXId' });
Match.belongsTo(User, { as: 'playerO', foreignKey: 'playerOId' });
Match.belongsTo(User, { as: 'winner', foreignKey: 'winnerId' });

User.hasMany(Match, { as: 'matchesAsX', foreignKey: 'playerXId' });
User.hasMany(Match, { as: 'matchesAsO', foreignKey: 'playerOId' });

export {
  User,
  Match
};

export default {
  User,
  Match
};
