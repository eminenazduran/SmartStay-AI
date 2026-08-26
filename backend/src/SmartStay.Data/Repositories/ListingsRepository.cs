using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SmartStay.Core.DTOs.Listings;
using SmartStay.Core.Entities;
using SmartStay.Core.Interfaces.Repositories;

namespace SmartStay.Data.Repositories
{
    /// <summary>
    /// Ilan veritabani islemlerini yoneten Repository implementasyonu.
    /// (Gun 13'te EF Core DbContext uzerine tam olarak baglanacaktir).
    /// </summary>
    public class ListingsRepository : IListingsRepository
    {
        private static readonly List<Listing> _inMemoryListings = new()
        {
            new Listing
            {
                Id = 34177,
                Name = "PETIT HOUSE - Besiktas Central Flat",
                Description = "A cozy, charming apartment located in the vibrant heart of Besiktas, walking distance to ferry and cafes.",
                NeighbourhoodCleansed = "Besiktas",
                RoomType = "Entire home/apt",
                Price = 1356.82m,
                Accommodates = 2,
                Bedrooms = 1.0,
                Beds = 1.0,
                Bathrooms = 1.0,
                Latitude = 41.0422,
                Longitude = 29.0067,
                NumberOfReviews = 48,
                ReviewScoresRating = 4.69,
                ReviewsPerMonth = 1.45,
                MinimumNights = 2,
                Availability365 = 280,
                Amenities = "Wifi, Kitchen, Air conditioning, Heating, Hot water, Dedicated workspace",
                CreatedAt = DateTime.UtcNow
            },
            new Listing
            {
                Id = 955886,
                Name = "New Apartment Near Taksim Square",
                Description = "Modern spacious flat next to Taksim Square and Istiklal Street. Ideal for city explorers.",
                NeighbourhoodCleansed = "Beyoglu",
                RoomType = "Entire home/apt",
                Price = 1789.98m,
                Accommodates = 3,
                Bedrooms = 1.0,
                Beds = 2.0,
                Bathrooms = 1.0,
                Latitude = 41.0369,
                Longitude = 28.9850,
                NumberOfReviews = 62,
                ReviewScoresRating = 4.85,
                ReviewsPerMonth = 2.10,
                MinimumNights = 1,
                Availability365 = 310,
                Amenities = "Wifi, Kitchen, Air conditioning, Heating, TV, Hot water, Elevator",
                CreatedAt = DateTime.UtcNow
            },
            new Listing
            {
                Id = 6983979,
                Name = "Old City Deluxe Apartment (4 Persons)",
                Description = "Historic Peninsula luxury apartment, 5 minutes walk to Hagia Sophia, Blue Mosque and Grand Bazaar.",
                NeighbourhoodCleansed = "Fatih",
                RoomType = "Entire home/apt",
                Price = 3939.50m,
                Accommodates = 4,
                Bedrooms = 2.0,
                Beds = 3.0,
                Bathrooms = 1.5,
                Latitude = 41.0082,
                Longitude = 28.9784,
                NumberOfReviews = 85,
                ReviewScoresRating = 4.92,
                ReviewsPerMonth = 3.40,
                MinimumNights = 2,
                Availability365 = 340,
                Amenities = "Wifi, Kitchen, Air conditioning, Heating, TV, Hot water, Smoke alarm, Washer",
                CreatedAt = DateTime.UtcNow
            },
            new Listing
            {
                Id = 12603737,
                Name = "MINI HOUSE - Kadikoy Moda Sea Breeze",
                Description = "Trendy flat in Moda Kadikoy with vibrant cafe culture and sea promenade nearby.",
                NeighbourhoodCleansed = "Kadikoy",
                RoomType = "Entire home/apt",
                Price = 1650.00m,
                Accommodates = 2,
                Bedrooms = 1.0,
                Beds = 1.0,
                Bathrooms = 1.0,
                Latitude = 40.9850,
                Longitude = 29.0280,
                NumberOfReviews = 34,
                ReviewScoresRating = 4.75,
                ReviewsPerMonth = 1.80,
                MinimumNights = 1,
                Availability365 = 260,
                Amenities = "Wifi, Kitchen, Air conditioning, Heating, Balcony, Hot water",
                CreatedAt = DateTime.UtcNow
            },
            new Listing
            {
                Id = 803613,
                Name = "Deluxe Bosphorus View Suite",
                Description = "Panoramic Bosphorus view luxury penthouse suite with private terrace.",
                NeighbourhoodCleansed = "Beyoglu",
                RoomType = "Entire home/apt",
                Price = 4500.00m,
                Accommodates = 4,
                Bedrooms = 2.0,
                Beds = 2.0,
                Bathrooms = 2.0,
                Latitude = 41.0320,
                Longitude = 28.9810,
                NumberOfReviews = 110,
                ReviewScoresRating = 4.96,
                ReviewsPerMonth = 4.10,
                MinimumNights = 2,
                Availability365 = 290,
                Amenities = "Wifi, Kitchen, Air conditioning, Heating, Terrace, Sea view, Dishwasher, Smoke alarm",
                CreatedAt = DateTime.UtcNow
            },
            new Listing
            {
                Id = 15143958,
                Name = "Sultanahmet Panoramic Historic House",
                Description = "Centrally located authentic family house in Sultanahmet Old City.",
                NeighbourhoodCleansed = "Fatih",
                RoomType = "Entire home/apt",
                Price = 3549.00m,
                Accommodates = 5,
                Bedrooms = 2.0,
                Beds = 4.0,
                Bathrooms = 2.0,
                Latitude = 41.0050,
                Longitude = 28.9750,
                NumberOfReviews = 76,
                ReviewScoresRating = 4.88,
                ReviewsPerMonth = 2.80,
                MinimumNights = 2,
                Availability365 = 320,
                Amenities = "Wifi, Kitchen, Air conditioning, Heating, TV, Washer, Dryer, Hot water",
                CreatedAt = DateTime.UtcNow
            }
        };

