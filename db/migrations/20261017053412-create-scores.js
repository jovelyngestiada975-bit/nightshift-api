'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('scores', {
      score_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'users',
          key: 'user_id',
        },
        onDelete: 'CASCADE',
      },
      best_night_reached: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      total_survival_time: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    });

    await queryInterface.addConstraint('scores', {
      fields: ['total_survival_time'],
      type: 'check',
      name: 'ck_scores_time_non_negative',
      where: {
        total_survival_time: {
          [Sequelize.Op.gte]: 0,
        },
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('scores');
  },
};