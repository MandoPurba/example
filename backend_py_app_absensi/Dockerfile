# Backend Python (Flask + DeepFace + TensorFlow + torch + OpenCV)
FROM python:3.11-slim

# System deps untuk OpenCV & runtime ML
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 libglib2.0-0 libgomp1 \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependency python (berat: TF + torch ~beberapa GB, butuh waktu)
COPY requirements.txt ./
RUN pip install --no-cache-dir --upgrade pip \
 && pip install --no-cache-dir -r requirements.txt

COPY . .

# Flask (lihat server.py: app.run(port=8000))
EXPOSE 8000

CMD ["python", "server.py"]
