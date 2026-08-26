using System;

namespace SmartStay.Core.Entities
{
    /// <summary>
    /// Konaklama ilani veritabani varligi (Entity).
    /// </summary>
    public class Listing
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
        public string Amenities { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
