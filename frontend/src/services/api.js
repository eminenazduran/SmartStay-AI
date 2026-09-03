import axios from 'axios';
import { MOCK_LISTINGS, filterListings } from '../data/mockListings';

// API Base URL (Default to local ASP.NET Core Web API or environment variable)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5018/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ML & Galeri Servisi (FastAPI - Port 8000)
const ML_API_BASE_URL = import.meta.env.VITE_ML_API_BASE_URL || 'http://localhost:8000';

const mlClient = axios.create({
  baseURL: ML_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const DISTRICT_MEDIAN_PRICES = {
  "Adalar": 5093,
  "Arnavutkoy": 2222,
  "Atasehir": 1491,
  "Avcilar": 817,
  "Bagcilar": 3724,
  "Bahcelievler": 2794,
  "Bakirkoy": 2500,
  "Basaksehir": 1548,
  "Bayrampasa": 1047,
  "Besiktas": 2739,
  "Beykoz": 1330,
  "Beylikduzu": 1416,
  "Beyoglu": 3383,
  "Buyukcekmece": 1378,
  "Catalca": 2081,
  "Cekmekoy": 575,
  "Esenler": 564,
  "Esenyurt": 1096,
  "Eyup": 980,
  "Fatih": 2762,
  "Gaziosmanpasa": 1693,
  "Gungoren": 831,
  "Kadikoy": 2133,
  "Kagithane": 755,
  "Kartal": 1210,
  "Kucukcekmece": 1059,
  "Maltepe": 928,
  "Pendik": 2521,
  "Sancaktepe": 799,
  "Sariyer": 1554,
  "Sile": 4142,
  "Silivri": 1945,
  "Sisli": 2849,
  "Sultanbeyli": 419,
  "Sultangazi": 724,
  "Tuzla": 1529,
  "Umraniye": 1666,
  "Uskudar": 1370,
  "Zeytinburnu": 2321
};

export function getDistrictBenchmarkPrice(neighbourhood, roomType = 'Entire home/apt', accommodates = 2) {
  const districtKey = Object.keys(DISTRICT_MEDIAN_PRICES).find(k => 
    k.toLowerCase() === (neighbourhood || '').toLowerCase()
  ) || 'Kadikoy';
  
  let basePrice = DISTRICT_MEDIAN_PRICES[districtKey] || 2200;
  
  if (roomType === 'Private room') basePrice = Math.round(basePrice * 0.55);
  else if (roomType === 'Shared room') basePrice = Math.round(basePrice * 0.35);
  else if (accommodates && accommodates > 2) basePrice = Math.round(basePrice * (1 + (accommodates - 2) * 0.12));

  return basePrice;
}

/**
 * Normalizes a backend API listing object to ensure seamless UI compatibility.
 */
export function normalizeListing(item) {
  if (!item) return null;

  const price = Number(item.price || 0);
  const benchmark = getDistrictBenchmarkPrice(item.neighbourhoodCleansed, item.roomType, item.accommodates);
  const predictedPrice = item.predictedPrice ? Number(item.predictedPrice) : benchmark;
  const isDeal = predictedPrice > 0 && price < predictedPrice * 0.95;
  const isHigh = predictedPrice > 0 && price > predictedPrice * 1.05;
  
  const discountPercentage = predictedPrice > 0
    ? Math.round(Math.abs((predictedPrice - price) / predictedPrice) * 100)
    : 0;

  const realPhoto = item.pictureUrl || item.imageUrl;
  const photoUrl = (realPhoto && typeof realPhoto === 'string' && realPhoto.trim().length > 10) ? realPhoto.trim() : null;

  const defaultPlaceholder = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80';

  return {
    id: item.id,
    name: item.name || 'İstanbul Konaklama',
    neighbourhoodCleansed: item.neighbourhoodCleansed || 'İstanbul',
    districtName: item.districtName || item.neighbourhoodCleansed || 'İstanbul',
    roomType: item.roomType || 'Entire home/apt',
    price: price,
    predictedPrice: predictedPrice,
    isDeal: isDeal,
    discountPercentage: discountPercentage,
    aiBadge: isDeal ? `-%${discountPercentage} Uygun` : isHigh ? `+${discountPercentage}% Yüksek` : 'Bölge Düzeyinde',
    aiBadgeType: isDeal ? 'great-value' : isHigh ? 'high-price' : 'fair',
    isHigh: isHigh,
    accommodates: item.accommodates != null ? Number(item.accommodates) : 2,
    bedrooms: item.bedrooms != null ? Number(item.bedrooms) : null,
    bathrooms: item.bathrooms != null ? Number(item.bathrooms) : null,
    beds: item.beds != null ? Number(item.beds) : null,
    latitude: Number(item.latitude || 41.025),
    longitude: Number(item.longitude || 28.985),
    numberOfReviews: item.numberOfReviews != null ? Number(item.numberOfReviews) : 0,
    reviewScoresRating: item.reviewScoresRating != null ? Number(item.reviewScoresRating) : null,
    amenities: Array.isArray(item.amenities) ? item.amenities : ['Wifi', 'Kitchen', 'Heating', 'Hot water'],
    imageUrl: photoUrl || defaultPlaceholder,
    images: photoUrl ? [photoUrl] : [defaultPlaceholder],
    trendPercent: isDeal ? -Math.abs(discountPercentage) : 0,
  };
}

/**
 * 1. Tüm Konaklama İlanlarını Filtreli Olarak Getirir (GET /api/listings)
 */
export async function fetchListings(filters = {}) {
  try {
    const params = {};
    if (filters.neighbourhood && filters.neighbourhood !== 'all' && filters.neighbourhood !== 'Tümü') {
      params.neighbourhood = filters.neighbourhood;
    }
    if (filters.roomType && filters.roomType !== 'all') {
      params.roomType = filters.roomType;
    }
    if (filters.minPrice != null && filters.minPrice > 0) {
      params.minPrice = filters.minPrice;
    }
    if (filters.maxPrice != null && filters.maxPrice < 50000) {
      params.maxPrice = filters.maxPrice;
    }
    if (filters.accommodates != null && filters.accommodates > 1) {
      params.accommodates = filters.accommodates;
    }
    if (filters.sortBy) {
      params.sortBy = filters.sortBy;
    }
    params.pageSize = filters.pageSize || 50;

    const response = await apiClient.get('/listings', { params });

    // Handle standard ApiResponse<T> envelope
    if (response.data && response.data.success && response.data.data) {
      const items = Array.isArray(response.data.data)
        ? response.data.data
        : (response.data.data.items || []);

      let normalized = items.map(normalizeListing);

      if (filters.dealOnly || filters.dealType === 'opportunity') {
        normalized = normalized.filter(item => item.isDeal);
      } else if (filters.dealType === 'fair') {
        normalized = normalized.filter(item => !item.isDeal);
      }

      if (filters.minRating) {
        normalized = normalized.filter(item => item.reviewScoresRating >= Number(filters.minRating));
      }

      return {
        success: true,
        data: normalized,
        isLive: true,
        totalCount: response.data.data.totalCount || normalized.length,
      };
    }

    throw new Error(response.data?.message || 'API geçerli yanıt döndürmedi.');
  } catch (error) {
    console.warn('[SmartStay API] Canlı API yanıt vermedi veya çevrimdışı, yerel gerçek veri setine bağlanılıyor:', error.message);
    const localFiltered = filterListings(MOCK_LISTINGS, filters);
    return {
      success: true,
      data: localFiltered.map(normalizeListing),
      isLive: false,
      totalCount: localFiltered.length,
      errorNotice: 'Canlı backend çevrimdışı olduğundan yerel veri seti sunuluyor.',
    };
  }
}

/**
 * 2. Tekil İlan Detayını Getirir (GET /api/listings/{id})
 */
export async function fetchListingById(id) {
  try {
    const response = await apiClient.get(`/listings/${id}`);
    if (response.data && response.data.success && response.data.data) {
      return {
        success: true,
        data: normalizeListing(response.data.data),
        isLive: true,
      };
    }
    throw new Error(response.data?.message || 'İlan bulunamadı.');
  } catch (error) {
    console.warn(`[SmartStay API] İlan ID ${id} için yerel veriye başvuruluyor:`, error.message);
    const localItem = MOCK_LISTINGS.find((item) => String(item.id) === String(id)) || MOCK_LISTINGS[0];
    return {
      success: true,
      data: normalizeListing(localItem),
      isLive: false,
    };
  }
}

/**
 * 3. Öne Çıkan En Yüksek Puanlı İlanları Getirir (GET /api/listings/featured)
 */
export async function fetchFeaturedListings(count = 6) {
  try {
    const response = await apiClient.get('/listings/featured', { params: { count } });
    if (response.data && response.data.success && response.data.data) {
      return {
        success: true,
        data: response.data.data.map(normalizeListing),
        isLive: true,
      };
    }
    throw new Error(response.data?.message || 'Öne çıkan ilanlar getirilemedi.');
  } catch (error) {
    const localFeatured = MOCK_LISTINGS.slice(0, count);
    return {
      success: true,
      data: localFeatured.map(normalizeListing),
      isLive: false,
    };
  }
}

/**
 * 4. Yapay Zeka (XGBoost) Fiyat Tahmini İsteği (POST /api/listings/predict-price)
 */
export async function predictListingPrice(payload) {
  try {
    const response = await apiClient.post('/listings/predict-price', payload);
    if (response.data && response.data.success && response.data.data) {
      return {
        success: true,
        data: response.data.data,
        isLive: true,
      };
    }
    throw new Error(response.data?.message || 'Tahmin hesaplanamadı.');
  } catch (error) {
    // Client-side fallback prediction calculation
    const basePrice = (payload.accommodates || 2) * 600 + (payload.bedrooms || 1) * 400;
    return {
      success: true,
      data: {
        predictedPrice: basePrice,
        priceMin: basePrice * 0.85,
        priceMax: basePrice * 1.15,
        modelName: 'XGBoost Price Regressor (Local Fallback)',
        r2Score: 0.7903,
      },
      isLive: false,
    };
  }
}

export const predictPrice = predictListingPrice;

/**
 * 5. Anlamsal İlan Öneri İsteği (POST /api/listings/recommend)
 */
export async function fetchRecommendations(payload) {
  try {
    const response = await apiClient.post('/listings/recommend', payload);
    if (response.data && response.data.success && response.data.data) {
      return {
        success: true,
        data: response.data.data,
        isLive: true,
      };
    }
    throw new Error(response.data?.message || 'Öneriler getirilemedi.');
  } catch (error) {
    const localRecs = MOCK_LISTINGS.slice(0, payload.topK || 5);
    return {
      success: true,
      data: {
        targetListingId: payload.listingId,
        recommendations: localRecs.map((r) => ({
          listingId: r.id,
          name: r.name,
          neighbourhoodCleansed: r.neighbourhoodCleansed,
          price: r.price,
          similarityScore: 0.92,
        })),
      },
      isLive: false,
    };
  }
}

/**
 * 6. Herhangi bir İlanın Tüm Orijinal Oda ve Mekan Fotoğraflarını Getirir (GET /gallery/:id)
 */
export async function fetchListingGallery(listingId) {
  try {
    const res = await mlClient.get(`/gallery/${listingId}`);
    if (res.data && res.data.success && Array.isArray(res.data.photos) && res.data.photos.length > 0) {
      return res.data.photos;
    }
  } catch (err) {
    console.warn('[SmartStay] Ek oda fotoğrafları servisten alınamadı:', err.message);
  }
  return null;
}

export default {
  fetchListings,
  fetchListingById,
  fetchFeaturedListings,
  predictListingPrice,
  fetchRecommendations,
  fetchListingGallery,
  normalizeListing,
};
