'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('attendance', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },

      // =========================
      // USER
      // =========================
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      // =========================
      // SHIFT
      // =========================
      shift_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'shift',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },

      // =========================
      // WORK DATE
      // PENTING UNTUK SHIFT MALAM
      // =========================
      workDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },

      // =========================
      // CHECK IN / OUT
      // =========================
      checkIn: {
        type: Sequelize.DATE,
        allowNull: true
      },

      checkOut: {
        type: Sequelize.DATE,
        allowNull: true
      },

      // =========================
      // LOCATION CHECK IN
      // =========================
      latitude_checkIn: {
        type: Sequelize.FLOAT,
        allowNull: true
      },

      longitude_checkIn: {
        type: Sequelize.FLOAT,
        allowNull: true
      },

      // =========================
      // LOCATION CHECK OUT
      // =========================
      latitude_checkOut: {
        type: Sequelize.FLOAT,
        allowNull: true
      },

      longitude_checkOut: {
        type: Sequelize.FLOAT,
        allowNull: true
      },

      // =========================
      // ATTENDANCE STATUS
      // =========================
      status: {
        type: Sequelize.ENUM(
          'Present',
          'Late',
          'Absent',
          'Leave',
          'Off',
          'Half Day',
          'Overtime'
        ),
        allowNull: false,
        defaultValue: 'Present'
      },

      // =========================
      // TIME CALCULATIONS
      // =========================
      lateMinutes: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },

      earlyLeaveMinutes: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },

      overtimeMinutes: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },

      workHours: {
        type: Sequelize.FLOAT,
        defaultValue: 0
      },

      // =========================
      // FACE AI / BIOMETRIC
      // =========================
      faceVerifiedCheckIn: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },

      faceVerifiedCheckOut: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },

      // =========================
      // DEVICE INFO
      // =========================
      checkInDevice: {
        type: Sequelize.STRING,
        allowNull: true
      },

      checkOutDevice: {
        type: Sequelize.STRING,
        allowNull: true
      },

      ipAddressCheckIn: {
        type: Sequelize.STRING,
        allowNull: true
      },

      ipAddressCheckOut: {
        type: Sequelize.STRING,
        allowNull: true
      },

      // =========================
      // APPROVAL
      // =========================
      isApproved: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },

      approvedBy: {
        type: Sequelize.UUID,
        allowNull: true
      },

      approvedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },

      // =========================
      // NOTES
      // =========================
      note: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      rejectionReason: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      // =========================
      // SYSTEM FLAGS
      // =========================
      isManualEntry: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },

      isAutoCheckout: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },

      // =========================
      // TIMESTAMP
      // =========================
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      }
    });

    // =========================
    // UNIQUE CONSTRAINT
    // 1 USER 1 SHIFT 1 DAY
    // =========================
    await queryInterface.addConstraint('attendance', {
      fields: ['user_id', 'shift_id', 'workDate'],
      type: 'unique',
      name: 'unique_user_shift_workdate'
    });

    // =========================
    // INDEXES
    // =========================
    await queryInterface.addIndex('attendance', ['user_id']);

    await queryInterface.addIndex('attendance', ['shift_id']);

    await queryInterface.addIndex('attendance', ['workDate']);

    await queryInterface.addIndex('attendance', ['status']);
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.removeConstraint(
      'attendance',
      'unique_user_shift_workdate'
    );

    await queryInterface.dropTable('attendance');

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_attendance_status";'
    );
  }
};