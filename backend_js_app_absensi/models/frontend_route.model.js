import {
  DataTypes
} from 'sequelize';
import sequelize from '../src/db/sequelize.js';

const FrontendRoute = sequelize.define('frontend_route', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    unique: true
  },
  icon: {
    type: DataTypes.STRING,
  },
  path: {
    type: DataTypes.STRING,
  },
    sort: {
    type: DataTypes.INTEGER,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
}, {
  timestamps: true,
  freezeTableName: true,
});

export default FrontendRoute;