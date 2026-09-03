using System.Collections.Generic;
using System.Threading.Tasks;
using SmartStay.Core.DTOs.Listings;
using SmartStay.Core.Entities;

namespace SmartStay.Core.Interfaces.Repositories
{
    /// <summary>
    /// Ilan veritabani erisim arayuzu (Repository Pattern).
    /// </summary>
    public interface IListingsRepository
    {
        Task<IEnumerable<Listing>> GetAllAsync(ListingFilterDto filter);
        Task<Listing?> GetByIdAsync(long id);
        Task<IEnumerable<ListingReview>> GetReviewsByListingIdAsync(long listingId, int maxCount = 3);
        Task<int> GetCountAsync(ListingFilterDto filter);
        Task<IEnumerable<Listing>> GetFeaturedAsync(int count = 6);
        Task<Listing> AddAsync(Listing listing);
        Task UpdateAsync(Listing listing);
        Task DeleteAsync(long id);
    }
}
