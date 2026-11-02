'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inspection_logs', {
      inspection_id: {
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
      task_type: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(12),
        allowNull: false,
      },
      wrong_attempts: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      penalty_points: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      issued_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
      completed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Check constraint para sa status: complete o incomplete lang
    await queryInterface.addConstraint('inspection_logs', {
      fields: ['status'],
      type: 'check',
      name: 'ck_inspection_logs_status',
      where: {
        status: ['complete', 'incomplete'],
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('inspection_logs');
  },
};