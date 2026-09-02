# SmartStay AI — ML Mikroservisi Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Sistem gereksinimleri (libgomp1 XGBoost C++ runtime için gereklidir)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgomp1 \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Kodları ve eğitilmiş modelleri kopyala
COPY ml_service/ ./ml_service/
COPY data_science/models/ ./data_science/models/
COPY data_science/data/processed/ ./data_science/data/processed/

WORKDIR /app/ml_service
ENV PYTHONPATH=/app/ml_service:/app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
