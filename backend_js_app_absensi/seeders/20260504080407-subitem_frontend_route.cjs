'use strict';

// child_of_frontend_route_id -> frontend_route "Master" (UUID STATIS)
const FR_MASTER = 'e23bb046-1017-4020-8cee-fc983eaec257';
// SI_BRANCH direferensikan oleh subitem_frontend_backend
const SI_BRANCH = 'c1022166-1439-427d-9661-72560c9a86bb';
const SI_SHIFT = '59c51681-8b36-4130-bd9a-5e86353fd3ce';
const SI_DEPARTMENT = '20b23fdf-fe38-4ffa-9ad8-343dc23eb0db';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('subitem_frontend_route', [
      { id: SI_BRANCH,     name: "Branch",     child_of_frontend_route_id: FR_MASTER, path: "/branch",     createdAt: now, updatedAt: now },
      { id: SI_SHIFT,      name: "Shift",      child_of_frontend_route_id: FR_MASTER, path: "/shift",      createdAt: now, updatedAt: now },
      { id: SI_DEPARTMENT, name: "Department", child_of_frontend_route_id: FR_MASTER, path: "/department", createdAt: now, updatedAt: now },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('subitem_frontend_route', {});
  }
};
