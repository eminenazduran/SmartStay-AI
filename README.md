# SmartStay AI 🏠⚡
> **Yapay Zeka Destekli Akıllı Konaklama Öneri ve Dinamik Fiyat Değerleme Platformu**

[![.NET](https://img.shields.io/badge/.NET-10.0-512BD4?style=flat-square&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MSSQL](https://img.shields.io/badge/MSSQL-Server_2022-CC292B?style=flat-square&logo=microsoft-sql-server&logoColor=white)](https://www.microsoft.com/sql-server)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

SmartStay AI; Inside Airbnb'nin İstanbul açık verisi üzerine inşa edilmiş, konaklama arayan misafirler ve ev sahipleri için **makine öğrenmesi destekli adil fiyat değerlemesi**, **içerik tabanlı kişiselleştirilmiş ev önerileri** ve **akıllı semt rehberliği** sunan kurumsal düzeyde bir web ve mobil platformudur.

---

## 📌 İçindekiler
- [Proje Hakkında](#-proje-hakkında)
- [Öne Çıkan Özellikler](#-öne-çıkan-özellikler)
- [Sistem Mimarisi](#-sistem-mimarisi)
- [Teknoloji Yığını](#-teknoloji-yığını)
- [Klasör Yapısı](#-klasör-yapısı)
- [Makine Öğrenmesi & Model Başarısı](#-makine-öğrenmesi--model-başarısı)
- [Kurulum ve Çalıştırma Rehberi](#-kurulum-ve-çalıştırma-rehberi)
  - [1. Gereksinimler](#1-gereksinimler)
  - [2. Veritabanı Kurulumu (MSSQL)](#2-veritabanı-kurulumu-mssql)
  - [3. ML Mikroservisi (Python FastAPI)](#3-ml-mikroservisi-python-fastapi)
  - [4. Backend API (.NET 10)](#4-backend-api-net-10)
  - [5. Frontend (React + Vite)](#5-frontend-react--vite)
- [API Referansı](#-api-referansı)
- [Katkıda Bulunanlar & Lisans](#-katkıda-bulunanlar--lisans)

---

## 🎯 Proje Hakkında

Kısa dönemli ev kiralama pazarında (Airbnb vb.) hem misafirler hem de ev sahipleri için en büyük zorluk **"Bu evin gerçek piyasa değeri nedir?"** sorusudur. 

SmartStay AI bu problemi çözmek için:
1. **İlan Fiyatını Değerler:** Bir evin konumuna, kapasitesine ve 30'dan fazla olanağına bakarak tahmin ettiği fiyatla gerçek fiyatı kıyaslar. Evin *"Fırsat"*, *"Piyasa Değerinde"* veya *"Pahalı"* olduğunu rozetlerle gösterir.
2. **Kişiselleştirilmiş Alternatifler Önerir:** Misafirin incelediği bir ilanın özelliklerine en çok benzeyen alternatif evleri anında sunar.
3. **Gerçek Veri Güvenilirliği:** Şablon veriler yerine İstanbul'daki 22.665 evin gerçek konumlarını, doğrulanmış ev sahiplerini ve misafirlerin yazdığı 44.000+ orijinal yorumu sunar.

---

## ✨ Öne Çıkan Özellikler

* **🤖 XGBoost Fiyat Değerleme Motoru:** 82 adet sayısal, kategorik ve ikili özellikten beslenen yüksek başarımlı regresyon modeli ($R^2 = 0.79$).
* **🧭 TF-IDF & Cosine Similarity Öneri Motoru:** İlan açıklamaları ve olanak metinleri üzerinden $O(1)$ matris aramasıyla anlamsal ev eşleştirmesi.
* **🗺️ İnteraktif Harita Entegrasyonu:** Leaflet.js altyapısıyla İstanbul'un tüm ilçelerinde kümelenmiş fiyat pinleri ve canlı filtreleme.
* **💬 Gerçek Misafir Yorumları:** İlanların altında Inside Airbnb veri setindeki orijinal misafir değerlendirmeleri (maksimum 3 adet) ve 0 yorumlu ilanlar için şeffaf `★ Yeni` rozeti.
* **📱 Uçtan Uca Responsive & Mobil Uyumlu:** Masaüstü, tablet ve mobil cihazlarda taşma yapmayan esnek grid arayüzü ve Expo tabanlı mobil uygulama altyapısı.
* **🎨 Özel Vektörel Amblem:** Boğaziçi Köprüsü silüeti ile modern ev formunu ve AI telemetri düğümlerini birleştiren kurumsal logo tasarımı.

---

## 🏗️ Sistem Mimarisi

```text
+-------------------------------------------------------------+
|                      Kullanıcı Arayüzü                      |
|       React 19 SPA (Web)        &     React Native (Mobil)   |
+-------------------------------------------------------------+
                               | (HTTP / JSON)
                               v
+-------------------------------------------------------------+
|               ASP.NET Core 10 Web API Gateway               |
|  - ListingsController         - Validation (FluentValidation)
|  - ListingsService            - Repository Pattern (EF Core)
+-------------------------------------------------------------+
               |                               |
 (Entity Framework Core)             (HTTP / Microservice Call)
               v                               v
+-----------------------------+ +-----------------------------+
|   MSSQL Database            | |   Python FastAPI ML Service |
|  - 22.665 Listings          | |  - XGBoost Regressor Model  |
|  - 44.387 ListingReviews    | |  - TF-IDF Recommender Engine|
|  - Spatial Coordinates      | |  - Port: 8000               |
+-----------------------------+ +-----------------------------+
```

---

## 💻 Teknoloji Yığını

| Katman | Teknoloji | Açıklama |
|---|---|---|
| **Veri Bilimi & ML** | Python 3.12, Pandas, NumPy, Scikit-Learn, XGBoost, Joblib | EDA, veri temizleme, regresyon ve benzerlik modellemesi |
| **ML Servis Katmanı** | FastAPI, Uvicorn, Pydantic | Asenkron, yüksek hızlı makine öğrenmesi mikroservisi |
| **Backend** | .NET 10.0 (C#), ASP.NET Core Web API, EF Core 10, FluentValidation | Katmanlı kurumsal mimari, RESTful uç noktalar |
| **Veritabanı** | Microsoft SQL Server 2022 (SQLEXPRESS) | İlişkisel veri saklama, indeksleme ve performans optimizasyonu |
| **Frontend** | React 19, Vite 8.2, Tailwind CSS 3.4, Leaflet.js, React-Leaflet | Hızlı SPA istemci, modern cam efekti (glassmorphism) |
| **Mobil Destek** | React Native, Expo, React Navigation | iOS ve Android platformları için mobil istemci |

---

## 📁 Klasör Yapısı

```text
SmartStay-AI/
├── backend/                  # .NET 10 Katmanlı Mimari Çözümü
│   ├── src/
│   │   ├── SmartStay.API/    # Web API Controller'ları, Middleware ve Swagger
│   │   ├── SmartStay.Core/   # Domain Entity'leri, DTO'lar, Arayüzler (Interfaces)
│   │   ├── SmartStay.Data/   # EF Core AppDbContext, Repository Implementasyonları
│   │   └── SmartStay.Services# İş Mantığı (Business Logic), ML Entegrasyon Servisi
│   └── SmartStay.slnx        # .NET Çözüm Dosyası
├── ml_service/               # Python FastAPI Mikroservisi
│   ├── app/
│   │   ├── main.py           # FastAPI Rotaları ve CORS Yapılandırması
│   │   ├── schemas.py        # Pydantic İstek/Yanıt Veri Modelleri
│   │   └── services/         # Model Yükleyici ve Tahmin Motoru (PricePredictor)
│   ├── Dockerfile            # Konteyner Dağıtım Tanımı
│   └── main.py               # Uvicorn Başlatıcı
├── frontend/                 # React SPA İstemcisi
│   ├── src/
│   │   ├── components/       # Yeniden kullanılabilir UI bileşenleri (Navbar, Footer, Logo vb.)
│   │   ├── pages/            # HomePage, SearchPage, ListingDetailPage
│   │   ├── services/         # Axios / Fetch tabanlı API servis katmanı (api.js)
│   │   └── data/             # Mock ve önbellek veri kaynakları
│   ├── public/               # Favicon ve statik vektörel varlıklar (logo.svg)
│   └── package.json
├── data_science/             # Jupyter Notebook'lar ve Model Eğitimi
│   ├── notebooks/            # 01_EDA, 02_Feature_Engineering, 03_Modeling
│   ├── models/               # Eğitilmiş .joblib modelleri ve model_features.json
│   └── data/                 # İşlenmiş cleaned_listings.csv veri seti
└── proje_planlari/           # 20 Günlük Staj & Geliştirme Takip Raporları
```

---

## 📈 Makine Öğrenmesi & Model Başarısı

Dinamik fiyat değerleme motorunda test edilen modeller ve elde edilen test metrikleri:

| Model | Test $R^2$ (Açıklanan Varyans) | Test MAE (Ortalama Hata) | Test RMSE | Durum |
|---|---|---|---|---|
| **Baseline Linear Regression** | 0.5420 | 1.145,20 ₺ | 1.832,40 ₺ | Referans |
| **Random Forest Regressor** | 0.7310 | 890,15 ₺ | 1.340,10 ₺ | Karşılaştırma |
| **XGBoost Regressor (Nihai Model)** | **0.7903** | **780,43 ₺** | **1.193,61 ₺** | **Üretimde Aktif** |

* **Öz Nitelik Havuzu:** 11 sayısal parametre, One-Hot encoded semt ve oda tipleri, 30 popüler ikili olanak (toplam 82 girdi sütunu).

---

## 🚀 Kurulum ve Çalıştırma Rehberi

### 1. Gereksinimler
- [.NET 10.0 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- [Python 3.11 veya 3.12](https://www.python.org/downloads/)
- [Node.js (v20+)](https://nodejs.org/) & npm
- [Microsoft SQL Server (LocalDB veya SQLEXPRESS)](https://www.microsoft.com/sql-server)

---

### 2. Veritabanı Kurulumu (MSSQL)
`backend/src/SmartStay.API/appsettings.json` dosyasındaki bağlantı dizesini kontrol edin:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=.\\SQLEXPRESS;Database=SmartStayDb;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

---

### 3. ML Mikroservisi (Python FastAPI)
Ayrı bir terminal penceresinde:
```bash
# Sanal ortamı etkinleştirin
.venv\Scripts\activate

# ML servisi dizinine gidin ve başlatın
cd ml_service
python main.py
```
* **Swagger Dokümantasyonu:** `http://localhost:8000/docs`
* **Sağlık Kontrolü:** `http://localhost:8000/health`

---

### 4. Backend API (.NET 10)
Ayrı bir terminal penceresinde:
```bash
# Proje kök dizininde:
dotnet run --project backend/src/SmartStay.API/SmartStay.API.csproj --urls "http://0.0.0.0:5018"
```
* **Swagger UI:** `http://localhost:5018/swagger`
* **API Temel Adresi:** `http://localhost:5018/api`

---

### 5. Frontend (React + Vite)
Ayrı bir terminal penceresinde:
```bash
cd frontend
npm install
npm run dev -- --host
```
* **Web Arayüzü:** `http://localhost:5173`
* **Yerel Ağ / Mobil Erişim:** `http://<YEREL_IP>:5173`

---

## 📡 API Referansı

| Metot | Uç Nokta | Açıklama |
|---|---|---|
| `GET` | `/api/listings` | Sayfalanmış ve filtrelenmiş konaklama ilanları listesi |
| `GET` | `/api/listings/{id}` | Tekil ilan detayı, ev sahibi bilgisi ve gerçek misafir yorumları |
| `GET` | `/api/listings/featured` | Ana sayfa için en yüksek puanlı öne çıkan konaklama ilanları |
| `GET` | `/api/listings/districts` | İstanbul'un 39 ilçesinin listesi ve ortalama metrikleri |
| `POST` | `/api/listings/predict-price`| Belirtilen özelliklere göre gecelik adil fiyat tahmini hesaplar |
| `POST` | `/api/listings/recommend` | Belirli bir ilana benzer alternatif ilan önerileri üretir |

---

## 📄 Katkıda Bulunanlar & Lisans

Bu proje **MIT Lisansı** altında lisanslanmıştır.  
Veri seti: [Inside Airbnb](http://insideairbnb.com/) açık veri lisansı koşullarına tabidir.
