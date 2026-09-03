namespace SmartStay.Core.Entities
{
    /// <summary>
    /// Konaklama ilani gercek misafir degerlendirmesi entity'si.
    /// </summary>
    public class ListingReview
    {
        public int Id { get; set; }
        public long ListingId { get; set; }
        public string Author { get; set; } = string.Empty;
        public string? Location { get; set; } = "Doğrulanmış Misafir";
        public string? Date { get; set; }
        public int Rating { get; set; } = 5;
        public string Comment { get; set; } = string.Empty;
    }
}
