import { DataTypes } from 'sequelize';
import sequelize from '../src/db/sequelize.js';

const Permission = sequelize.define('permission', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

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

  permission_type: {
    type: DataTypes.ENUM(
      'izin',
      'sakit',
      'cuti',
      'dinas_luar'
    ),
    allowNull: false,
  },

  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },

  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },

  start_time: {
    type: DataTypes.TIME,
    allowNull: true,
  },

  end_time: {
    type: DataTypes.TIME,
    allowNull: true,
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  attachment_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  approval_note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  approved_by: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'user',
      key: 'id',
    },
  },

  approved_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },

  status: {
    type: DataTypes.ENUM(
      'pending',
      'approved',
      'rejected'
    ),
    allowNull: false,
    defaultValue: 'pending',
  },
}, {
  timestamps: true,
  freezeTableName: true,
});

export default Permission;