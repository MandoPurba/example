import {
  DataTypes
} from 'sequelize';
import sequelize from '../src/db/sequelize.js';

const FaceAttendanceCheckOut = sequelize.define('face_attendance_check_out', {
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

export default FaceAttendanceCheckOut;