'use strict';
const { v4: uuidv4 } = require('uuid');
// Catatan: PK baris junction di bawah TIDAK direferensikan seeder lain,
// jadi aman memakai uuidv4(). Yang penting kolom FK (department_id,
// frontend_route_id, subitem_frontend_route_id) memakai UUID STATIS.

const DEPT_ADMIN = 'f830a281-1fa0-4382-8a61-477296ac5444';

// frontend_route (UUID STATIS, samakan dgn seeder frontend_route)
const FR = {
  HOME: 'a448724f-be62-48bf-bb26-2f83ee2545f0',
  DASHBOARD: '1bab0130-8cad-4834-a35b-17a708d46a4e',
  ABSENSI: 'a6d17d1c-829f-4928-a583-cdd856eb2783',
  REGISTER_FACE: 'f2d0d234-4eca-4a99-b5b7-a9f7da80f706',
  ATTENDANCE: '729eaeb7-18f4-4ffb-890d-c24e546c2b0a',
  HISTORY: 'b6267382-f232-4af1-bf44-4098064f0a75',
  EMPLOYEE: '783cb910-0441-4d86-b1c3-40e0473a6901',
  NOTIFICATION: '1d9eb12c-1ed4-481e-93da-ccdb9c3e3652',
  MESSAGE: '70868673-9ead-42f2-82f6-4603de088a92',
  USERS: '1b0e390e-e791-4d03-9950-da2c84b1e667',
  ACCESS: 'a491bda1-5869-4012-92d2-c276fc2ec912',
  PERMISSION: '9a8b6f39-5f30-4511-8821-812fdec659c9',
  ABSENSI_BULANAN: '90e0b423-9b6d-4635-8c0a-e039a938b93a',
};

// subitem_frontend_route (UUID STATIS) -> submenu "Master"
const SI = {
  BRANCH: 'c1022166-1439-427d-9661-72560c9a86bb',
  SHIFT: '59c51681-8b36-4130-bd9a-5e86353fd3ce',
  DEPARTMENT: '20b23fdf-fe38-4ffa-9ad8-343dc23eb0db',
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const topLevel = [
      FR.DASHBOARD, FR.HOME, FR.ABSENSI, FR.REGISTER_FACE, FR.ATTENDANCE,
      FR.HISTORY, FR.EMPLOYEE, FR.NOTIFICATION, FR.MESSAGE, FR.USERS,
      FR.ACCESS, FR.PERMISSION, FR.ABSENSI_BULANAN,
    ];
    const subItems = [SI.BRANCH, SI.SHIFT, SI.DEPARTMENT];

    const rows = [
      ...topLevel.map((frontend_route_id) => ({
        id: uuidv4(),
        department_id: DEPT_ADMIN,
        frontend_route_id,
        subitem_frontend_route_id: null,
        createdAt: now,
        updatedAt: now,
      })),
      ...subItems.map((subitem_frontend_route_id) => ({
        id: uuidv4(),
        department_id: DEPT_ADMIN,
        frontend_route_id: null,
        subitem_frontend_route_id,
        createdAt: now,
        updatedAt: now,
      })),
    ];

    await queryInterface.bulkInsert('access_route_department', rows, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('access_route_department', {});
  }
};
