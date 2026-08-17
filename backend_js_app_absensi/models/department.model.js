import {
  DataTypes
} from 'sequelize';
import sequelize from '../src/db/sequelize.js';
import Sequelize from 'sequelize';

const Department = sequelize.define('department', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    unique: true
  },
  code: {
    type: DataTypes.STRING,
    unique: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
}, {
  timestamps: true,
  freezeTableName: true,
});

export default Department;