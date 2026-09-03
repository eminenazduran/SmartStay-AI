using System.Collections.Generic;

namespace SmartStay.Core.DTOs.Listings
{
    /// <summary>
    /// Detayli ilan veri transfer nesnesi (DTO).
    /// </summary>
    public class ListingDto
    {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string NeighbourhoodCleansed { get; set; } = string.Empty;
        public string RoomType { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Accommodates { get; set; }
        public double Bedrooms { get; set; }
        public double Beds { get; set; }
        public double Bathrooms { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public int NumberOfReviews { get; set; }
        public double ReviewScoresRating { get; set; }
        public double ReviewsPerMonth { get; set; }
        public int MinimumNights { get; set; }
        public int Availability365 { get; set; }
        public List<string> Amenities { get; set; } = new List<string>();
        public string? PictureUrl { get; set; }
        public string? HostName { get; set; }
        public string? HostPictureUrl { get; set; }
        public string? HostUrl { get; set; }
        public int? HostSinceYears { get; set; }
        public bool? HostIsSuperhost { get; set; }
        public bool? HostIdentityVerified { get; set; }
        public string? ListingUrl { get; set; }
        public string? FirstReview { get; set; }
        public string? LastReview { get; set; }
        public double? ReviewScoresCleanliness { get; set; }
        public double? ReviewScoresLocation { get; set; }
        public double? ReviewScoresCommunication { get; set; }
        public double? ReviewScoresAccuracy { get; set; }
        public double? ReviewScoresCheckin { get; set; }
        public double? ReviewScoresValue { get; set; }
        public List<ReviewDto> Reviews { get; set; } = new List<ReviewDto>();
    }

    /// <summary>
    /// Gercek misafir degerlendirmesi DTO'su.
    /// </summary>
    public class ReviewDto
    {
        public string Author { get; set; } = string.Empty;
        public string Location { get; set; } = "Doğrulanmış Misafir";
        public string Date { get; set; } = string.Empty;
        public int Rating { get; set; } = 5;
        public string Comment { get; set; } = string.Empty;
    }

    /// <summary>
    /// Liste gosterimleri icin ozet ilan DTO'su.
    /// </summary>
    public class ListingSummaryDto
    {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string NeighbourhoodCleansed { get; set; } = string.Empty;
        public string RoomType { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public double ReviewScoresRating { get; set; }
        public int NumberOfReviews { get; set; }
        public int Accommodates { get; set; }
        public double Bedrooms { get; set; }
        public double Bathrooms { get; set; }
        public double Beds { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string? PictureUrl { get; set; }
        public string? HostName { get; set; }
        public string? HostPictureUrl { get; set; }
    }

    /// <summary>
    /// Ilan listeleme ve filtreleme parametreleri.
    /// </summary>
    public class ListingFilterDto
    {
        public string? Neighbourhood { get; set; }
        public string? RoomType { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public int? MinAccommodates { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}
