using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using SmartStay.Core.DTOs.Common;
using SmartStay.Core.DTOs.Listings;
using SmartStay.Core.DTOs.ML;
using SmartStay.Core.Entities;
using SmartStay.Core.Interfaces.Repositories;
using SmartStay.Core.Interfaces.Services;

namespace SmartStay.Services.Services
{
    /// <summary>
    /// Ilan yonetimi ve ML servis koordinasyonunu saglayan is mantigi servisi.
    /// </summary>
    public class ListingsService : IListingsService
    {
        private readonly IListingsRepository _listingsRepository;
        private readonly IMlServiceClient _mlServiceClient;
        private readonly ILogger<ListingsService> _logger;

        public ListingsService(
            IListingsRepository listingsRepository,
            IMlServiceClient mlServiceClient,
            ILogger<ListingsService> logger)
        {
            _listingsRepository = listingsRepository;
            _mlServiceClient = mlServiceClient;
            _logger = logger;
        }

        public async Task<ApiResponse<IEnumerable<ListingSummaryDto>>> GetListingsAsync(ListingFilterDto filter)
        {
            try
            {
                var entities = await _listingsRepository.GetAllAsync(filter);
                var dtos = entities.Select(MapToSummaryDto).ToList();
                return ApiResponse<IEnumerable<ListingSummaryDto>>.SuccessResponse(dtos, $"{dtos.Count} adet ilan listelendi.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ilanlar listelenirken hata olustu.");
                return ApiResponse<IEnumerable<ListingSummaryDto>>.ErrorResponse("Ilanlar listelenirken bir hata meydana geldi.");
            }
        }

        public async Task<ApiResponse<ListingDto>> GetListingByIdAsync(long id)
        {
            try
            {
                var entity = await _listingsRepository.GetByIdAsync(id);
                if (entity == null)
                    return ApiResponse<ListingDto>.ErrorResponse($"ID'si {id} olan ilan bulunamadi.");

                var dto = MapToDetailDto(entity);
                var reviews = await _listingsRepository.GetReviewsByListingIdAsync(id, 3);
                dto.Reviews = reviews.Select(r => new ReviewDto
                {
                    Author = r.Author,
                    Location = r.Location ?? "Doğrulanmış Misafir",
                    Date = r.Date ?? string.Empty,
                    Rating = r.Rating,
                    Comment = r.Comment
                }).ToList();

                return ApiResponse<ListingDto>.SuccessResponse(dto, "Ilan detaylari basariyla getirildi.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ilan detayi getirilirken hata olustu. ID: {Id}", id);
                return ApiResponse<ListingDto>.ErrorResponse("Ilan getirilirken bir hata meydana geldi.");
            }
        }

        public async Task<ApiResponse<IEnumerable<ListingSummaryDto>>> GetFeaturedListingsAsync(int count = 6)
        {
            try
            {
                var entities = await _listingsRepository.GetFeaturedAsync(count);
                var dtos = entities.Select(MapToSummaryDto).ToList();
                return ApiResponse<IEnumerable<ListingSummaryDto>>.SuccessResponse(dtos, "One cikan ilanlar basariyla getirildi.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "One cikan ilanlar getirilirken hata olustu.");
                return ApiResponse<IEnumerable<ListingSummaryDto>>.ErrorResponse("One cikan ilanlar yuklenemedi.");
            }
        }

        public async Task<ApiResponse<PricePredictionResponseDto>> PredictPriceAsync(PricePredictionRequestDto request)
        {
            try
            {
                var result = await _mlServiceClient.PredictPriceAsync(request);
                if (result != null && result.Success)
                {
                    return ApiResponse<PricePredictionResponseDto>.SuccessResponse(result, "Fiyat tahmini basariyla hesaplandi.");
                }

                return ApiResponse<PricePredictionResponseDto>.ErrorResponse("ML servisi fiyat tahmini uretemedi.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Fiyat tahmini sirasinda hata meydana geldi.");
                return ApiResponse<PricePredictionResponseDto>.ErrorResponse("Fiyat tahmini yapilirken bir sunucu hatasi olustu.");
            }
        }

        public async Task<ApiResponse<RecommendationResponseDto>> GetRecommendationsAsync(RecommendationRequestDto request)
        {
            try
            {
                var result = await _mlServiceClient.GetRecommendationsAsync(request);
                if (result != null && result.Success)
                {
                    return ApiResponse<RecommendationResponseDto>.SuccessResponse(result, $"{result.Count} adet benzer konaklama onerisi bulundu.");
                }

                return ApiResponse<RecommendationResponseDto>.ErrorResponse("Oneri motorundan yanit alinamadi.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Oneri servisi cagrilirken hata meydana geldi.");
                return ApiResponse<RecommendationResponseDto>.ErrorResponse("Oneriler getirilirken bir sunucu hatasi olustu.");
            }
        }

        private static ListingSummaryDto MapToSummaryDto(Listing entity)
        {
            return new ListingSummaryDto
            {
                Id = entity.Id,
                Name = entity.Name,
                NeighbourhoodCleansed = entity.NeighbourhoodCleansed,
                RoomType = entity.RoomType,
                Price = entity.Price,
                ReviewScoresRating = entity.ReviewScoresRating,
                NumberOfReviews = entity.NumberOfReviews,
                Accommodates = entity.Accommodates,
                Bedrooms = entity.Bedrooms,
                Bathrooms = entity.Bathrooms,
                Beds = entity.Beds,
                Latitude = entity.Latitude,
                Longitude = entity.Longitude,
                PictureUrl = entity.PictureUrl,
                HostName = entity.HostName,
                HostPictureUrl = entity.HostPictureUrl
            };
        }

        private static ListingDto MapToDetailDto(Listing entity)
        {
            var amenitiesList = string.IsNullOrWhiteSpace(entity.Amenities)
                ? new List<string>()
                : entity.Amenities.Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries).ToList();

            return new ListingDto
            {
                Id = entity.Id,
                Name = entity.Name,
                Description = entity.Description,
                NeighbourhoodCleansed = entity.NeighbourhoodCleansed,
                RoomType = entity.RoomType,
                Price = entity.Price,
                Accommodates = entity.Accommodates,
                Bedrooms = entity.Bedrooms,
                Beds = entity.Beds,
                Bathrooms = entity.Bathrooms,
                Latitude = entity.Latitude,
                Longitude = entity.Longitude,
                NumberOfReviews = entity.NumberOfReviews,
                ReviewScoresRating = entity.ReviewScoresRating,
                ReviewsPerMonth = entity.ReviewsPerMonth,
                MinimumNights = entity.MinimumNights,
                Availability365 = entity.Availability365,
                Amenities = amenitiesList,
                PictureUrl = entity.PictureUrl,
                HostName = entity.HostName,
                HostPictureUrl = entity.HostPictureUrl,
                HostUrl = entity.HostUrl,
                HostSinceYears = entity.HostSinceYears,
                HostIsSuperhost = entity.HostIsSuperhost,
                HostIdentityVerified = entity.HostIdentityVerified,
                ListingUrl = entity.ListingUrl,
                FirstReview = entity.FirstReview,
                LastReview = entity.LastReview,
                ReviewScoresCleanliness = entity.ReviewScoresCleanliness,
                ReviewScoresLocation = entity.ReviewScoresLocation,
                ReviewScoresCommunication = entity.ReviewScoresCommunication,
                ReviewScoresAccuracy = entity.ReviewScoresAccuracy,
                ReviewScoresCheckin = entity.ReviewScoresCheckin,
                ReviewScoresValue = entity.ReviewScoresValue
            };
        }
    }
}
