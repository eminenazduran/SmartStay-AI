import os
import re
import json
import logging
import joblib
import numpy as np
import pandas as pd
from typing import List, Dict, Any, Optional
from sklearn.metrics.pairwise import linear_kernel

logger = logging.getLogger("smartstay.ml_service")


def get_project_root() -> str:
    current = os.path.abspath(__file__)
    while True:
        parent = os.path.dirname(current)
        if os.path.exists(os.path.join(parent, "data_science", "models")):
            return parent
        if parent == current:
            break
        current = parent
    return os.getcwd()


PROJECT_ROOT = get_project_root()
DATA_SCIENCE_MODELS_DIR = os.path.join(PROJECT_ROOT, "data_science", "models")
DATA_SCIENCE_DATA_DIR = os.path.join(PROJECT_ROOT, "data_science", "data", "processed")
APP_MODELS_DIR = os.path.join(PROJECT_ROOT, "ml_service", "app", "models")
APP_DATA_DIR = os.path.join(PROJECT_ROOT, "ml_service", "app", "data")


def _find_path(filename: str, search_dirs: List[str]) -> str:
    for directory in search_dirs:
        full_path = os.path.join(directory, filename)
        if os.path.exists(full_path):
            return full_path
    raise FileNotFoundError(f"Dosya bulunamadi: {filename} (Aranan dizinler: {search_dirs})")


class PricePredictor:
    """
    SmartStay AI Fiyat Degerleme Motoru (XGBoost Regressor).
    Gelen istek parametrelerini modelin bekledigi 82 oznitelikli girdi vektorune donusturur.
    """
    def __init__(self):
        self.model = None
        self.feature_metadata = None
        self.expected_columns = []
        self.numeric_features = []
        self.amenity_features = []
        self.categorical_features = []
        self.is_loaded = False
        self._load_model()

    def _load_model(self):
        try:
            model_path = _find_path(
                "xgboost_price_model.joblib",
                [DATA_SCIENCE_MODELS_DIR, APP_MODELS_DIR]
            )
            json_path = _find_path(
                "model_features.json",
                [DATA_SCIENCE_MODELS_DIR, APP_MODELS_DIR]
            )

            self.model = joblib.load(model_path)
            with open(json_path, "r", encoding="utf-8") as f:
                self.feature_metadata = json.load(f)

            self.expected_columns = self.feature_metadata.get("expected_columns", [])
            self.numeric_features = self.feature_metadata.get("numeric_features", [])
            self.amenity_features = self.feature_metadata.get("amenity_features", [])
            self.categorical_features = self.feature_metadata.get("categorical_features", [])
            self.is_loaded = True
            logger.info(f"PricePredictor basariyla yuklendi. (Kolon sayisi: {len(self.expected_columns)})")
        except Exception as e:
            logger.error(f"PricePredictor yuklenirken hata olustu: {str(e)}")
            self.is_loaded = False

    def predict(self, data: Dict[str, Any]) -> float:
        if not self.is_loaded:
            raise RuntimeError("Fiyat tahmin modeli yuklenemedi.")

        input_row = pd.DataFrame(0, index=[0], columns=self.expected_columns, dtype=np.float32)

        # 1. Sayisal degiskenler
        for num_col in self.numeric_features:
            if num_col in data and data[num_col] is not None:
                input_row[num_col] = float(data[num_col])

        # 2. Ikili olanaklar (amenity_*)
        user_amenities = data.get("amenities", []) or []
        user_amenities_set = {
            re.sub(r'[^a-zA-Z0-9]', '', a.lower()) for a in user_amenities if isinstance(a, str)
        }

        for amenity_col in self.amenity_features:
            clean_amenity_name = amenity_col.replace("amenity_", "").replace("_", "")
            is_present = any(clean_amenity_name in item for item in user_amenities_set)
            input_row[amenity_col] = 1 if is_present else 0

        # 3. Kategorik degiskenler (One-Hot Encoding)
        room_type = data.get("room_type")
        if room_type:
            room_type_col = f"room_type_{room_type}"
            if room_type_col in input_row.columns:
                input_row[room_type_col] = 1

        neighbourhood = data.get("neighbourhood_cleansed")
        if neighbourhood:
            neighbourhood_col = f"neighbourhood_cleansed_{neighbourhood}"
            if neighbourhood_col in input_row.columns:
                input_row[neighbourhood_col] = 1

        predicted_raw = self.model.predict(input_row)[0]
        predicted_price = max(100.0, float(predicted_raw))
        return round(predicted_price, 2)


