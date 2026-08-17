import {
  DataTypes
} from 'sequelize';
import sequelize from '../src/db/sequelize.js';
import Sequelize from 'sequelize';

const Token = sequelize.define('token', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  token: {
    type: DataTypes.STRING,
    unique: true
  },
}, {
  timestamps: true,
  freezeTableName: true,
});

export default Token;