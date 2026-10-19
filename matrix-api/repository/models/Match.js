import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database/sequelize.js';

export class Match extends Model {}

Match.init(
  {
    id: {
      type: DataTypes.STRING(64),
      primaryKey: true
    },
    playerXId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'player_x_id'
    },
    playerOId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'player_o_id'
    },
    winnerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'winner_id'
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: 'waiting' // waiting, in_progress, finished, draw
    },
    board: {
      type: DataTypes.JSON,
      defaultValue: [null, null, null, null, null, null, null, null, null]
    },
    currentTurn: {
      type: DataTypes.STRING(1),
      defaultValue: 'X',
      field: 'current_turn'
    },
    scoreX: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'score_x'
    },
    scoreO: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'score_o'
    },
    roundsPlayed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'rounds_played'
    },
    endedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'ended_at'
    }
  },
  {
    sequelize,
    modelName: 'Match',
    tableName: 'matches',
    timestamps: true,
    underscored: true
  }
);

export default Match;
