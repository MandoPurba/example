# =====================================================================
# Makefile - Maya (aplikasi absensi)  ---  KHUSUS WINDOWS (cmd.exe)
#   3 layanan: backend_js (Node/Express :8001), frontend (Next.js :3000),
#   backend_py (Flask :8000).
#
# Syarat: Node/npm (nvm-windows), serta Python launcher `py` dengan 3.11.
# Catatan DB: database TIDAK dikelola Makefile ini. Jalankan Postgres Anda
# sendiri, pastikan DATABASE_URL di backend_js_app_absensi\.env benar,
# lalu pakai target `db-migrate` / `db-seed` / `db-reset`.
# =====================================================================

# Paksa pakai cmd.exe walau ada Git Bash / sh di PATH
SHELL := cmd.exe
.SHELLFLAGS := /c

# --- Konfigurasi (override: `make py-venv PY_LAUNCHER="py -3.12"`) ---
PY_LAUNCHER ?= py -3.11
BE_DIR      := backend_js_app_absensi
FE_DIR      := frontend_app_absensi
PY_DIR      := backend_py_app_absensi
SEQ         := npx --yes sequelize-cli

.DEFAULT_GOAL := help
.PHONY: help install be-install fe-install py-venv \
        db-migrate db-seed db-reset \
        run be-run fe-build fe-run py-run clean

# --------------------------------------------------------------------
help: ## Tampilkan daftar perintah
	@echo Maya - perintah yang tersedia:
	@echo.
	@echo   make install       Install semua dependency (node + python .venv)
	@echo   make be-install    Install dependency backend_js (npm)
	@echo   make fe-install    Install dependency frontend (npm)
	@echo   make py-venv       Buat .venv (py -3.11) + install requirements
	@echo.
	@echo   make db-migrate    Jalankan migrasi (DB harus sudah hidup)
	@echo   make db-seed       Jalankan semua seeder
	@echo   make db-reset      Undo semua migrasi -^> migrate -^> seed (fresh)
	@echo.
	@echo   make fe-build      Build frontend (wajib sebelum fe-run/run)
	@echo   make run           Build fe lalu jalankan SEMUA (python-^>backend-^>frontend)
	@echo   make be-run        Jalankan backend_js  http://localhost:8001
	@echo   make fe-run        Jalankan frontend     http://localhost:3000
	@echo   make py-run        Jalankan backend_py   http://localhost:8000
	@echo.
	@echo   make clean         Hapus node_modules ^& .venv
	@echo.
	@echo Tip: jalankan be-run / fe-run / py-run di 3 terminal terpisah.

# --------------------------------------------------------------------
# Install
# --------------------------------------------------------------------
install: be-install fe-install py-venv ## Install semua dependency

be-install: ## Install dependency backend_js
	cd $(BE_DIR) && npm install

fe-install: ## Install dependency frontend
	cd $(FE_DIR) && npm install

py-venv: ## Buat virtualenv .venv (py -3.11) + install requirements
	cd $(PY_DIR) && $(PY_LAUNCHER) -m venv .venv
	cd $(PY_DIR) && .venv\Scripts\python -m pip install --upgrade pip
	cd $(PY_DIR) && .venv\Scripts\python -m pip install -r requirements.txt

# --------------------------------------------------------------------
# Database (asumsi Postgres sudah berjalan & DATABASE_URL benar)
# --------------------------------------------------------------------
db-migrate: ## Jalankan migrasi
	cd $(BE_DIR) && $(SEQ) db:migrate

db-seed: ## Jalankan semua seeder
	cd $(BE_DIR) && $(SEQ) db:seed:all

db-reset: ## Reset penuh: undo semua -> migrate -> seed
	cd $(BE_DIR) && $(SEQ) db:migrate:undo:all && $(SEQ) db:migrate && $(SEQ) db:seed:all

# --------------------------------------------------------------------
# Run
# --------------------------------------------------------------------
run: fe-build ## Build frontend lalu jalankan SEMUA (urutan: python -> backend -> frontend)
	start "backend_py" cmd /k "cd $(PY_DIR) && .venv\Scripts\python server.py"
	start "backend_js" cmd /k "cd $(BE_DIR) && npm start"
	start "frontend" cmd /k "cd $(FE_DIR) && npm run start"

be-run: ## Jalankan backend_js
	cd $(BE_DIR) && npm start

fe-build: ## Build frontend (wajib sebelum `npm run start`)
	cd $(FE_DIR) && npm run build

fe-run: ## Jalankan frontend (production; jalankan `make fe-build` dulu)
	cd $(FE_DIR) && npm run start

py-run: ## Jalankan backend_py (butuh .venv, jalankan `make py-venv` dulu)
	cd $(PY_DIR) && .venv\Scripts\python server.py

# --------------------------------------------------------------------
clean: ## Hapus node_modules & .venv
	@if exist $(BE_DIR)\node_modules rd /s /q $(BE_DIR)\node_modules
	@if exist $(FE_DIR)\node_modules rd /s /q $(FE_DIR)\node_modules
	@if exist $(PY_DIR)\.venv rd /s /q $(PY_DIR)\.venv
