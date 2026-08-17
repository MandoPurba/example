'use strict';

// Referensi UUID STATIS (harus sama dgn seeder frontend_route & backend_route)
const FR_ACCESS = 'a491bda1-5869-4012-92d2-c276fc2ec912'; // frontend_route "/access-route"
const BR_ACCESS = 'a26ca907-a816-4592-a153-02a5ebd3a75e'; // backend_route "/access-routes"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('frontend_backend', [
      {
        id: '9a72db3a-ccd1-4d45-bb49-bc96a9577717',
        backend_route_id: BR_ACCESS,
        frontend_route_id: FR_ACCESS,
        createdAt: now,
        updatedAt: now
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('frontend_backend', {});
  }
};
