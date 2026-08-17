import { DataTypes } from 'sequelize';
import sequelize from '../src/db/sequelize.js';

const Attendance = sequelize.define('attendance', {

  // =========================
  // PRIMARY KEY
  // =========================
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  // =========================
  // USER
  // =========================
  user_id: {
    type: DataTypes.UUID,
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
    type: DataTypes.UUID,
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
    type: DataTypes.DATEONLY,
    allowNull: false,
  },

  // =========================
  // CHECK IN / OUT
  // =========================
  checkIn: {
    type: DataTypes.DATE,
    allowNull: true
  },

  checkOut: {
    type: DataTypes.DATE,
    allowNull: true
  },

  // =========================
  // LOCATION CHECK IN
  // =========================
  latitude_checkIn: {
    type: DataTypes.FLOAT,
    allowNull: true
  },

  longitude_checkIn: {
    type: DataTypes.FLOAT,
    allowNull: true
  },

  // =========================
  // LOCATION CHECK OUT
  // =========================
  latitude_checkOut: {
    type: DataTypes.FLOAT,
    allowNull: true
  },

  longitude_checkOut: {
    type: DataTypes.FLOAT,
    allowNull: true
  },

  // =========================
  // STATUS
  // =========================
  status: {
    type: DataTypes.ENUM(
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
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  earlyLeaveMinutes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  overtimeMinutes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  workHours: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },

  // =========================
  // FACE VERIFICATION
  // =========================
  faceVerifiedCheckIn: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  faceVerifiedCheckOut: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  // =========================
  // DEVICE INFO
  // =========================
  checkInDevice: {
    type: DataTypes.STRING,
    allowNull: true
  },

  checkOutDevice: {
    type: DataTypes.STRING,
    allowNull: true
  },

  ipAddressCheckIn: {
    type: DataTypes.STRING,
    allowNull: true
  },

  ipAddressCheckOut: {
    type: DataTypes.STRING,
    allowNull: true
  },

  // =========================
  // APPROVAL
  // =========================
  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },

  approvedBy: {
    type: DataTypes.UUID,
    allowNull: true
  },

  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },

  // =========================
  // NOTES
  // =========================
  note: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  // =========================
  // SYSTEM FLAGS
  // =========================
  isManualEntry: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  isAutoCheckout: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }

}, {
  timestamps: true,
  freezeTableName: true,

  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['shift_id']
    },
    {
      fields: ['workDate']
    },
    {
      unique: true,
      fields: ['user_id', 'shift_id', 'workDate']
    }
  ]
});

export default Attendance;