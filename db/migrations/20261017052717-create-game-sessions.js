'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('game_sessions', {
      session_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
      night_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      start_time: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
      end_time: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      result: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'running',
      },
    });

    await queryInterface.addConstraint('game_sessions', {
      fields: ['result'],
      type: 'check',
      name: 'ck_game_sessions_result',
      where: {
        result: ['running', 'survived', 'jumpscared'],
      },
    });

    // Design Change Notice 01: 2-column unique constraint
    await queryInterface.addConstraint('game_sessions', {
      fields: ['session_id', 'user_id'],
      type: 'unique',
      name: 'uq_one_seat',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('game_sessions');
  },
};