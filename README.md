# SmartStay AI — Akıllı Konaklama Öneri & Dinamik Fiyat Değerleme Platformu

SmartStay AI; kullanıcıların bütçe, konum, oda tipi ve konaklama olanakları (Wi-Fi, klima, havuz, mutfak vb.) tercihlerine göre en uygun konaklama ilanlarını öneren ve makine öğrenmesi algoritmalarıyla ilanın piyasa fiyat değerlemesini (Fırsat / Piyasa Değerinde / Pahalı) gerçekleştiren uçtan uca modern bir web platformudur.

---

## 🎯 Proje Amacı ve Çözülen Problem

Seyahat ve konaklama sektöründe kullanıcılar binlerce ilan arasından kendi kriterlerine en uygun olanı bulmakta ve gördükleri fiyatın o bölge ve olanaklar için adil olup olmadığını anlamakta zorlanmaktadır. SmartStay AI bu problemi iki temel yapay zeka modülüyle çözer:

1. **İçerik Tabanlı Akıllı Öneri Motoru (Content-Based Recommendation Engine):**
   - Kullanıcının aradığı anahtar kelimeleri ve filtreleri, ilanların metinsel ve özellik verileriyle **TF-IDF (Term Frequency - Inverse Document Frequency)** vektör uzayında eşleştirir.
   - **Kosinüs Benzerliği (Cosine Similarity)** metriği ile kullanıcı talebine en yakın ilanları yüksek doğrulukla sıralar.

2. **Dinamik Fiyat Değerleme ve Anomali Tespiti (ML Price Valuation Engine):**
   - Konum (enlem/boylam, semt), oda tipi, yatak/banyo sayısı, olanak çeşitliliği ve kullanıcı puanları gibi çok boyutlu öznitelikleri kullanarak **XGBoost / Random Forest Regressor** modelleriyle ilanın "olması gereken tahmini piyasa değerini" hesaplar.
   - Gerçek fiyat ile model tahmini arasındaki farkı analiz ederek kullanıcıya dinamik rozetler sunar:
     - 🟢 **Fırsat (Good Deal):** Gerçek fiyat, piyasa tahmininin belirgin şekilde altında (%15+ indirimli).
     - 🔵 **Piyasa Değerinde (Fair Price):** Gerçek fiyat, tahmin edilen piyasa aralığında.
     - 🔴 **Pahalı (Overpriced):** Gerçek fiyat, bölge ve olanak ortalamasının belirgin şekilde üzerinde.

---

## 🏗️ Sistem Mimarisi ve Teknoloji Yığını

Proje, kurumsal standartlarda **Monorepo** ve mikroservis/çok katmanlı mimari yaklaşımıyla kurgulanmıştır:

```
SmartStay AI
├── data_science/                 # Veri Analitiği, Özellik Mühendisliği ve Model Eğitimi
│   ├── data/
│   │   ├── raw/                 # Ham veri seti (Inside Airbnb listings.csv)
│   │   └── processed/           # Temizlenmiş ve zenginleştirilmiş veri setleri
│   ├── notebooks/               # Jupyter analiz ve model geliştirme defterleri
│   │   ├── 01_eda_and_cleaning.ipynb
│   │   ├── 02_recommender_system.ipynb
│   │   └── 03_price_prediction_model.ipynb
│   └── models/                  # Eğitilmiş .joblib model ve vektörleştirici dosyaları
│
├── ml_service/                  # FastAPI (Python) Mikroservisi
│   ├── app/
│   │   ├── main.py              # REST API Router & Middleware
│   │   ├── schemas.py           # Pydantic Request/Response modelleri
│   │   └── services/            # Model inference ve öneri algoritmaları
│   └── requirements.txt
│
├── backend/                     # ASP.NET Core 8 Web API (N-Tier Architecture)
│   ├── SmartStay.API/           # Controller & API Gateway katmanı
│   ├── SmartStay.Core/          # Domain Entities, DTOs & Repository Arayüzleri
│   ├── SmartStay.Data/          # EF Core DbContext, Migrations & MSSQL Veri Erişimi
│   └── SmartStay.Services/      # İş Mantığı, ML HttpClient İstemcisi & Servisler
│
├── frontend/                    # Modern React Web Arayüzü
│   ├── src/
│   │   ├── components/          # Reusable UI bileşenleri, Harita (Leaflet), Kartlar
│   │   ├── pages/               # Ana Sayfa, Arama/Filtreleme, İlan Detay, Analiz Paneli
│   │   └── services/            # Axios API istemcileri
│   └── package.json
│
├── requirements.txt             # Python ortam bağımlılıkları
├── .gitignore                   # Versiyon kontrol hariç tutma kuralları
└── README.md                    # Proje dokümantasyonu
```

### 🛠️ Teknolojiler
- **Veri Bilimi & Makine Öğrenmesi:** Python, Pandas, NumPy, Scikit-Learn (TF-IDF, Cosine Similarity), XGBoost, Matplotlib, Seaborn, Joblib.
- **ML API Servisi:** FastAPI, Uvicorn, Pydantic.
- **Ana Backend:** C#, .NET 8 (ASP.NET Core Web API), Entity Framework Core (Code-First), Microsoft SQL Server.
- **Frontend & Görselleştirme:** React.js, Tailwind CSS, Leaflet.js / React-Leaflet (İnteraktif Harita Entegrasyonu), Lucide Icons, Axios.
- **Versiyon Kontrol:** Git & GitHub.

---

## 📊 Veri Seti

- **Kaynak:** Inside Airbnb / Kaggle (`listings.csv`)
- **Önemli Nitelikler:** `price`, `neighbourhood_cleansed`, `latitude`, `longitude`, `room_type`, `accommodates`, `amenities`, `number_of_reviews`, `review_scores_rating`.

---

## 🚀 Kurulum ve Çalıştırma

### 1. Python Sanal Ortamı ve ML Servisi
```bash
# Sanal ortam oluşturma ve etkinleştirme
python -m venv .venv
# Windows:
.venv\Scripts\activate

# Bağımlılıkların yüklenmesi
pip install -r requirements.txt

# ML Servisini Başlatma (İlerleyen aşamalarda)
# uvicorn ml_service.app.main:app --reload --port 8000
```

### 2. Backend (ASP.NET Core)
```bash
cd backend
dotnet restore
dotnet run --project SmartStay.API
```

### 3. Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

---

## 📈 Başarı Kriterleri ve Metrikler

- **Fiyat Tahmin Modeli:** $R^2 \ge 0.80$, Düşük RMSE (Root Mean Squared Error) ve MAE değerleri.
- **Öneri Doğruluğu:** Kullanıcı olanak ve lokasyon kriterleriyle yüksek anlamsal örtüşme.
- **Sistem Performansı:** API uç noktalarında 200ms altı yanıt süresi.
