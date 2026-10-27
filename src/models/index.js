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

// Associations (ERD Relationships)
User.hasMany(Shift, { foreignKey: 'host_id' });
Shift.belongsTo(User, { foreignKey: 'host_id', as: 'host' });

module.exports = {
  sequelize,
  Sequelize,
  DataTypes,
  User,
  Shift,
};