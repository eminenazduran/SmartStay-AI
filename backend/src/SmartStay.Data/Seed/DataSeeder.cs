using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SmartStay.Core.Entities;
using SmartStay.Data.Context;

namespace SmartStay.Data.Seed
{
    /// <summary>
    /// Temizlenmis CSV verisini veritabanina aktaran Seeder sinifi.
    /// </summary>
    public static class DataSeeder
    {
        public static async Task SeedAsync(AppDbContext context, ILogger logger, string? csvPath = null)
        {
            try
            {
                // Veritabani tablosunda kayit var mi kontrolu
                if (await context.Listings.AnyAsync())
                {
                    logger.LogInformation("Veritabaninda ilan verileri zaten mevcut, Seed islemi atlandi.");
                    return;
                }

                string resolvedCsvPath = csvPath ?? FindCsvPath();
                if (!File.Exists(resolvedCsvPath))
                {
                    logger.LogWarning("Seed CSV dosyasi bulunamadi: {Path}. Seed islemi yapilamadi.", resolvedCsvPath);
                    return;
                }

                logger.LogInformation("CSV veri aktarimi baslatiliyor: {Path}", resolvedCsvPath);

                var listings = new List<Listing>();
                using (var reader = new StreamReader(resolvedCsvPath))
                {
                    string? headerLine = await reader.ReadLineAsync();
                    if (string.IsNullOrEmpty(headerLine))
                    {
                        logger.LogWarning("CSV dosyasi bos.");
                        return;
                    }

                    var headers = ParseCsvLine(headerLine);
                    var headerIndexMap = headers
                        .Select((name, idx) => new { name = name.Trim(), idx })
                        .ToDictionary(h => h.name, h => h.idx, StringComparer.OrdinalIgnoreCase);

                    string? line;
                    while ((line = await reader.ReadLineAsync()) != null)
                    {
                        if (string.IsNullOrWhiteSpace(line)) continue;

                        try
                        {
                            var values = ParseCsvLine(line);
                            if (values.Count < headers.Count) continue;

                            var listing = new Listing
                            {
                                Id = GetLong(values, headerIndexMap, "id"),
                                Name = Truncate(GetString(values, headerIndexMap, "name"), 500) ?? "Listing",
                                Description = GetString(values, headerIndexMap, "description") ?? string.Empty,
                                NeighbourhoodCleansed = Truncate(GetString(values, headerIndexMap, "neighbourhood_cleansed"), 100) ?? "Unknown",
                                RoomType = Truncate(GetString(values, headerIndexMap, "room_type"), 100) ?? "Entire home/apt",
                                Price = GetDecimal(values, headerIndexMap, "price"),
                                Accommodates = GetInt(values, headerIndexMap, "accommodates", 1),
                                Bedrooms = GetDouble(values, headerIndexMap, "bedrooms", 1.0),
                                Beds = GetDouble(values, headerIndexMap, "beds", 1.0),
                                Bathrooms = GetDouble(values, headerIndexMap, "bathrooms", 1.0),
                                Latitude = GetDouble(values, headerIndexMap, "latitude", 41.0082),
                                Longitude = GetDouble(values, headerIndexMap, "longitude", 28.9784),
                                NumberOfReviews = GetInt(values, headerIndexMap, "number_of_reviews", 0),
                                ReviewScoresRating = GetDouble(values, headerIndexMap, "review_scores_rating", 0.0),
                                ReviewsPerMonth = GetDouble(values, headerIndexMap, "reviews_per_month", 0.0),
                                MinimumNights = GetInt(values, headerIndexMap, "minimum_nights", 1),
                                Availability365 = GetInt(values, headerIndexMap, "availability_365", 0),
                                Amenities = CleanAmenitiesString(GetString(values, headerIndexMap, "amenities") ?? string.Empty),
                                CreatedAt = DateTime.UtcNow
                            };

                            if (listing.Id > 0 && listing.Price > 0)
                            {
                                listings.Add(listing);
                            }
                        }
                        catch
                        {
                            // Tekil satır parse hatasında devam et
                        }
                    }
                }

                logger.LogInformation("CSV'den {Count} adet ilan basariyla ayristirildi. Veritabanina toplu aktarim basliyor...", listings.Count);

                // Toplu ekleme (Batch Insert - 2000'er kayit)
                const int batchSize = 2000;
                for (int i = 0; i < listings.Count; i += batchSize)
                {
                    var batch = listings.Skip(i).Take(batchSize).ToList();
                    await context.Listings.AddRangeAsync(batch);
                    await context.SaveChangesAsync();
                    logger.LogInformation("Aktarilan ilan: {Current}/{Total}", Math.Min(i + batchSize, listings.Count), listings.Count);
                }

                logger.LogInformation("Veritabani Seed islemi basariyla tamamlandi. Toplam eklenen ilan: {Count}", listings.Count);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Veritabani Seed islemi sirasinda hata olustu.");
            }
        }

