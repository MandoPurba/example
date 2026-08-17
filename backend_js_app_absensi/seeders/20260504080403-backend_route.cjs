'use strict';

// UUID STATIS -> direferensikan oleh frontend_backend & subitem_frontend_backend
const BR_ACCESS = 'a26ca907-a816-4592-a153-02a5ebd3a75e';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('backend_route', [
      {
        id: BR_ACCESS,
        name: "Access Routes",
        path: "/access-routes",
        method: "GET",
        createdAt: now,
        updatedAt: now
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('backend_route', {});
  }
};
