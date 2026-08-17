import {
  DataTypes
} from 'sequelize';
import sequelize from '../src/db/sequelize.js';
import Sequelize from 'sequelize';

const User = sequelize.define('user', {
  
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true
  },
  password: DataTypes.STRING,
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
}, {
  timestamps: true,
  freezeTableName: true,
});

export default User;