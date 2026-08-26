import sys
import os

# Add ml_service to path
ml_service_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, ml_service_dir)

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_all_endpoints():
    print("=" * 80)
    print("SMARTSTAY AI - FASTAPI ML SERVISI ENTEGRASYON TESTLERI")
    print("=" * 80)

    # 1. Root
    print("\n[TEST 1] GET / (Root Endpoint)")
    res = client.get("/")
    assert res.status_code == 200, f"Root failed: {res.text}"
    print(f"Status: {res.status_code} | Yanit: {res.json()}")

    # 2. Health Check
    print("\n[TEST 2] GET /health (Model Yukleme ve Saglik Durumu)")
    res = client.get("/health")
    assert res.status_code == 200, f"Health failed: {res.text}"
    health_data = res.json()
    print(f"Status: {res.status_code} | Saglik: {health_data['status']} | Yuklu Modeller: {health_data['loaded_models']}")
    assert health_data["status"] == "healthy", "Modellerden biri veya birkaci yuklenemedi!"

    # 3. Price Prediction Test 1 - Kadikoy Dairesi
    print("\n[TEST 3] POST /predict (Kadikoy 2 Kisilik Daire Fiyat Tahmini)")
    payload_kadikoy = {
        "accommodates": 2,
        "bedrooms": 1.0,
        "beds": 1.0,
        "bathrooms": 1.0,
        "latitude": 40.9912,
        "longitude": 29.0289,
        "number_of_reviews": 15,
        "review_scores_rating": 4.8,
        "reviews_per_month": 1.5,
        "minimum_nights": 1,
        "availability_365": 200,
        "room_type": "Entire home/apt",
        "neighbourhood_cleansed": "Kadikoy",
        "amenities": ["Wifi", "Kitchen", "Air conditioning", "Heating", "Hot water"]
    }
    res = client.post("/predict", json=payload_kadikoy)
    assert res.status_code == 200, f"Predict failed: {res.text}"
    pred_data = res.json()
    print(f"Status: {res.status_code} | Tahmin Edilen Fiyat: {pred_data['predicted_price']} {pred_data['currency']}")
    assert pred_data["predicted_price"] > 0, "Tahmin edilen fiyat 0 veya negatif olamaz!"

    # 4. Price Prediction Test 2 - Besiktas Otel Odasi
    print("\n[TEST 4] POST /predict (Besiktas 4 Kisilik Otel Odasi Fiyat Tahmini)")
    payload_besiktas = {
        "accommodates": 4,
        "bedrooms": 2.0,
        "beds": 3.0,
        "bathrooms": 2.0,
        "latitude": 41.0422,
        "longitude": 29.0067,
        "number_of_reviews": 50,
        "review_scores_rating": 4.95,
        "reviews_per_month": 3.2,
        "minimum_nights": 2,
        "availability_365": 300,
        "room_type": "Hotel room",
        "neighbourhood_cleansed": "Besiktas",
        "amenities": ["Wifi", "Kitchen", "Air conditioning", "Heating", "Hot water", "Smoke alarm", "Dedicated workspace"]
    }
    res = client.post("/predict", json=payload_besiktas)
    assert res.status_code == 200, f"Predict failed: {res.text}"
    pred_data_2 = res.json()
    print(f"Status: {res.status_code} | Tahmin Edilen Fiyat: {pred_data_2['predicted_price']} {pred_data_2['currency']}")
    assert pred_data_2["predicted_price"] > pred_data["predicted_price"], "Luks otel odasi standart daireden pahali olmalidir!"

    # 5. Recommendation by ID Test
    print("\n[TEST 5] POST /recommend (Ilan ID = 955886 ile Oneri Alma)")
    rec_payload_id = {
        "listing_id": 955886,
        "top_n": 4
    }
    res = client.post("/recommend", json=rec_payload_id)
    assert res.status_code == 200, f"Recommend ID failed: {res.text}"
    rec_data = res.json()
    print(f"Status: {res.status_code} | Oneri Sayisi: {rec_data['count']}")
    for r in rec_data["recommendations"]:
        print(f"  -> ID: {r['id']} | Skor: {r['similarity_score']:.4f} | Fiyat: {r['price']:,.2f} TL | {r['neighbourhood_cleansed']} | {r['name'][:40]}")
    assert len(rec_data["recommendations"]) == 4

    # 6. Recommendation by Query Text Test
    print("\n[TEST 6] POST /recommend (Serbest Metin Arama = 'sea view bosphorus flat besiktas')")
    rec_payload_query = {
        "query_text": "sea view bosphorus flat besiktas",
        "top_n": 3
    }
    res = client.post("/recommend", json=rec_payload_query)
    assert res.status_code == 200, f"Recommend Query failed: {res.text}"
    query_rec_data = res.json()
    print(f"Status: {res.status_code} | Oneri Sayisi: {query_rec_data['count']}")
    for r in query_rec_data["recommendations"]:
        print(f"  -> ID: {r['id']} | Skor: {r['similarity_score']:.4f} | Fiyat: {r['price']:,.2f} TL | {r['neighbourhood_cleansed']} | {r['name'][:40]}")
    assert len(query_rec_data["recommendations"]) == 3

    # 7. OpenAPI Schema Validation
    print("\n[TEST 7] GET /openapi.json (Swagger OpenAPI Semasi)")
    res = client.get("/openapi.json")
    assert res.status_code == 200, "OpenAPI schema failed"
    openapi_spec = res.json()
    print(f"Status: {res.status_code} | Baslik: {openapi_spec['info']['title']} | Endpoint Sayisi: {len(openapi_spec['paths'])}")

    print("\n" + "=" * 80)
    print("SUCCESS: TUM FASTAPI TESTLERI BASARIYLA GECTI!")
    print("=" * 80)

if __name__ == "__main__":
    test_all_endpoints()
