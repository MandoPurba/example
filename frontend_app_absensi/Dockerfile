# Frontend Next.js (production: build lalu start)
FROM node:20-bookworm-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# NEXT_PUBLIC_* di-inline saat BUILD -> harus diset sebagai build arg.
# Nilai default cocok untuk host networking (browser & server sama-sama localhost).
ARG NEXT_PUBLIC_API_URL=http://localhost:8001
ARG NEXT_PUBLIC_BACKEND_URL=http://localhost:8001
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

RUN npm run build

EXPOSE 3000

# next start (baca AUTH_SECRET/NEXTAUTH_URL dari env runtime via env_file)
CMD ["npm", "run", "start"]
