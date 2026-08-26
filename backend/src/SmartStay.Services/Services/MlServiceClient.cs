using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SmartStay.Core.DTOs.ML;
using SmartStay.Core.Interfaces.Services;

namespace SmartStay.Services.Services
{
    /// <summary>
    /// FastAPI ML servisiyle HTTP uzerinden haberlesen istemci sinifi.
    /// </summary>
    public class MlServiceClient : IMlServiceClient
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<MlServiceClient> _logger;
        private readonly string _baseUrl;

        public MlServiceClient(HttpClient httpClient, IConfiguration configuration, ILogger<MlServiceClient> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
            _baseUrl = configuration["MlService:BaseUrl"] ?? "http://127.0.0.1:8000";
            
            if (_httpClient.BaseAddress == null)
            {
                _httpClient.BaseAddress = new Uri(_baseUrl);
            }
        }

        public async Task<PricePredictionResponseDto?> PredictPriceAsync(PricePredictionRequestDto request)
        {
            try
            {
                var response = await _httpClient.PostAsJsonAsync("/predict", new
                {
                    accommodates = request.Accommodates,
                    bedrooms = request.Bedrooms,
                    beds = request.Beds,
                    bathrooms = request.Bathrooms,
                    latitude = request.Latitude,
                    longitude = request.Longitude,
                    number_of_reviews = request.NumberOfReviews,
                    review_scores_rating = request.ReviewScoresRating,
                    reviews_per_month = request.ReviewsPerMonth,
                    minimum_nights = request.MinimumNights,
                    availability_365 = request.Availability365,
                    room_type = request.RoomType,
                    neighbourhood_cleansed = request.NeighbourhoodCleansed,
                    amenities = request.Amenities
                });

                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadFromJsonAsync<JsonElement>();
                    return new PricePredictionResponseDto
                    {
                        Success = result.GetProperty("success").GetBoolean(),
                        PredictedPrice = result.GetProperty("predicted_price").GetDecimal(),
                        Currency = result.GetProperty("currency").GetString() ?? "TL",
                        ModelVersion = result.GetProperty("model_version").GetString() ?? "1.0.0",
                        ModelName = result.GetProperty("model_name").GetString() ?? "XGBoost Regressor",
                        Explanation = result.TryGetProperty("explanation", out var exp) ? exp.GetString() : null
                    };
                }

                _logger.LogWarning("FastAPI predict endpoint {StatusCode} dondu: {Body}", response.StatusCode, await response.Content.ReadAsStringAsync());
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "FastAPI predict cagrisi sirasinda hata olustu.");
                return null;
            }
        }

        public async Task<RecommendationResponseDto?> GetRecommendationsAsync(RecommendationRequestDto request)
        {
            try
            {
                var response = await _httpClient.PostAsJsonAsync("/recommend", new
                {
                    listing_id = request.ListingId,
                    query_text = request.QueryText,
                    top_n = request.TopN
                });

                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadFromJsonAsync<JsonElement>();
                    var responseDto = new RecommendationResponseDto
                    {
                        Success = result.GetProperty("success").GetBoolean(),
                        Count = result.GetProperty("count").GetInt32(),
                        TargetId = result.TryGetProperty("target_id", out var tId) && tId.ValueKind != JsonValueKind.Null ? tId.GetInt64() : null,
                        QueryText = result.TryGetProperty("query_text", out var qText) && qText.ValueKind != JsonValueKind.Null ? qText.GetString() : null
                    };

                    if (result.TryGetProperty("recommendations", out var recArray) && recArray.ValueKind == JsonValueKind.Array)
                    {
                        foreach (var item in recArray.EnumerateArray())
                        {
                            responseDto.Recommendations.Add(new RecommendedItemDto
                            {
                                Id = item.GetProperty("id").GetInt64(),
                                Name = item.GetProperty("name").GetString() ?? string.Empty,
                                NeighbourhoodCleansed = item.GetProperty("neighbourhood_cleansed").GetString() ?? string.Empty,
                                RoomType = item.GetProperty("room_type").GetString() ?? string.Empty,
                                Price = item.GetProperty("price").GetDecimal(),
                                ReviewScoresRating = item.GetProperty("review_scores_rating").GetDouble(),
                                SimilarityScore = item.GetProperty("similarity_score").GetDouble()
                            });
                        }
                    }

                    return responseDto;
                }

                _logger.LogWarning("FastAPI recommend endpoint {StatusCode} dondu: {Body}", response.StatusCode, await response.Content.ReadAsStringAsync());
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "FastAPI recommend cagrisi sirasinda hata olustu.");
                return null;
            }
        }

        public async Task<bool> CheckHealthAsync()
        {
            try
            {
                var response = await _httpClient.GetAsync("/health");
                return response.IsSuccessStatusCode;
            }
            catch
            {
                return false;
            }
        }
    }
}
