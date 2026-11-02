'use strict';

module.exports = {
  async up(queryInterface) {
    const db = queryInterface.sequelize;

    // Kunin ang isang existing session ID
    const [[session]] = await db.query('SELECT session_id FROM game_sessions LIMIT 1');

    if (session) {
      await queryInterface.bulkInsert('inspection_logs', [
        {
          session_id: session.session_id,
          task_type: 'office',
          status: 'complete',
          wrong_attempts: 0,
          penalty_points: 0,
          issued_at: new Date('2026-10-10T00:01:00Z'),
          completed_at: new Date('2026-10-10T00:01:45Z'),
        },
        {
          session_id: session.session_id,
          task_type: 'hallway',
          status: 'complete',
          wrong_attempts: 1,
          penalty_points: 0,
          issued_at: new Date('2026-10-10T00:02:30Z'),
          completed_at: new Date('2026-10-10T00:03:15Z'),
        },
        {
          session_id: session.session_id,
          task_type: 'equipment',
          status: 'incomplete', 
          wrong_attempts: 2,
          penalty_points: 50,
          issued_at: new Date('2026-10-10T00:04:00Z'),
          completed_at: null,
        },
      ]);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('inspection_logs', null, {});
  },
};