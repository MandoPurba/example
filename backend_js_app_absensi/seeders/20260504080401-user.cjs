'use strict';
const bcrypt = require('bcrypt')

// UUID STATIS -> direferensikan oleh user_profile
const USER_ADMIN = '3de1607d-9b4b-4ff4-b316-687724de52c0';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('user', [
      {
      id: USER_ADMIN,
      username: 'admin',
      password: bcrypt.hashSync('123456', 10),
      role: 'admin',
      isActive: true,
      createdAt: now,
      updatedAt: now
    },
  ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user', {});
  }
};