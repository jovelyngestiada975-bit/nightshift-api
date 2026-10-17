'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('nights', {
      night_id: {
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
      difficulty_level: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      route_taken: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      hazards_triggered: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('nights');
  },
};