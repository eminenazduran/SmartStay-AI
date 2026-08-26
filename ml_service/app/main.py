from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any

from app.schemas import (
    PricePredictionRequest,
    PricePredictionResponse,
    RecommendationRequest,
    RecommendationResponse,
    HealthCheckResponse
)
from app.services.predictor import price_predictor, listing_recommender

app = FastAPI(
    title="SmartStay AI — Machine Learning API",
    description="Dinamik Fiyat Değerleme (XGBoost) ve İçerik Tabanlı Öneri Motoru (TF-IDF & Cosine Similarity) Mikroservisi.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Yapılandırması
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Genel"])
def root():
    """
    API Kök Dizin ve Servis Bilgisi.
    """
    return {
        "service": "SmartStay AI Machine Learning Service",
        "version": "1.0.0",
        "docs_url": "/docs",
        "endpoints": {
            "health": "/health",
            "price_prediction": "/predict",
            "recommendations": "/recommend"
        }
    }


@app.get("/health", response_model=HealthCheckResponse, tags=["Sistem"])
def health_check():
    """
    Mikroservis sağlık ve model yüklenme durumunu kontrol eder.
    """
    return HealthCheckResponse(
        status="healthy" if (price_predictor.is_loaded and listing_recommender.is_loaded) else "degraded",
        service="SmartStay AI Machine Learning Service",
        version="1.0.0",
        loaded_models={
            "price_predictor": price_predictor.is_loaded,
            "listing_recommender": listing_recommender.is_loaded
        }
    )


@app.post("/predict", response_model=PricePredictionResponse, tags=["Fiyat Değerleme"])
def predict_price(request: PricePredictionRequest):
    """
    Verilen konaklama parametrelerine (kapasite, konum, oda türü, olanaklar vb.) göre
    eğitilmiş XGBoost modeli üzerinden dinamik gecelik fiyat tahmini (TL) üretir.
    """
    try:
        data_dict = request.model_dump()
        predicted_price = price_predictor.predict(data_dict)
        return PricePredictionResponse(
            success=True,
            predicted_price=predicted_price,
            currency="TL",
            model_version="1.0.0",
            model_name="XGBoost Regressor",
            explanation=f"{request.neighbourhood_cleansed} ilçesinde {request.room_type} için hesaplanan dinamik değerleme."
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Fiyat tahmini üretilirken hata oluştu: {str(e)}"
        )


@app.post("/recommend", response_model=RecommendationResponse, tags=["Öneri Motoru"])
def get_recommendations(request: RecommendationRequest):
    """
    Belirli bir ilan ID'si (`listing_id`) veya serbest arama metni (`query_text`) için
    TF-IDF ve Kosinüs Benzerliği tabanlı en yakın konaklama önerilerini döndürür.
    """
    try:
        if request.listing_id is not None:
            recs = listing_recommender.recommend_by_id(request.listing_id, top_n=request.top_n)
            return RecommendationResponse(
                success=True,
                target_id=request.listing_id,
                count=len(recs),
                recommendations=recs
            )
        elif request.query_text:
            recs = listing_recommender.recommend_by_query(request.query_text, top_n=request.top_n)
            return RecommendationResponse(
                success=True,
                query_text=request.query_text,
                count=len(recs),
                recommendations=recs
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Lütfen 'listing_id' veya 'query_text' parametrelerinden en az birini belirtin."
            )
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(ve)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Öneri üretilirken hata oluştu: {str(e)}"
        )
