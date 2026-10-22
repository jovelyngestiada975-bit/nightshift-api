'use strict';

module.exports = {
  async up(queryInterface) {
    const db = queryInterface.sequelize;

    // 1. Users
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
        school_id: '2099-0003',
        full_name: 'Charlie Brown',
        email: 'charlie@nightshift.test',
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

    const [[alex]] = await db.query("SELECT user_id FROM users WHERE school_id = '2099-0001'");
    const [[beatrix]] = await db.query("SELECT user_id FROM users WHERE school_id = '2099-0002'");
    const [[charlie]] = await db.query("SELECT user_id FROM users WHERE school_id = '2099-0003'");

    // 2. Game Sessions - 3 players in SHIFT-1 (Tournament Shift)
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
        night_number: 1,
        start_time: new Date('2026-10-10T00:00:00Z'),
        end_time: new Date('2026-10-10T00:05:30Z'),
        result: 'jumpscared',
      },
      {
        user_id: charlie.user_id,
        night_number: 1,
        start_time: new Date('2026-10-10T00:00:00Z'),
        end_time: new Date('2026-10-10T00:04:15Z'),
        result: 'jumpscared',
      },
    ]);

    const [[sessionAlex]] = await db.query(`SELECT session_id FROM game_sessions WHERE user_id = ${alex.user_id}`);
    const [[sessionBeatrix]] = await db.query(`SELECT session_id FROM game_sessions WHERE user_id = ${beatrix.user_id}`);
    const [[sessionCharlie]] = await db.query(`SELECT session_id FROM game_sessions WHERE user_id = ${charlie.user_id}`);

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
        difficulty_level: 1,
        route_taken: 'C',
        hazards_triggered: 'generator_offline',
      },
      {
        session_id: sessionCharlie.session_id,
        difficulty_level: 1,
        route_taken: 'B',
        hazards_triggered: 'cam_8_corrupted',
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
        session_id: sessionBeatrix.session_id,
        camera_id: 8,
        event_type: 'corrupted',
        timestamp: new Date('2026-10-10T00:02:00Z'),
      },
      {
        session_id: sessionCharlie.session_id,
        camera_id: 5,
        event_type: 'fixed',
        timestamp: new Date('2026-10-10T00:03:00Z'),
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
        total_survival_time: 330,
      },
      {
        user_id: charlie.user_id,
        best_night_reached: 1,
        total_survival_time: 255,
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