'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const env = require('../config/env');
const dbConfig = require('../config/database')[env.nodeEnv];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

// Models
const User = require('./user')(sequelize, DataTypes);
const Shift = require('./shift')(sequelize, DataTypes);
const GameSession = require('./game-session')(sequelize, DataTypes);
const Player = require('./player')(sequelize, DataTypes);

// Associations (ERD Relationships)
User.hasMany(Shift, { foreignKey: 'host_id' });
Shift.belongsTo(User, { foreignKey: 'host_id', as: 'host' });

GameSession.hasMany(Player, { foreignKey: 'session_id' });
Player.belongsTo(GameSession, { foreignKey: 'session_id' });

GameSession.belongsTo(User, { foreignKey: 'host_id', as: 'host' });
User.hasMany(GameSession, { foreignKey: 'host_id' });

Player.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Player, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  Sequelize,
  DataTypes,
  User,
  Shift,
  GameSession,
  Player,
};