        public Task<IEnumerable<Listing>> GetAllAsync(ListingFilterDto filter)
        {
            var query = _inMemoryListings.AsQueryable();

            if (!string.IsNullOrWhiteSpace(filter.Neighbourhood))
                query = query.Where(l => l.NeighbourhoodCleansed.Equals(filter.Neighbourhood, StringComparison.OrdinalIgnoreCase));

            if (!string.IsNullOrWhiteSpace(filter.RoomType))
                query = query.Where(l => l.RoomType.Equals(filter.RoomType, StringComparison.OrdinalIgnoreCase));

            if (filter.MinPrice.HasValue)
                query = query.Where(l => l.Price >= filter.MinPrice.Value);

            if (filter.MaxPrice.HasValue)
                query = query.Where(l => l.Price <= filter.MaxPrice.Value);

            if (filter.MinAccommodates.HasValue)
                query = query.Where(l => l.Accommodates >= filter.MinAccommodates.Value);

            var paged = query
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToList();

            return Task.FromResult<IEnumerable<Listing>>(paged);
        }

        public Task<Listing?> GetByIdAsync(long id)
        {
            var listing = _inMemoryListings.FirstOrDefault(l => l.Id == id);
            return Task.FromResult(listing);
        }

        public Task<int> GetCountAsync(ListingFilterDto filter)
        {
            var query = _inMemoryListings.AsQueryable();

            if (!string.IsNullOrWhiteSpace(filter.Neighbourhood))
                query = query.Where(l => l.NeighbourhoodCleansed.Equals(filter.Neighbourhood, StringComparison.OrdinalIgnoreCase));

            if (!string.IsNullOrWhiteSpace(filter.RoomType))
                query = query.Where(l => l.RoomType.Equals(filter.RoomType, StringComparison.OrdinalIgnoreCase));

            return Task.FromResult(query.Count());
        }

        public Task<IEnumerable<Listing>> GetFeaturedAsync(int count = 6)
        {
            var featured = _inMemoryListings.Take(count).ToList();
            return Task.FromResult<IEnumerable<Listing>>(featured);
        }

        public Task<Listing> AddAsync(Listing listing)
        {
            if (listing.Id <= 0)
                listing.Id = _inMemoryListings.Max(l => l.Id) + 1;

            _inMemoryListings.Add(listing);
            return Task.FromResult(listing);
        }

        public Task UpdateAsync(Listing listing)
        {
            var existingIndex = _inMemoryListings.FindIndex(l => l.Id == listing.Id);
            if (existingIndex >= 0)
                _inMemoryListings[existingIndex] = listing;

            return Task.CompletedTask;
        }

        public Task DeleteAsync(long id)
        {
            _inMemoryListings.RemoveAll(l => l.Id == id);
            return Task.CompletedTask;
        }
    }
}
