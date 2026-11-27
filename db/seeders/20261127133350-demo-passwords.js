'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const hash = await bcrypt.hash('NightShift.exe-2026', 10);
    await queryInterface.bulkUpdate(
      'users',
      { password_hash: hash },
      { password_hash: null }
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkUpdate('users', { password_hash: null }, {});
  },
};