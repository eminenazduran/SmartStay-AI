using System.Collections.Generic;

namespace SmartStay.Core.DTOs.ML
{
    /// <summary>
    /// FastAPI ML servisi fiyat tahmin istek DTO'su.
    /// </summary>
    public class PricePredictionRequestDto
    {
        public int Accommodates { get; set; } = 2;
        public double Bedrooms { get; set; } = 1.0;
        public double Beds { get; set; } = 1.0;
        public double Bathrooms { get; set; } = 1.0;
        public double Latitude { get; set; } = 41.0082;
        public double Longitude { get; set; } = 28.9784;
        public int NumberOfReviews { get; set; } = 10;
        public double ReviewScoresRating { get; set; } = 4.8;
        public double ReviewsPerMonth { get; set; } = 1.2;
        public int MinimumNights { get; set; } = 1;
        public int Availability365 { get; set; } = 180;
        public string RoomType { get; set; } = "Entire home/apt";
        public string NeighbourhoodCleansed { get; set; } = "Kadikoy";
        public List<string> Amenities { get; set; } = new List<string> { "Wifi", "Kitchen", "Air conditioning", "Heating", "Hot water" };
    }

    /// <summary>
    /// FastAPI ML servisi fiyat tahmin yanit DTO'su.
    /// </summary>
    public class PricePredictionResponseDto
    {
        public bool Success { get; set; }
        public decimal PredictedPrice { get; set; }
        public string Currency { get; set; } = "TL";
        public string ModelVersion { get; set; } = "1.0.0";
        public string ModelName { get; set; } = "XGBoost Regressor";
        public string? Explanation { get; set; }
    }

    /// <summary>
    /// FastAPI ML servisi oneri istek DTO'su.
    /// </summary>
    public class RecommendationRequestDto
    {
        public long? ListingId { get; set; }
        public string? QueryText { get; set; }
        public int TopN { get; set; } = 5;
    }

    /// <summary>
    /// Onerilen tekil ilan nesnesi.
    /// </summary>
    public class RecommendedItemDto
    {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string NeighbourhoodCleansed { get; set; } = string.Empty;
        public string RoomType { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public double ReviewScoresRating { get; set; }
        public double SimilarityScore { get; set; }
    }

    /// <summary>
    /// FastAPI ML servisi oneri yanit DTO'su.
    /// </summary>
    public class RecommendationResponseDto
    {
        public bool Success { get; set; }
        public long? TargetId { get; set; }
        public string? QueryText { get; set; }
        public int Count { get; set; }
        public List<RecommendedItemDto> Recommendations { get; set; } = new List<RecommendedItemDto>();
    }
}
