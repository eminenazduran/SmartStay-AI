using Microsoft.EntityFrameworkCore;
using SmartStay.Core.Entities;

namespace SmartStay.Data.Context
{
    /// <summary>
    /// SmartStay platformu Entity Framework Core veritabani baglam sınıfı.
    /// </summary>
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Listing> Listings => Set<Listing>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Listing Entity Fluent API Konfigurasyonu
            modelBuilder.Entity<Listing>(entity =>
            {
                entity.ToTable("Listings");

                // CSV veri setindeki gercek ilan ID'lerini korumak icin otomatik artmayan birincil anahtar
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id)
                      .ValueGeneratedNever();

                entity.Property(e => e.Name)
                      .HasMaxLength(500)
                      .IsRequired();

                entity.Property(e => e.NeighbourhoodCleansed)
                      .HasMaxLength(100)
                      .IsRequired();

                entity.Property(e => e.RoomType)
                      .HasMaxLength(100)
                      .IsRequired();

                entity.Property(e => e.Price)
                      .HasPrecision(18, 2)
                      .IsRequired();

                entity.Property(e => e.ReviewScoresRating)
                      .HasPrecision(5, 2);

                entity.Property(e => e.ReviewsPerMonth)
                      .HasPrecision(6, 2);

                entity.Property(e => e.Bedrooms)
                      .HasPrecision(5, 1);

                entity.Property(e => e.Beds)
                      .HasPrecision(5, 1);

                entity.Property(e => e.Bathrooms)
                      .HasPrecision(5, 1);

                entity.Property(e => e.Latitude)
                      .HasPrecision(10, 7);

                entity.Property(e => e.Longitude)
                      .HasPrecision(10, 7);

                entity.Property(e => e.CreatedAt)
                      .HasDefaultValueSql("GETUTCDATE()");

                // Performans ve filtreleme indeksleri
                entity.HasIndex(e => e.NeighbourhoodCleansed);
                entity.HasIndex(e => e.RoomType);
                entity.HasIndex(e => e.Price);
            });
        }
    }
}
