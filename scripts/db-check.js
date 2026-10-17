'use strict';

const { sequelize } = require('../src/models');

async function checkDatabase() {
  try {
    await sequelize.authenticate();

    const expected = {
      users: 4,
      game_sessions: 3,
      nights: 3,
      camera_event_logs: 3,
      scores: 3,
    };

    const tables = Object.keys(expected);
    const results = [];

    for (const table of tables) {
      const [[{ count }]] = await sequelize.query(`SELECT COUNT(*) FROM "${table}"`);
      const actual = Number(count);
      results.push({
        table,
        expected: expected[table],
        actual,
        ok: actual === expected[table] ? 'yes' : 'no',
      });
    }

    console.table(results);

    const [leaderboard] = await sequelize.query(`
      SELECT u.school_id, u.full_name, s.best_night_reached, s.total_survival_time
      FROM scores s
      JOIN users u ON u.user_id = s.user_id
      ORDER BY s.best_night_reached DESC, s.total_survival_time DESC
    `);

    console.log('\nNightShift.exe - Tournament Leaderboard:');
    console.table(leaderboard);

    const allPassed = results.every((r) => r.ok === 'yes');
    if (allPassed) {
      console.log('DB CHECK PASSED\n');
      process.exit(0);
    } else {
      console.error('DB CHECK FAILED: Row counts do not match.\n');
      process.exit(1);
    }
  } catch (error) {
    console.error('Database connection error during check:', error);
    process.exit(1);
  }
}

checkDatabase();