using DraftSiteBE.Models;

namespace DraftSiteBE.DTOs
{
    // DTO used for creating projects from the frontend
    public class LoomProjectCreateDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Owner { get; set; }

        // If provided, use this as width mode
        public decimal? WeavingWidthCm { get; set; }

        // If provided, use this as total ends mode
        public int? InputEndsInWarp { get; set; }

        // Density (required)
        public double EndsPerCm { get; set; }
        public double PicksPerCm { get; set; }
        public double WarpLengthMeters { get; set; }

        // Simple tags as strings
        public List<string>? Tags { get; set; }

        // Inline children (you can also POST them separately)
        public List<Yarn>? Yarns { get; set; }
        public List<WarpChain>? WarpChains { get; set; }
    }
}
