'use strict';

// Referensi UUID STATIS
const USER_ADMIN = '3de1607d-9b4b-4ff4-b316-687724de52c0'; // user "admin"
const DEPT_ADMIN = 'f830a281-1fa0-4382-8a61-477296ac5444';    // department "IT"
const SHIFT_PAGI = '4e5c2047-ffdb-411c-85bd-4178651e730b'; // shift "Shift Pagi"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('user_profile', [{
      id: '52f6ca31-e003-4743-854c-f1b6ba686bd3',
      user_id: USER_ADMIN,
      shift_id: SHIFT_PAGI,
      department_id: DEPT_ADMIN,
      status: 'active',
      name: 'Administrator',
      email: 'admin@example.com',
      position: 'Administrator',
      createdAt: now,
      updatedAt: now
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_profile', {});
  }
};
