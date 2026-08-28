using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartStay.Core.DTOs.Common;
using SmartStay.Core.DTOs.Listings;
using SmartStay.Core.DTOs.ML;
using SmartStay.Core.Interfaces.Services;

namespace SmartStay.API.Controllers
{
    /// <summary>
    /// SmartStay AI — Konaklama ilanlari, dinamik fiyat degerleme ve anlamsal oneri motoru REST API servisleri.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class ListingsController : ControllerBase
    {
        private readonly IListingsService _listingsService;
        private readonly IMlServiceClient _mlServiceClient;
        private readonly IValidator<PricePredictionRequestDto> _predictValidator;
        private readonly IValidator<RecommendationRequestDto> _recommendValidator;
        private readonly IValidator<ListingFilterDto> _filterValidator;

        public ListingsController(
            IListingsService listingsService,
            IMlServiceClient mlServiceClient,
            IValidator<PricePredictionRequestDto> predictValidator,
            IValidator<RecommendationRequestDto> recommendValidator,
            IValidator<ListingFilterDto> filterValidator)
        {
            _listingsService = listingsService;
            _mlServiceClient = mlServiceClient;
            _predictValidator = predictValidator;
            _recommendValidator = recommendValidator;
            _filterValidator = filterValidator;
        }

        /// <summary>
        /// Filtrelenebilir, siralanabilir ve sayfalanabilir tum konaklama ilanlarini getirir.
        /// </summary>
        /// <param name="filter">Ilce, oda turu, fiyat araligi, kisi sayisi ve sayfalama parametreleri</param>
        /// <returns>Ilan ozet listesi</returns>
        /// <response code="200">Ilanlar basariyla filtrelenip getirildi.</response>
        /// <response code="400">Gecersiz filtreleme parametreleri girildi.</response>
        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<ListingSummaryDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<ListingSummaryDto>>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetListings([FromQuery] ListingFilterDto filter)
        {
            var validation = await _filterValidator.ValidateAsync(filter);
            if (!validation.IsValid)
            {
                var errors = validation.Errors.Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse<IEnumerable<ListingSummaryDto>>.ErrorResponse("Filtreleme parametreleri gecersiz.", errors));
            }

            var result = await _listingsService.GetListingsAsync(filter);
            return Ok(result);
        }

