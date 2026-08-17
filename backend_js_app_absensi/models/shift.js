import { DataTypes } from 'sequelize';
import sequelize from '../src/db/sequelize.js';
const Shift = sequelize.define('shift', {

  // =========================
  // PRIMARY KEY
  // =========================
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },

  // =========================
  // SHIFT NAME
  // =========================
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  // =========================
  // SHIFT CODE
  // =========================
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  // =========================
  // START & END TIME
  // =========================
  startTime: {
    type: DataTypes.TIME,
    allowNull: false
  },

  endTime: {
    type: DataTypes.TIME,
    allowNull: false
  },

  // =========================
  // SHIFT CROSS DAY
  // contoh:
  // 22:00 - 06:00
  // =========================
  crossDay: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  // =========================
  // LATE TOLERANCE
  // =========================
  graceMinutes: {
    type: DataTypes.INTEGER,
    defaultValue: 15
  },

  // =========================
  // DESCRIPTION
  // =========================
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }

}, {
  timestamps: true,
  freezeTableName: true,

  indexes: [
    {
      unique: true,
      fields: ['code']
    },
    {
      fields: ['startTime']
    },
    {
      fields: ['endTime']
    }
  ]
});


export default Shift;