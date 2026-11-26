'use strict';

module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'GameSession',
    {
      session_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      host_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      shift_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      join_pin: {
        type: DataTypes.CHAR(6),
        allowNull: true,
        unique: true,
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'LOBBY',
      },
      max_players: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10,
      },
      current_position: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      started_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'start_time',
      },
      ended_at: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'end_time',
      },
    },
    {
      tableName: 'game_sessions',
      timestamps: false,
    }
  );