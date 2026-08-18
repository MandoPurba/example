#!/bin/sh
set -e

echo "[entrypoint] Menjalankan migrasi..."
npx sequelize-cli db:migrate

# Seed hanya jika tabel "user" masih kosong -> mencegah data dobel saat restart
USER_COUNT=$(node -e "const {Client}=require('pg');const c=new Client({connectionString:process.env.DATABASE_URL});c.connect().then(()=>c.query('SELECT COUNT(*)::int AS n FROM \"user\"')).then(r=>{console.log(r.rows[0].n);return c.end();}).catch(()=>{console.log(0);});" 2>/dev/null)

if [ "$USER_COUNT" = "0" ]; then
  echo "[entrypoint] Database kosong -> seeding data awal..."
  npx sequelize-cli db:seed:all
else
  echo "[entrypoint] Data sudah ada (user=$USER_COUNT) -> lewati seed."
fi

echo "[entrypoint] Menjalankan server..."
exec node server.js
