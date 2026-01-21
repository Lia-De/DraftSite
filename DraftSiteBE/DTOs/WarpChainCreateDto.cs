namespace DraftSiteBE.DTOs
{
    public class WarpChainCreateDto
    {
        public Guid LoomProjectId { get; set; }
        public string? Name { get; set; }
        public string? CrossCount { get; set; } = "1x1"; // e.g. "1x1", "20x20",etc.
        public Guid YarnId { get; set; }
        public int Ends { get; set; }                    // number of ends (threads) in this chain
        public double? WarpLength { get; set; }  // length of each end, in meters
        public string? Notes { get; set; }

    }
}
