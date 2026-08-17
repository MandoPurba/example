'use strict';

// UUID STATIS -> direferensikan oleh user_profile
const SHIFT_PAGI = '4e5c2047-ffdb-411c-85bd-4178651e730b';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('shift', [{
      id: SHIFT_PAGI,
      name: 'Shift Pagi',
      code: 'SHIFT-PAGI',
      startTime: '08:00:00',
      endTime: '17:00:00',
      crossDay: false,
      graceMinutes: 15,
      description: 'Shift default 08:00 - 17:00',
      createdAt: now,
      updatedAt: now
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('shift', {});
  }
};
