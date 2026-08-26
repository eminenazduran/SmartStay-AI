from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Fiyat Tahmini (Price Prediction) Şemaları
# ---------------------------------------------------------------------------
class PricePredictionRequest(BaseModel):
    accommodates: int = Field(2, ge=1, le=30, description="Konaklayabilecek maksimum kişi sayısı")
    bedrooms: float = Field(1.0, ge=0.0, le=20.0, description="Yatak odası sayısı")
    beds: float = Field(1.0, ge=0.0, le=30.0, description="Yatak sayısı")
    bathrooms: float = Field(1.0, ge=0.0, le=15.0, description="Banyo sayısı")
    latitude: float = Field(41.0082, description="İlanın enlem koordinatı (Örn: 41.0082 - İstanbul)")
    longitude: float = Field(28.9784, description="İlanın boylam koordinatı (Örn: 28.9784 - İstanbul)")
    number_of_reviews: int = Field(10, ge=0, description="Toplam yorum sayısı")
    review_scores_rating: float = Field(4.8, ge=0.0, le=5.0, description="Kullanıcı puanı ortalaması (1.0 - 5.0)")
    reviews_per_month: float = Field(1.2, ge=0.0, description="Aylık ortalama yorum sayısı")
    minimum_nights: int = Field(1, ge=1, le=365, description="Minimum konaklama gecesi")
    availability_365: int = Field(180, ge=0, le=365, description="Yıl içerisindeki müsait gün sayısı")
    room_type: str = Field("Entire home/apt", description="Oda türü: Entire home/apt, Private room, Shared room, Hotel room")
    neighbourhood_cleansed: str = Field("Kadikoy", description="İlçe adı (Örn: Besiktas, Kadikoy, Beyoglu, Fatih, Sisli vb.)")
    amenities: Optional[List[str]] = Field(
        default=["Wifi", "Kitchen", "Air conditioning", "Heating", "TV", "Hot water"],
        description="İlanda sunulan olanaklar listesi"
    )

    model_config = {
        "json_schema_extra": {
            "example": {
                "accommodates": 3,
                "bedrooms": 1.0,
                "beds": 2.0,
                "bathrooms": 1.0,
                "latitude": 41.0422,
                "longitude": 29.0067,
                "number_of_reviews": 25,
                "review_scores_rating": 4.85,
                "reviews_per_month": 2.1,
                "minimum_nights": 2,
                "availability_365": 240,
                "room_type": "Entire home/apt",
                "neighbourhood_cleansed": "Besiktas",
                "amenities": ["Wifi", "Kitchen", "Air conditioning", "Heating", "Hot water", "Dedicated workspace"]
            }
        }
    }


class PricePredictionResponse(BaseModel):
    success: bool = True
    predicted_price: float = Field(..., description="Tahmin edilen gecelik konaklama fiyatı (TL)")
    currency: str = "TL"
    model_version: str = "1.0.0"
    model_name: str = "XGBoost Regressor"
    explanation: Optional[str] = "Model tarafından hesaplanan dinamik gecelik fiyat değerlemesi"


# ---------------------------------------------------------------------------
# Öneri Motoru (Recommender System) Şemaları
# ---------------------------------------------------------------------------
class RecommendationRequest(BaseModel):
    listing_id: Optional[int] = Field(None, description="Benzerleri aranacak mevcut ilan ID'si (Örn: 34177)")
    query_text: Optional[str] = Field(None, description="Serbest metin ile anlamsal arama sorgusu (Örn: 'sea view flat with terrace in besiktas')")
    top_n: int = Field(5, ge=1, le=50, description="Döndürülecek maksimum öneri sayısı")

    model_config = {
        "json_schema_extra": {
            "example": {
                "listing_id": 955886,
                "top_n": 5
            }
        }
    }


class RecommendedListing(BaseModel):
    id: int
    name: str
    neighbourhood_cleansed: str
    room_type: str
    price: float
    review_scores_rating: float
    similarity_score: float


class RecommendationResponse(BaseModel):
    success: bool = True
    target_id: Optional[int] = None
    query_text: Optional[str] = None
    count: int
    recommendations: List[RecommendedListing]


# ---------------------------------------------------------------------------
# Sistem Durum (Health Check) Şeması
# ---------------------------------------------------------------------------
class HealthCheckResponse(BaseModel):
    status: str = "healthy"
    service: str = "SmartStay AI Machine Learning Service"
    version: str = "1.0.0"
    loaded_models: Dict[str, bool]
