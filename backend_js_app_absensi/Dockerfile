# Backend Node/Express + Sequelize (PostgreSQL)
FROM node:20-bookworm-slim

# Build tools untuk native module (bcrypt)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependency (+ sequelize-cli lokal utk migrate/seed)
COPY package*.json ./
RUN npm install && npm install sequelize-cli

# Copy source
COPY . .
RUN chmod +x docker-entrypoint.sh

# Port aplikasi (lihat .env: PORT=8001)
EXPOSE 8001

# Saat start: migrate -> seed (hanya jika DB kosong) -> jalankan server
CMD ["sh", "docker-entrypoint.sh"]