        private static string FindCsvPath()
        {
            string currentDir = AppDomain.CurrentDomain.BaseDirectory;
            while (!string.IsNullOrEmpty(currentDir))
            {
                string candidate = Path.Combine(currentDir, "data_science", "data", "processed", "cleaned_listings.csv");
                if (File.Exists(candidate)) return candidate;

                string candidate2 = Path.Combine(currentDir, "..", "..", "..", "..", "..", "data_science", "data", "processed", "cleaned_listings.csv");
                if (File.Exists(Path.GetFullPath(candidate2))) return Path.GetFullPath(candidate2);

                var parent = Directory.GetParent(currentDir);
                if (parent == null || parent.FullName == currentDir) break;
                currentDir = parent.FullName;
            }

            // Fallback project path
            return @"c:\Users\emine\Desktop\SmartStay AI\data_science\data\processed\cleaned_listings.csv";
        }

        private static List<string> ParseCsvLine(string line)
        {
            var result = new List<string>();
            bool inQuotes = false;
            var currentField = new System.Text.StringBuilder();

            for (int i = 0; i < line.Length; i++)
            {
                char c = line[i];
                if (c == '"')
                {
                    if (inQuotes && i + 1 < line.Length && line[i + 1] == '"')
                    {
                        currentField.Append('"');
                        i++;
                    }
                    else
                    {
                        inQuotes = !inQuotes;
                    }
                }
                else if (c == ',' && !inQuotes)
                {
                    result.Add(currentField.ToString());
                    currentField.Clear();
                }
                else
                {
                    currentField.Append(c);
                }
            }
            result.Add(currentField.ToString());
            return result;
        }

        private static string CleanAmenitiesString(string raw)
        {
            if (string.IsNullOrWhiteSpace(raw)) return string.Empty;
            // JSON format ["Wifi", "Kitchen"] veya Dizi temizligi
            string clean = raw.Trim('[', ']', '"', '\'', ' ');
            clean = Regex.Replace(clean, @"[""\\]", "");
            return clean;
        }

        private static string? GetString(List<string> values, Dictionary<string, int> map, string key)
        {
            if (map.TryGetValue(key, out int idx) && idx < values.Count)
                return values[idx].Trim();
            return null;
        }

        private static long GetLong(List<string> values, Dictionary<string, int> map, string key)
        {
            var str = GetString(values, map, key);
            return long.TryParse(str, NumberStyles.Any, CultureInfo.InvariantCulture, out long val) ? val : 0;
        }

        private static int GetInt(List<string> values, Dictionary<string, int> map, string key, int defaultValue = 0)
        {
            var str = GetString(values, map, key);
            return int.TryParse(str, NumberStyles.Any, CultureInfo.InvariantCulture, out int val) ? val : defaultValue;
        }

        private static double GetDouble(List<string> values, Dictionary<string, int> map, string key, double defaultValue = 0.0)
        {
            var str = GetString(values, map, key);
            return double.TryParse(str, NumberStyles.Any, CultureInfo.InvariantCulture, out double val) ? val : defaultValue;
        }

        private static decimal GetDecimal(List<string> values, Dictionary<string, int> map, string key, decimal defaultValue = 0m)
        {
            var str = GetString(values, map, key);
            if (string.IsNullOrWhiteSpace(str)) return defaultValue;
            str = str.Replace("$", "").Replace("TL", "").Replace(",", "").Trim();
            return decimal.TryParse(str, NumberStyles.Any, CultureInfo.InvariantCulture, out decimal val) ? val : defaultValue;
        }

        private static string? Truncate(string? value, int maxLength)
        {
            if (string.IsNullOrEmpty(value)) return value;
            return value.Length <= maxLength ? value : value.Substring(0, maxLength);
        }
    }
}
