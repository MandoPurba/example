import {
  DataTypes
} from 'sequelize';
import sequelize from '../src/db/sequelize.js';

const FaceAttendanceCheckIn = sequelize.define('face_attendance_check_in', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  attendance_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  score: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  type: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  imageUrl: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  freezeTableName: true
});

export default FaceAttendanceCheckIn;