        /// <summary>
        /// Benzersiz ilan ID'sine gore tekil konaklama detaylarini getirir.
        /// </summary>
        /// <param name="id">Ilan ID'si (Örn: 34177)</param>
        /// <returns>Detayli ilan nesnesi</returns>
        /// <response code="200">Ilan basariyla bulundu ve getirildi.</response>
        /// <response code="400">Gecersiz ilan ID'si belirtildi.</response>
        /// <response code="404">Belirtilen ID'ye sahip ilan veritabaninda bulunamadi.</response>
        [HttpGet("{id:long}")]
        [ProducesResponseType(typeof(ApiResponse<ListingDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<ListingDto>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<ListingDto>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetListingById(long id)
        {
            if (id <= 0)
            {
                return BadRequest(ApiResponse<ListingDto>.ErrorResponse("Ilan ID'si pozitif bir tamsayi olmalidir."));
            }

            var result = await _listingsService.GetListingByIdAsync(id);
            if (!result.Success)
            {
                return NotFound(result);
            }

            return Ok(result);
        }

        /// <summary>
        /// Ana sayfa icin secilmis en yuksek puanli one cikan konaklama ilanlarini getirir.
        /// </summary>
        /// <param name="count">Getirilecek ilan adedi (Varsayilan: 6, Maks: 50)</param>
        /// <returns>One cikan ilanlar listesi</returns>
        /// <response code="200">One cikan ilanlar basariyla getirildi.</response>
        [HttpGet("featured")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<ListingSummaryDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<ListingSummaryDto>>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetFeaturedListings([FromQuery] int count = 6)
        {
            if (count < 1 || count > 50)
            {
                return BadRequest(ApiResponse<IEnumerable<ListingSummaryDto>>.ErrorResponse("One cikan ilan sayisi 1 ile 50 arasinda olmalidir."));
            }

            var result = await _listingsService.GetFeaturedListingsAsync(count);
            return Ok(result);
        }

        /// <summary>
        /// Konaklama ozelliklerine gore yapay zeka (XGBoost Regressor) destekli dinamik fiyat tahmini hesaplar.
        /// </summary>
        /// <param name="request">Konaklama kapasitesi, oda sayisi, ilce, koordinatlar ve olanaklar</param>
        /// <returns>Tahmin edilen gecelik konaklama fiyati (TL) ve model metrikleri</returns>
        /// <response code="200">Fiyat tahmini basariyla hesaplandi.</response>
        /// <response code="400">Gonderilen parametreler dogrulama kurallarina uymuyor.</response>
        /// <response code="502">ML mikroservisi yanit vermedi veya model hesaplama hatasi olustu.</response>
        [HttpPost("predict-price")]
        [ProducesResponseType(typeof(ApiResponse<PricePredictionResponseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<PricePredictionResponseDto>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<PricePredictionResponseDto>), StatusCodes.Status502BadGateway)]
        public async Task<IActionResult> PredictPrice([FromBody] PricePredictionRequestDto request)
        {
            var validation = await _predictValidator.ValidateAsync(request);
            if (!validation.IsValid)
            {
                var errors = validation.Errors.Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse<PricePredictionResponseDto>.ErrorResponse("Fiyat tahmini istek parametreleri gecersiz.", errors));
            }

            var result = await _listingsService.PredictPriceAsync(request);
            if (!result.Success)
            {
                return StatusCode(StatusCodes.Status502BadGateway, result);
            }

            return Ok(result);
        }

        /// <summary>
        /// Belirli bir ilan ID'si veya serbest metin anlamsal aramasi (TF-IDF &amp; Kosinus Benzerligi) icin benzer ilan onerileri uretir.
        /// </summary>
        /// <param name="request">Hedef ilan ID'si veya serbest arama metni ve oneri adedi</param>
        /// <returns>En benzer ilanlar ve benzerlik skorlari (0.0 - 1.0)</returns>
        /// <response code="200">Benzer ilan onerileri basariyla uretildi.</response>
        /// <response code="400">Gecersiz veya eksik arama parametreleri.</response>
        /// <response code="502">ML oneri servisi yanit vermedi.</response>
        [HttpPost("recommend")]
        [ProducesResponseType(typeof(ApiResponse<RecommendationResponseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<RecommendationResponseDto>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<RecommendationResponseDto>), StatusCodes.Status502BadGateway)]
        public async Task<IActionResult> GetRecommendations([FromBody] RecommendationRequestDto request)
        {
            var validation = await _recommendValidator.ValidateAsync(request);
            if (!validation.IsValid)
            {
                var errors = validation.Errors.Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse<RecommendationResponseDto>.ErrorResponse("Oneri istegi dogrulama kurallarina uymuyor.", errors));
            }

            var result = await _listingsService.GetRecommendationsAsync(request);
            if (!result.Success)
            {
                return StatusCode(StatusCodes.Status502BadGateway, result);
            }

            return Ok(result);
        }

        /// <summary>
        /// ASP.NET Core Backend ve bagli Python FastAPI ML mikroservisi calisma ve baglanti durumunu denetler.
        /// </summary>
        /// <response code="200">Backend servisi saglikli calisiyor.</response>
        [HttpGet("health")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> HealthCheck()
        {
            var mlHealthy = await _mlServiceClient.CheckHealthAsync();
            return Ok(new
            {
                Status = "Healthy",
                Service = "SmartStay.API (ASP.NET Core Web API)",
                MlServiceStatus = mlHealthy ? "Connected (Healthy)" : "Disconnected / Offline",
                Timestamp = DateTime.UtcNow
            });
        }

        /// <summary>
        /// Global Exception Handling Middleware test ve dogrulama endpoint'i.
        /// </summary>
        [HttpGet("test-error")]
        [ApiExplorerSettings(IgnoreApi = true)]
        public IActionResult TestUnhandledError()
        {
            throw new InvalidOperationException("Global Exception Handling Middleware test amaciyla kasitli olarak firlatilan istisna.");
        }
    }
}
