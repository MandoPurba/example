'use strict';

// =====================================================================
// UUID STATIS (jangan diubah bila sudah direferensikan seeder lain).
// Anchor yang dipakai seeder anak:
//   FR_MASTER  -> subitem_frontend_route.child_of_frontend_route_id
//   FR_ACCESS  -> frontend_backend.frontend_route_id
// =====================================================================
const FR_HOME = 'a448724f-be62-48bf-bb26-2f83ee2545f0';
const FR_DASHBOARD = '1bab0130-8cad-4834-a35b-17a708d46a4e';
const FR_ABSENSI = 'a6d17d1c-829f-4928-a583-cdd856eb2783';
const FR_REGISTER_FACE = 'f2d0d234-4eca-4a99-b5b7-a9f7da80f706';
const FR_MASTER = 'e23bb046-1017-4020-8cee-fc983eaec257';
const FR_ATTENDANCE = '729eaeb7-18f4-4ffb-890d-c24e546c2b0a';
const FR_HISTORY = 'b6267382-f232-4af1-bf44-4098064f0a75';
const FR_EMPLOYEE = '783cb910-0441-4d86-b1c3-40e0473a6901';
const FR_NOTIFICATION = '1d9eb12c-1ed4-481e-93da-ccdb9c3e3652';
const FR_MESSAGE = '70868673-9ead-42f2-82f6-4603de088a92';
const FR_USERS = '1b0e390e-e791-4d03-9950-da2c84b1e667';
const FR_ACCESS = 'a491bda1-5869-4012-92d2-c276fc2ec912';
const FR_PERMISSION = '9a8b6f39-5f30-4511-8821-812fdec659c9';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('frontend_route', [
      { id: FR_HOME,          name: "Home",            icon: "Home",     path: "/home",                          sort: 1,  createdAt: now, updatedAt: now },
      { id: FR_DASHBOARD,     name: "Admin Dashboard", icon: "Grid2x2",  path: "/",                              sort: 2,  createdAt: now, updatedAt: now },
      { id: FR_ABSENSI,       name: "Absensi",         icon: "Fingerprint", path: "/absensi",                    sort: 4,  createdAt: now, updatedAt: now },
      { id: FR_REGISTER_FACE, name: "Register Face",   icon: "ScanFace", path: "/bio-metrics/face-recognition",  sort: 5,  createdAt: now, updatedAt: now },
      { id: FR_MASTER,        name: "Master",          icon: "Box",      path: null,                             sort: 6,  createdAt: now, updatedAt: now },
      { id: FR_ATTENDANCE,    name: "Attendance",      icon: "BookText", path: "/attendance-user",               sort: 7,  createdAt: now, updatedAt: now },
      { id: FR_HISTORY,       name: "History Absensi", icon: "History",  path: "/attendance-history",            sort: 8,  createdAt: now, updatedAt: now },
      { id: FR_EMPLOYEE,      name: "Employee",        icon: "Mail",     path: "/employee",                      sort: 9,  createdAt: now, updatedAt: now },
      { id: FR_NOTIFICATION,  name: "Notification",    icon: "Bell",     path: "/notification",                  sort: 10, createdAt: now, updatedAt: now },
      { id: FR_MESSAGE,       name: "Message",         icon: "Send",     path: "/message",                       sort: 11, createdAt: now, updatedAt: now },
      { id: FR_USERS,         name: "Users",           icon: "User",     path: "/users",                         sort: 12, createdAt: now, updatedAt: now },
      { id: FR_ACCESS,        name: "Access Route",    icon: "ClosedCaption", path: "/access-route",             sort: 13, createdAt: now, updatedAt: now },
      { id: FR_PERMISSION,    name: "Permission",      icon: "NotebookPen",   path: "/home/permission",          sort: 14, createdAt: now, updatedAt: now },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('frontend_route', {});
  }
};
