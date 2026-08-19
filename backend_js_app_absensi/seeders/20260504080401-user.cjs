'use strict';
const bcrypt = require('bcrypt')

// UUID STATIS -> direferensikan oleh user_profile
const USER_ADMIN = '3de1607d-9b4b-4ff4-b316-687724de52c0';
const USER_IT = '1016ef79-a8c7-4a29-b347-26414894524e';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const password = bcrypt.hashSync('123456', 10);
    await queryInterface.bulkInsert('user', [
      {
        id: USER_ADMIN,
        username: 'admin',
        password,
        role: 'admin',
        isActive: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: USER_IT,
        username: 'it',
        password,
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