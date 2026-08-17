'use strict';

// Referensi UUID STATIS
const BR_ACCESS = 'a26ca907-a816-4592-a153-02a5ebd3a75e'; // backend_route "/access-routes"
const SI_BRANCH = 'c1022166-1439-427d-9661-72560c9a86bb'; // subitem_frontend_route "Branch"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('subitem_frontend_backend', [
      {
        id: '5fff8c68-ba78-492d-91a3-48e950a6c44a',
        backend_route_id: BR_ACCESS,
        subitem_frontend_route_id: SI_BRANCH,
        createdAt: now,
        updatedAt: now
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('subitem_frontend_backend', {});
  }
};
