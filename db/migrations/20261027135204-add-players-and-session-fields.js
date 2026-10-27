'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Magdagdag ng fields sa game_sessions
    await queryInterface.addColumn('game_sessions', 'join_pin', {
      type: Sequelize.CHAR(6),
      allowNull: true,
      unique: true,
    });

    await queryInterface.addColumn('game_sessions', 'status', {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: 'LOBBY',
    });

    await queryInterface.addColumn('game_sessions', 'shift_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'shifts',
        key: 'shift_id',
      },
      onDelete: 'SET NULL',
    });

    await queryInterface.addColumn('game_sessions', 'host_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id',
      },
      onDelete: 'CASCADE',
    });

    await queryInterface.addColumn('game_sessions', 'max_players', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 10,
    });

    await queryInterface.addColumn('game_sessions', 'current_position', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    // 2. Gumawa ng players table para sa seats
    await queryInterface.createTable('players', {
      player_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      session_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'game_sessions',
          key: 'session_id',
        },
        onDelete: 'CASCADE',
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id',
        },
        onDelete: 'CASCADE',
      },
      nickname: {
        type: Sequelize.STRING(24),
        allowNull: false,
      },
      score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      last_seen_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
    });

    // Unique seat constraint
    await queryInterface.addConstraint('players', {
      fields: ['session_id', 'user_id'],
      type: 'unique',
      name: 'uq_player_session_user',
    });

    // Unique nickname constraint (Slide 27)
    await queryInterface.addConstraint('players', {
      fields: ['session_id', 'nickname'],
      type: 'unique',
      name: 'uq_player_nickname',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('players');
    await queryInterface.removeColumn('game_sessions', 'current_position');
    await queryInterface.removeColumn('game_sessions', 'max_players');
    await queryInterface.removeColumn('game_sessions', 'host_id');
    await queryInterface.removeColumn('game_sessions', 'shift_id');
    await queryInterface.removeColumn('game_sessions', 'status');
    await queryInterface.removeColumn('game_sessions', 'join_pin');
  },
};