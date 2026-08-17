import {
  DataTypes
} from 'sequelize';
import sequelize from '../src/db/sequelize.js';
import Sequelize from 'sequelize';


const Branch = sequelize.define('branch', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: DataTypes.STRING,
  code: {
    type: DataTypes.STRING,
    unique: true
  },
  address: DataTypes.STRING,
  city: DataTypes.STRING,
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  radius: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
}, {
  timestamps: true,
  freezeTableName: true,
});

export default Branch;