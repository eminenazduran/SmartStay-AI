using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SmartStay.Core.DTOs.Common;
using SmartStay.Core.DTOs.Listings;
using SmartStay.Core.DTOs.ML;
using SmartStay.Core.Interfaces.Services;

namespace SmartStay.API.Controllers
{
    /// <summary>
    /// Konaklama ilanlari, fiyat degerleme ve oneri motoru endpoint'lerini sunan controller.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class ListingsController : ControllerBase
    {
        private readonly IListingsService _listingsService;
        private readonly IMlServiceClient _mlServiceClient;

        public ListingsController(IListingsService listingsService, IMlServiceClient mlServiceClient)
        {
            _listingsService = listingsService;
            _mlServiceClient = mlServiceClient;
        }

        /// <summary>
        /// Filtrelenebilir ve sayfalanabilir konaklama ilanlari listesi.
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<ListingSummaryDto>>), 200)]
        public async Task<IActionResult> GetListings([FromQuery] ListingFilterDto filter)
        {
            var result = await _listingsService.GetListingsAsync(filter);
            return Ok(result);
        }

        /// <summary>
        /// ID'ye gore tekil konaklama ilani detaylari.
        /// </summary>
        [HttpGet("{id:long}")]
        [ProducesResponseType(typeof(ApiResponse<ListingDto>), 200)]
        [ProducesResponseType(typeof(ApiResponse<ListingDto>), 404)]
        public async Task<IActionResult> GetListingById(long id)
        {
            var result = await _listingsService.GetListingByIdAsync(id);
            if (!result.Success)
                return NotFound(result);

            return Ok(result);
        }

        /// <summary>
        /// Ana sayfa icin secilmis one cikan ilanlar.
        /// </summary>
        [HttpGet("featured")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<ListingSummaryDto>>), 200)]
        public async Task<IActionResult> GetFeaturedListings([FromQuery] int count = 6)
        {
            var result = await _listingsService.GetFeaturedListingsAsync(count);
            return Ok(result);
        }

        /// <summary>
        /// Konaklama ozelliklerine gore yapay zeka destekli dinamik fiyat tahmini.
        /// </summary>
        [HttpPost("predict-price")]
        [ProducesResponseType(typeof(ApiResponse<PricePredictionResponseDto>), 200)]
        [ProducesResponseType(typeof(ApiResponse<PricePredictionResponseDto>), 400)]
        public async Task<IActionResult> PredictPrice([FromBody] PricePredictionRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<PricePredictionResponseDto>.ErrorResponse("Gecersiz parametreler gonderildi."));

            var result = await _listingsService.PredictPriceAsync(request);
            if (!result.Success)
                return StatusCode(502, result);

            return Ok(result);
        }

        /// <summary>
        /// Belirli bir ilan veya serbest metin aramasi icin benzer ilan onerileri.
        /// </summary>
        [HttpPost("recommend")]
        [ProducesResponseType(typeof(ApiResponse<RecommendationResponseDto>), 200)]
        [ProducesResponseType(typeof(ApiResponse<RecommendationResponseDto>), 400)]
        public async Task<IActionResult> GetRecommendations([FromBody] RecommendationRequestDto request)
        {
            if (request.ListingId == null && string.IsNullOrWhiteSpace(request.QueryText))
            {
                return BadRequest(ApiResponse<RecommendationResponseDto>.ErrorResponse(
                    "Lutfen 'ListingId' veya 'QueryText' alanlarindan en az birini belirtin."
                ));
            }

            var result = await _listingsService.GetRecommendationsAsync(request);
            if (!result.Success)
                return StatusCode(502, result);

            return Ok(result);
        }

        /// <summary>
        /// Backend ve bagli ML servisi saglik kontrolu.
        /// </summary>
        [HttpGet("health")]
        public async Task<IActionResult> HealthCheck()
        {
            var mlHealthy = await _mlServiceClient.CheckHealthAsync();
            return Ok(new
            {
                Status = "Healthy",
                Service = "SmartStay.API (ASP.NET Core Web API)",
                MlServiceStatus = mlHealthy ? "Connected (Healthy)" : "Disconnected / Offline",
                Timestamp = System.DateTime.UtcNow
            });
        }
    }
}
