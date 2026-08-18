require('dotenv').config();

// URL DB langsung di kode (fallback bila .env tidak terbaca).
// Tetap prioritaskan process.env.DATABASE_URL bila ada.
const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgres://absensi:absensi@localhost:5432/absensi';

module.exports = {
  development: {
    url: DATABASE_URL,
    dialect: 'postgres'
  },
  test: {
    url: DATABASE_URL,
    dialect: 'postgres'
  },
  production: {
    url: DATABASE_URL,
    dialect: 'postgres'
  }
};