class ListingRecommender:
    """
    SmartStay AI Icerik Tabanli Oneri Motoru (TF-IDF & Cosine Similarity).
    Ilan ID'si veya metin aramasi ile en benzer ilanlari bulur.
    """
    def __init__(self):
        self.recommender_matrix = {}
        self.tfidf_vectorizer = None
        self.tfidf_matrix = None
        self.listings_df = None
        self.indices = None
        self.is_loaded = False
        self._load_models()

    def _load_models(self):
        try:
            # 1. Dataset
            data_file = _find_path(
                "cleaned_listings.csv",
                [DATA_SCIENCE_DATA_DIR, APP_DATA_DIR]
            )
            self.listings_df = pd.read_csv(data_file)
            self.indices = pd.Series(self.listings_df.index, index=self.listings_df["id"]).drop_duplicates()

            # 2. Recommender Matrix (Precomputed top-20)
            rec_matrix_path = _find_path(
                "recommender_matrix.joblib",
                [DATA_SCIENCE_MODELS_DIR, APP_MODELS_DIR]
            )
            self.recommender_matrix = joblib.load(rec_matrix_path)

            # 3. TF-IDF Vectorizer & Matrix (Live search queries)
            vec_path = _find_path(
                "tfidf_vectorizer.joblib",
                [DATA_SCIENCE_MODELS_DIR, APP_MODELS_DIR]
            )
            matrix_path = _find_path(
                "tfidf_matrix.joblib",
                [DATA_SCIENCE_MODELS_DIR, APP_MODELS_DIR]
            )
            self.tfidf_vectorizer = joblib.load(vec_path)
            self.tfidf_matrix = joblib.load(matrix_path)

            self.is_loaded = True
            logger.info(f"ListingRecommender basariyla yuklendi. (Toplam ilan: {len(self.listings_df):,})")
        except Exception as e:
            logger.error(f"ListingRecommender yuklenirken hata olustu: {str(e)}")
            self.is_loaded = False

    def recommend_by_id(self, listing_id: int, top_n: int = 5) -> List[Dict[str, Any]]:
        if not self.is_loaded:
            raise RuntimeError("Oneri motoru yuklenemedi.")

        # 1. Onceden hesaplanmis matristen anlik O(1) sorgu
        if listing_id in self.recommender_matrix:
            cached_data = self.recommender_matrix[listing_id]
            rec_ids = cached_data.get("recommended_ids", [])[:top_n]
            scores = cached_data.get("similarity_scores", [])[:top_n]

            results = []
            for target_rec_id, score in zip(rec_ids, scores):
                if target_rec_id in self.indices:
                    idx = self.indices[target_rec_id]
                    row = self.listings_df.iloc[idx]
                    results.append({
                        "id": int(row["id"]),
                        "name": str(row["name"]),
                        "neighbourhood_cleansed": str(row["neighbourhood_cleansed"]),
                        "room_type": str(row["room_type"]),
                        "price": float(row["price"]),
                        "review_scores_rating": float(row.get("review_scores_rating", 0.0)),
                        "similarity_score": round(float(score), 4)
                    })
            return results

        # 2. Matriste yoksa canli TF-IDF benzerligi hesaplama
        if listing_id not in self.indices:
            raise ValueError(f"Ilan ID {listing_id} veri setinde bulunamadi.")

        idx = self.indices[listing_id]
        target_vec = self.tfidf_matrix[idx]
        sim_scores = linear_kernel(target_vec, self.tfidf_matrix).flatten()

        top_indices = np.argpartition(sim_scores, -(top_n + 1))[-(top_n + 1):]
        top_indices = top_indices[np.argsort(sim_scores[top_indices])[::-1]]
        filtered_indices = [i for i in top_indices if i != idx][:top_n]

        results = []
        for f_idx in filtered_indices:
            row = self.listings_df.iloc[f_idx]
            results.append({
                "id": int(row["id"]),
                "name": str(row["name"]),
                "neighbourhood_cleansed": str(row["neighbourhood_cleansed"]),
                "room_type": str(row["room_type"]),
                "price": float(row["price"]),
                "review_scores_rating": float(row.get("review_scores_rating", 0.0)),
                "similarity_score": round(float(sim_scores[f_idx]), 4)
            })
        return results

    def recommend_by_query(self, query_text: str, top_n: int = 5) -> List[Dict[str, Any]]:
        if not self.is_loaded:
            raise RuntimeError("Oneri motoru yuklenemedi.")

        clean_q = re.sub(r'[^a-zA-Z\s]', ' ', query_text).lower().strip()
        query_vec = self.tfidf_vectorizer.transform([clean_q])

        sim_scores = linear_kernel(query_vec, self.tfidf_matrix).flatten()
        top_indices = np.argpartition(sim_scores, -top_n)[-top_n:]
        top_indices = top_indices[np.argsort(sim_scores[top_indices])[::-1]]

        results = []
        for f_idx in top_indices:
            row = self.listings_df.iloc[f_idx]
            results.append({
                "id": int(row["id"]),
                "name": str(row["name"]),
                "neighbourhood_cleansed": str(row["neighbourhood_cleansed"]),
                "room_type": str(row["room_type"]),
                "price": float(row["price"]),
                "review_scores_rating": float(row.get("review_scores_rating", 0.0)),
                "similarity_score": round(float(sim_scores[f_idx]), 4)
            })
        return results


# Servis singleton nesneleri
price_predictor = PricePredictor()
listing_recommender = ListingRecommender()
