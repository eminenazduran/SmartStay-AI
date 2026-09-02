using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SmartStay.Core.DTOs.Listings;
using SmartStay.Core.Entities;
using SmartStay.Core.Interfaces.Repositories;
using SmartStay.Data.Context;

namespace SmartStay.Data.Repositories
{
    /// <summary>
    /// Entity Framework Core ile MSSQL veritabanı uzerinde calisan Repository implementasyonu.
    /// </summary>
    public class ListingsRepository : IListingsRepository
    {
        private readonly AppDbContext _context;

        public ListingsRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Listing>> GetAllAsync(ListingFilterDto filter)
        {
            var query = _context.Listings.AsNoTracking().AsQueryable();

            if (!string.IsNullOrWhiteSpace(filter.Neighbourhood))
            {
                var inputLower = filter.Neighbourhood.Trim().ToLowerInvariant();
                var normalized = NormalizeTurkishCharacters(inputLower);
                query = query.Where(l => l.NeighbourhoodCleansed.ToLower() == inputLower 
                                      || l.NeighbourhoodCleansed.ToLower() == normalized);
            }

            if (!string.IsNullOrWhiteSpace(filter.RoomType))
            {
                query = query.Where(l => l.RoomType.ToLower() == filter.RoomType.ToLower());
            }

            if (filter.MinPrice.HasValue)
            {
                query = query.Where(l => l.Price >= filter.MinPrice.Value);
            }

            if (filter.MaxPrice.HasValue)
            {
                query = query.Where(l => l.Price <= filter.MaxPrice.Value);
            }

            if (filter.MinAccommodates.HasValue)
            {
                query = query.Where(l => l.Accommodates >= filter.MinAccommodates.Value);
            }

            int page = filter.PageNumber < 1 ? 1 : filter.PageNumber;
            int size = filter.PageSize < 1 ? 20 : Math.Min(filter.PageSize, 100);

            return await query
                .OrderBy(l => l.Id)
                .Skip((page - 1) * size)
                .Take(size)
                .ToListAsync();
        }

        public async Task<Listing?> GetByIdAsync(long id)
        {
            return await _context.Listings
                .AsNoTracking()
                .FirstOrDefaultAsync(l => l.Id == id);
        }

        public async Task<int> GetCountAsync(ListingFilterDto filter)
        {
            var query = _context.Listings.AsQueryable();

            if (!string.IsNullOrWhiteSpace(filter.Neighbourhood))
            {
                query = query.Where(l => l.NeighbourhoodCleansed.ToLower() == filter.Neighbourhood.ToLower());
            }

            if (!string.IsNullOrWhiteSpace(filter.RoomType))
            {
                query = query.Where(l => l.RoomType.ToLower() == filter.RoomType.ToLower());
            }

            if (filter.MinPrice.HasValue)
            {
                query = query.Where(l => l.Price >= filter.MinPrice.Value);
            }

            if (filter.MaxPrice.HasValue)
            {
                query = query.Where(l => l.Price <= filter.MaxPrice.Value);
            }

            if (filter.MinAccommodates.HasValue)
            {
                query = query.Where(l => l.Accommodates >= filter.MinAccommodates.Value);
            }

            return await query.CountAsync();
        }

        public async Task<IEnumerable<Listing>> GetFeaturedAsync(int count = 6)
        {
            return await _context.Listings
                .AsNoTracking()
                .OrderByDescending(l => l.ReviewScoresRating)
                .ThenByDescending(l => l.NumberOfReviews)
                .Take(count)
                .ToListAsync();
        }

        public async Task<Listing> AddAsync(Listing listing)
        {
            await _context.Listings.AddAsync(listing);
            await _context.SaveChangesAsync();
            return listing;
        }

        public async Task UpdateAsync(Listing listing)
        {
            _context.Listings.Update(listing);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(long id)
        {
            var listing = await _context.Listings.FindAsync(id);
            if (listing != null)
            {
                _context.Listings.Remove(listing);
                await _context.SaveChangesAsync();
            }
        }

        private static string NormalizeTurkishCharacters(string text)
        {
            if (string.IsNullOrWhiteSpace(text)) return string.Empty;

            return text
                .Replace('ı', 'i')
                .Replace('İ', 'i')
                .Replace('ö', 'o')
                .Replace('Ö', 'o')
                .Replace('ü', 'u')
                .Replace('Ü', 'u')
                .Replace('ş', 's')
                .Replace('Ş', 's')
                .Replace('ç', 'c')
                .Replace('Ç', 'c')
                .Replace('ğ', 'g')
                .Replace('Ğ', 'g');
        }
    }
}
