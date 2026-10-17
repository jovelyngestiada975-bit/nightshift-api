'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('camera_event_logs', {
      log_id: {
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
      camera_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      event_type: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
    });

    await queryInterface.addConstraint('camera_event_logs', {
      fields: ['camera_id'],
      type: 'check',
      name: 'ck_camera_id_range',
      where: {
        camera_id: {
          [Sequelize.Op.between]: [1, 12],
        },
      },
    });

    await queryInterface.addConstraint('camera_event_logs', {
      fields: ['event_type'],
      type: 'check',
      name: 'ck_event_type_valid',
      where: {
        event_type: ['viewed', 'corrupted', 'fixed'],
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('camera_event_logs');
  },
};