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

SmartStay AI; Inside Airbnb'nin İstanbul açık verisi üzerine inşa edilmiş, konaklama arayan misafirler ve ev sahipleri için **makine öğrenmesi destekli adil fiyat değerlemesi**, **içerik tabanlı kişiselleştirilmiş ev önerileri** ve **akıllı semt rehberliği** sunan modern bir web ve mobil platformudur.

---

## 📌 İçindekiler
- [Proje Hakkında](#-proje-hakkında)
- [Öne Çıkan Özellikler](#-öne-çıkan-özellikler)
- [Sistem Mimarisi](#-sistem-mimarisi)
- [Teknoloji Yığını](#-teknoloji-yığını)
- [Modüller ve Görevleri](#-modüller-ve-görevleri)
- [Makine Öğrenmesi & Model Başarısı](#-makine-öğrenmesi--model-başarısı)
- [Hızlı Başlangıç](#-hızlı-başlangıç)
- [API Yetenekleri](#-api-yetenekleri)
- [Lisans](#-lisans)

---

## 🎯 Proje Hakkında

Kısa dönemli ev kiralama pazarında (Airbnb vb.) hem misafirler hem de ev sahipleri için en kritik konu **"Bu evin gerçek piyasa değeri nedir?"** sorusudur. 

SmartStay AI bu problemi çözmek için geliştirilmiştir:
1. **İlan Fiyatını Değerler:** Bir evin konumuna, kapasitesine ve 30'dan fazla olanağına bakarak tahmin ettiği değer ile gerçek liste fiyatını kıyaslar. Evin *"Fırsat"*, *"Piyasa Değerinde"* veya *"Ortalama Üzeri"* olduğunu rozetlerle gösterir.
2. **Kişiselleştirilmiş Alternatifler Önerir:** Misafirin incelediği ilanın özelliklerine en çok benzeyen alternatif evleri içerik tabanlı benzerlik analiziyle sunar.
3. **Gerçek Veri Güvenilirliği:** Şablon veriler yerine İstanbul'daki 22.000'den fazla evin gerçek konumlarını, doğrulanmış ev sahiplerini ve misafirlerin yazdığı on binlerce orijinal yorumu sunar.

---

## ✨ Öne Çıkan Özellikler

* **🤖 XGBoost Fiyat Değerleme Motoru:** 82 adet sayısal, kategorik ve ikili özellikten beslenen yüksek başarımlı regresyon modeli ($R^2 = 0.79$).
* **🧭 TF-IDF & Cosine Similarity Öneri Motoru:** İlan açıklamaları ve olanak metinleri üzerinden benzerlik aramasıyla akıllı ev eşleştirmesi.
* **🗺️ İnteraktif Harita:** Leaflet.js altyapısıyla İstanbul'un ilçelerinde fiyat pinleri ve canlı filtreleme.
* **💬 Gerçek Misafir Yorumları:** İlanların altında veri setindeki orijinal misafir değerlendirmeleri ve yeni ilanlar için şeffaf `★ Yeni` rozeti.
* **📱 Responsive & Mobil Uyumlu:** Masaüstü, tablet ve mobil ekranlara uyum sağlayan modern arayüz ve React Native mobil altyapısı.
* **🎨 Özel Vektörel Amblem:** Boğaziçi Köprüsü silüeti ile modern ev formunu ve AI telemetri düğümlerini birleştiren logo tasarımı.

---

## 🏗️ Sistem Mimarisi

```text
+-------------------------------------------------------------+
|                      Kullanıcı Arayüzü                      |
|       React 19 SPA (Web)        &     React Native (Mobil)   |
+-------------------------------------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|               ASP.NET Core 10 Web API Gateway               |
|  - ListingsController         - Validation (FluentValidation)
|  - ListingsService            - Repository Pattern (EF Core)
+-------------------------------------------------------------+
               |                               |
               v                               v
+-----------------------------+ +-----------------------------+
|        MSSQL Database       | |       FastAPI ML Servisi    |
|  - Listings & Reviews Data  | |  - XGBoost Fiyat Modeli     |
|  - Spatial Coordinates      | |  - TF-IDF Benzerlik Motoru  |
+-----------------------------+ +-----------------------------+
```

---

## 💻 Teknoloji Yığını

| Katman | Teknoloji | Açıklama |
|---|---|---|
| **Veri Bilimi & ML** | Python, Pandas, Scikit-Learn, XGBoost, Joblib | Veri işleme, özellik mühendisliği ve model eğitimi |
| **ML Servis Katmanı** | FastAPI, Uvicorn, Pydantic | Hızlı ve ölçeklenebilir yapay zeka mikroservisi |
| **Backend** | .NET 10 (C#), ASP.NET Core Web API, EF Core | Katmanlı mimari, RESTful servisler |
| **Veritabanı** | Microsoft SQL Server (MSSQL) | İlişkisel veri saklama ve sorgu optimizasyonu |
| **Frontend** | React, Vite, Tailwind CSS, Leaflet.js | Modern, responsive tek sayfa uygulaması (SPA) |
| **Mobil Destek** | React Native, Expo | Çapraz platform mobil istemci |

---

## 📁 Modüller ve Görevleri

- **`backend/`**: ASP.NET Core katmanlı mimarisi (API, Core, Data, Services). İş mantığı, veri erişimi ve ML mikroservisi orkestrasyonunu yürütür.
- **`ml_service/`**: Eğitilmiş modelleri (XGBoost & TF-IDF) barındıran ve tahmin isteklerine yanıt veren bağımsız Python servisi.
- **`frontend/`**: Kullanıcıların evleri arayabildiği, haritada gezinebildiği ve detayları inceleyebildiği modern React web arayüzü.
- **`data_science/`**: Veri analizi (EDA), temizleme ve model eğitim süreçlerini içeren Jupyter defterleri ve model dosyaları.

---

## 📈 Makine Öğrenmesi & Model Başarısı

Fiyat tahmin motorunda modeller karşılaştırmalı olarak test edilmiş ve en yüksek başarıyı XGBoost sağlamıştır:

| Model | Test $R^2$ (Açıklanan Varyans) | Test MAE (Ortalama Hata) | Test RMSE | Durum |
|---|---|---|---|---|
| **Baseline Linear Regression** | 0.5420 | 1.145 ₺ | 1.832 ₺ | Referans |
| **Random Forest Regressor** | 0.7310 | 890 ₺ | 1.340 ₺ | Karşılaştırma |
| **XGBoost Regressor (Nihai Model)** | **0.7903** | **780 ₺** | **1.193 ₺** | **Aktif** |

---

## 🚀 Hızlı Başlangıç

Projeyi yerel ortamda çalıştırmak için üç ana servisin başlatılması yeterlidir:

1. **ML Servisi:** `ml_service` dizininde Python ortamı ile başlatılır.
2. **Backend:** `backend` dizininde .NET SDK aracılığıyla derlenip çalıştırılır.
3. **Frontend:** `frontend` dizininde bağımlılıklar yüklenerek geliştirme sunucusu açılır.

---

## 📡 API Yetenekleri

Platform RESTful mimari üzerinden şu temel yetenekleri sunar:
- **İlan Arama & Filtreleme:** Semt, kapasite, fiyat aralığı ve oda türüne göre ilan sorgulama.
- **İlan Detayı & Yorumlar:** İlanın tüm özellikleri, ev sahibi profili ve gerçek misafir değerlendirmeleri.
- **Dinamik Fiyat Tahmini:** Girilen ev parametrelerine göre makine öğrenmesi destekli adil piyasa değeri hesabı.
- **Benzer İlan Önerisi:** İncelenen ilana en yakın alternatiflerin listelenmesi.

---

## 📄 Lisans

Bu proje **MIT Lisansı** altında lisanslanmıştır.  
Veri seti: [Inside Airbnb](http://insideairbnb.com/) açık veri lisansı koşullarına tabidir.
