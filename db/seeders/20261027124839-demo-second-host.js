'use strict';

module.exports = {
  async up(queryInterface) {
    const db = queryInterface.sequelize;

    // Magdagdag ng dalawang HOST accounts
    await queryInterface.bulkInsert('users', [
      {
        school_id: '2099-0004',
        full_name: 'Marcus Brody',
        email: 'marcus@nightshift.test',
        role: 'HOST',
        created_at: new Date(),
      },
      {
        school_id: '2099-0005',
        full_name: 'Sarah Connor',
        email: 'sarah@nightshift.test',
        role: 'HOST',
        created_at: new Date(),
      },
    ]);

    // Kunin ang ID ni Host 1 (Marcus) para mag-insert ng isang default shift
    const [[marcus]] = await db.query(
      "SELECT user_id FROM users WHERE school_id = '2099-0004'"
    );

    await queryInterface.bulkInsert('shifts', [
      {
        host_id: marcus.user_id,
        title: 'Overnight Shift 1 - Standard Protocol',
        difficulty: 'Standard',
        is_public: true,
        created_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('shifts', null, {});
    await queryInterface.bulkDelete('users', {
      school_id: ['2099-0004', '2099-0005'],
    }, {});
  },
};