'use strict';

module.exports = {
  async up(queryInterface) {
    const db = queryInterface.sequelize;

    // Kunin ang mga IDs
    const [[alex]] = await db.query("SELECT user_id FROM users WHERE school_id = '2099-0001'");
    const [[beatrix]] = await db.query("SELECT user_id FROM users WHERE school_id = '2099-0002'");
    const [[charlie]] = await db.query("SELECT user_id FROM users WHERE school_id = '2099-0003'");

    const [[session]] = await db.query("SELECT session_id FROM game_sessions LIMIT 1");

    if (session && alex && beatrix && charlie) {
      await queryInterface.bulkInsert('players', [
        {
          session_id: session.session_id,
          user_id: alex.user_id,
          nickname: 'Alex',
          score: 360,
          last_seen_at: new Date(),
        },
        {
          session_id: session.session_id,
          user_id: beatrix.user_id,
          nickname: 'Beatrix',
          score: 330,
          last_seen_at: new Date(),
        },
        {
          session_id: session.session_id,
          user_id: charlie.user_id,
          nickname: 'Charlie',
          score: 255,
          last_seen_at: new Date(),
        },
      ]);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('players', null, {});
  },
};