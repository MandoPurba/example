import {
  DataTypes
} from 'sequelize';
import sequelize from '../src/db/sequelize.js';

const BackendRoute = sequelize.define('backend_route', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    unique: true
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false
  },
  method: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
}, {
  timestamps: true,
  freezeTableName: true,
});

export default BackendRoute;