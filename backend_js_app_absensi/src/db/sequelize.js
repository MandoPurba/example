import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// URL DB langsung di kode (fallback bila .env tidak terbaca).
const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgres://absensi:absensi@localhost:5432/absensi';

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export default sequelize;