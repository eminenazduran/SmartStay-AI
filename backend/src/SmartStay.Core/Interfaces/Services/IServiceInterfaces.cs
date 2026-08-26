using System.Collections.Generic;
using System.Threading.Tasks;
using SmartStay.Core.DTOs.Common;
using SmartStay.Core.DTOs.Listings;
using SmartStay.Core.DTOs.ML;

namespace SmartStay.Core.Interfaces.Services
{
    /// <summary>
    /// Ilan is mantigi servis arayuzu.
    /// </summary>
    public interface IListingsService
    {
        Task<ApiResponse<IEnumerable<ListingSummaryDto>>> GetListingsAsync(ListingFilterDto filter);
        Task<ApiResponse<ListingDto>> GetListingByIdAsync(long id);
        Task<ApiResponse<IEnumerable<ListingSummaryDto>>> GetFeaturedListingsAsync(int count = 6);
        Task<ApiResponse<PricePredictionResponseDto>> PredictPriceAsync(PricePredictionRequestDto request);
        Task<ApiResponse<RecommendationResponseDto>> GetRecommendationsAsync(RecommendationRequestDto request);
    }

    /// <summary>
    /// Python FastAPI ML mikroservisi istemci arayuzu.
    /// </summary>
    public interface IMlServiceClient
    {
        Task<PricePredictionResponseDto?> PredictPriceAsync(PricePredictionRequestDto request);
        Task<RecommendationResponseDto?> GetRecommendationsAsync(RecommendationRequestDto request);
        Task<bool> CheckHealthAsync();
    }
}
