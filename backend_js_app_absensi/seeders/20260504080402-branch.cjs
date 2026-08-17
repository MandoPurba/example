'use strict';
const {
  v4: uuidv4
} = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.bulkInsert('branch', [{
        id: uuidv4(),
        name: 'Jakarta Branch',
        code: 'JKT001',
        city: 'Jakarta',
        address: 'jl. Sudirman No. 1, Jakarta',
        radius: 100,
        longitude: 98.65418583379336,
        latitude: 3.5978979407269174,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Bandung Branch',
        code: 'BDG001',
        city: 'Bandung',
        address: 'jl. Asia Afrika No. 1, Bandung',
        radius: 100,
        longitude: 98.65418583379336,
        latitude: 3.5978979407269174,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Medan Branch',
        code: 'MDN001',
        city: 'Medan',
        address: 'jl. Merdeka No. 1, Medan',
        radius: 100,
        longitude: 98.65418583379336,
        latitude: 3.5978979407269174,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('branch', {});
  }
};