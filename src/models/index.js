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

// I-load ang User model mula sa Week 11 Kit
const User = require('./user')(sequelize, DataTypes);

module.exports = {
  sequelize,
  Sequelize,
  DataTypes,
  User,
};