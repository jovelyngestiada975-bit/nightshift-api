'use strict';

module.exports = {
  async up(queryInterface) {
    const db = queryInterface.sequelize;

    // 1. Users (Fictitious 2099-xxxx IDs at .test emails ayon sa RA 10173 policy)
    await queryInterface.bulkInsert('users', [
      {
        school_id: '2099-0001',
        full_name: 'Alex Vance',
        email: 'alex@nightshift.test',
        role: 'PLAYER',
        created_at: new Date(),
      },
      {
        school_id: '2099-0002',
        full_name: 'Beatrix Kiddo',
        email: 'beatrix@nightshift.test',
        role: 'PLAYER',
        created_at: new Date(),
      },
      {
        school_id: '2099-9001',
        full_name: 'Admin Supervisor',
        email: 'admin@nightshift.test',
        role: 'ADMIN',
        created_at: new Date(),
      },
    ]);

    // Kunin ang auto-generated user_id mula sa database (Never hardcode IDs!)
    const [[alex]] = await db.query(
      "SELECT user_id FROM users WHERE school_id = '2099-0001'"
    );
    const [[beatrix]] = await db.query(
      "SELECT user_id FROM users WHERE school_id = '2099-0002'"
    );

    // 2. Game Sessions
    await queryInterface.bulkInsert('game_sessions', [
      {
        user_id: alex.user_id,
        night_number: 1,
        start_time: new Date('2026-10-10T00:00:00Z'),
        end_time: new Date('2026-10-10T00:06:00Z'),
        result: 'survived',
      },
      {
        user_id: beatrix.user_id,
        night_number: 2,
        start_time: new Date('2026-10-10T01:00:00Z'),
        end_time: new Date('2026-10-10T01:03:42Z'),
        result: 'jumpscared', // Awkward case: namatay sa gitna ng night
      },
    ]);

    const [[sessionAlex]] = await db.query(
      `SELECT session_id FROM game_sessions WHERE user_id = ${alex.user_id} AND result = 'survived'`
    );
    const [[sessionBeatrix]] = await db.query(
      `SELECT session_id FROM game_sessions WHERE user_id = ${beatrix.user_id} AND result = 'jumpscared'`
    );

    // 3. Nights
    await queryInterface.bulkInsert('nights', [
      {
        session_id: sessionAlex.session_id,
        difficulty_level: 1,
        route_taken: 'A',
        hazards_triggered: 'none',
      },
      {
        session_id: sessionBeatrix.session_id,
        difficulty_level: 2,
        route_taken: 'C',
        hazards_triggered: 'generator_offline,cam_8_corrupted',
      },
    ]);

    // 4. Camera Event Logs
    await queryInterface.bulkInsert('camera_event_logs', [
      {
        session_id: sessionAlex.session_id,
        camera_id: 1,
        event_type: 'viewed',
        timestamp: new Date('2026-10-10T00:01:10Z'),
      },
      {
        session_id: sessionAlex.session_id,
        camera_id: 5,
        event_type: 'viewed',
        timestamp: new Date('2026-10-10T00:02:15Z'),
      },
      {
        session_id: sessionBeatrix.session_id,
        camera_id: 8,
        event_type: 'corrupted',
        timestamp: new Date('2026-10-10T01:02:00Z'),
      },
      {
        session_id: sessionBeatrix.session_id,
        camera_id: 8,
        event_type: 'fixed',
        timestamp: new Date('2026-10-10T01:02:45Z'),
      },
    ]);

    // 5. Scores
    await queryInterface.bulkInsert('scores', [
      {
        user_id: alex.user_id,
        best_night_reached: 1,
        total_survival_time: 360,
      },
      {
        user_id: beatrix.user_id,
        best_night_reached: 1,
        total_survival_time: 222,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('scores', null, {});
    await queryInterface.bulkDelete('camera_event_logs', null, {});
    await queryInterface.bulkDelete('nights', null, {});
    await queryInterface.bulkDelete('game_sessions', null, {});
    await queryInterface.bulkDelete('users', null, {});
  },
};