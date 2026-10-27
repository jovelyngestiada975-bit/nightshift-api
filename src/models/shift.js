'use strict';

module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Shift',
    {
      shift_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      host_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      difficulty: {
        type: DataTypes.STRING(60),
        allowNull: true,
        defaultValue: 'Standard',
      },
      is_public: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: 'shifts',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );