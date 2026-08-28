using System;
using System.Linq;
using FluentValidation;
using SmartStay.Core.DTOs.Listings;
using SmartStay.Core.DTOs.ML;

namespace SmartStay.Core.Validators
{
    /// <summary>
    /// Fiyat tahmini istek nesnesi dogrulama kurallari.
    /// </summary>
    public class PricePredictionRequestValidator : AbstractValidator<PricePredictionRequestDto>
    {
        private static readonly string[] ValidRoomTypes = { "Entire home/apt", "Private room", "Shared room", "Hotel room" };

        public PricePredictionRequestValidator()
        {
            RuleFor(x => x.Accommodates)
                .InclusiveBetween(1, 30)
                .WithMessage("Konaklayabilecek kisi sayisi 1 ile 30 arasinda olmalidir.");

            RuleFor(x => x.Bedrooms)
                .InclusiveBetween(0.0, 20.0)
                .WithMessage("Yatak odasi sayisi 0 ile 20 arasinda olmalidir.");

            RuleFor(x => x.Beds)
                .InclusiveBetween(0.0, 30.0)
                .WithMessage("Yatak sayisi 0 ile 30 arasinda olmalidir.");

            RuleFor(x => x.Bathrooms)
                .InclusiveBetween(0.0, 15.0)
                .WithMessage("Banyo sayisi 0 ile 15 arasinda olmalidir.");

            RuleFor(x => x.Latitude)
                .InclusiveBetween(40.5, 41.6)
                .WithMessage("Enlem (Latitude) degeri Istanbul sinirlari dahilinde (40.5 - 41.6) olmalidir.");

            RuleFor(x => x.Longitude)
                .InclusiveBetween(28.4, 30.0)
                .WithMessage("Boylam (Longitude) degeri Istanbul sinirlari dahilinde (28.4 - 30.0) olmalidir.");

            RuleFor(x => x.NumberOfReviews)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Yorum sayisi negatif olamaz.");

            RuleFor(x => x.ReviewScoresRating)
                .InclusiveBetween(0.0, 5.0)
                .WithMessage("Degerlendirme puani 0.0 ile 5.0 arasinda olmalidir.");

            RuleFor(x => x.ReviewsPerMonth)
                .GreaterThanOrEqualTo(0.0)
                .WithMessage("Aylik yorum orani negatif olamaz.");

            RuleFor(x => x.MinimumNights)
                .InclusiveBetween(1, 365)
                .WithMessage("Minimum konaklama gecesi 1 ile 365 arasinda olmalidir.");

            RuleFor(x => x.Availability365)
                .InclusiveBetween(0, 365)
                .WithMessage("Musaitlik gun sayisi 0 ile 365 arasinda olmalidir.");

            RuleFor(x => x.NeighbourhoodCleansed)
                .NotEmpty()
                .WithMessage("Ilce bilgisi bos birakilamaz.");

            RuleFor(x => x.RoomType)
                .NotEmpty()
                .Must(rt => ValidRoomTypes.Contains(rt, StringComparer.OrdinalIgnoreCase))
                .WithMessage($"Oda turu su seceneklerden biri olmalidir: {string.Join(", ", ValidRoomTypes)}");
        }
    }

    /// <summary>
    /// Oneri motoru istek nesnesi dogrulama kurallari.
    /// </summary>
    public class RecommendationRequestValidator : AbstractValidator<RecommendationRequestDto>
    {
        public RecommendationRequestValidator()
        {
            RuleFor(x => x.TopN)
                .InclusiveBetween(1, 50)
                .WithMessage("Oneri sayisi (TopN) 1 ile 50 arasinda olmalidir.");

            RuleFor(x => x)
                .Must(x => (x.ListingId.HasValue && x.ListingId.Value > 0) || !string.IsNullOrWhiteSpace(x.QueryText))
                .WithMessage("Lutfen gecerli bir 'ListingId' (pozitif tamsayi) veya 'QueryText' (serbest metin) belirtin.");

            When(x => !string.IsNullOrWhiteSpace(x.QueryText), () =>
            {
                RuleFor(x => x.QueryText)
                    .MinimumLength(3)
                    .WithMessage("Arama sorgusu en az 3 karakterden olusmalidir.")
                    .MaximumLength(300)
                    .WithMessage("Arama sorgusu en fazla 300 karakter olabilir.");
            });
        }
    }

    /// <summary>
    /// Ilan listeleme ve filtreleme parametreleri dogrulama kurallari.
    /// </summary>
    public class ListingFilterValidator : AbstractValidator<ListingFilterDto>
    {
        public ListingFilterValidator()
        {
            RuleFor(x => x.PageNumber)
                .GreaterThanOrEqualTo(1)
                .WithMessage("Sayfa numarasi 1 veya daha buyuk olmalidir.");

            RuleFor(x => x.PageSize)
                .InclusiveBetween(1, 100)
                .WithMessage("Sayfa boyutu 1 ile 100 arasinda olmalidir.");

            When(x => x.MinPrice.HasValue, () =>
            {
                RuleFor(x => x.MinPrice!.Value)
                    .GreaterThanOrEqualTo(0)
                    .WithMessage("Minimum fiyat 0 veya pozitif olmalidir.");
            });

            When(x => x.MaxPrice.HasValue, () =>
            {
                RuleFor(x => x.MaxPrice!.Value)
                    .GreaterThanOrEqualTo(0)
                    .WithMessage("Maksimum fiyat 0 veya pozitif olmalidir.");
            });

            When(x => x.MinPrice.HasValue && x.MaxPrice.HasValue, () =>
            {
                RuleFor(x => x.MinPrice!.Value)
                    .LessThanOrEqualTo(x => x.MaxPrice!.Value)
                    .WithMessage("Minimum fiyat maksimum fiyattan buyuk olamaz.");
            });

            When(x => x.MinAccommodates.HasValue, () =>
            {
                RuleFor(x => x.MinAccommodates!.Value)
                    .GreaterThanOrEqualTo(1)
                    .WithMessage("Minimum kisi sayisi en az 1 olmalidir.");
            });
        }
    }
}
