'use strict';

// UUID STATIS -> direferensikan oleh user_profile & access_route_department
const DEPT_ADMIN = 'f830a281-1fa0-4382-8a61-477296ac5444';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('department', [{
        id: DEPT_ADMIN,
        name: 'ADMIN',
        code: 'ADMIN-001',
        isActive: true,
        createdAt: now,
        updatedAt: now
      }
    ], {});

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('department', {});
  }
};
