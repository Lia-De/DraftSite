using System;

namespace DraftSiteBE.Models
{
    public class WarpChain
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        // Optional friendly name / order for the chain on the warp beam
        public string? Name { get; set; }
        public int Order { get; set; }
        public string CrossCount { get; set; } = "1x1"; // e.g. "1x1", "20x20",etc.

        // FK to LoomProject
        public Guid LoomProjectId { get; set; }
        public LoomProject? LoomProject { get; set; }

        // Link to the Yarn used for this chain (optional)
        public Guid YarnId { get; set; }
        public Yarn? Yarn { get; set; }

        // Chain specifics
        public int Ends { get; set; }                    // number of ends (threads) in this chain
        public double WarpLength { get; set; }  // length of each end, in meters
        public string? Notes { get; set; }

        // Computed helpers
        public double TotalLengthMeters => Ends * WarpLength;

        // How many skeins of the referenced yarn are required for this chain (rounded up)
        public decimal SkeinsNeeded
        {
            get
            {
                if (Yarn == null || Yarn.LengthPerSkeinMeters <= 0.0) return 0;
                return (decimal)(TotalLengthMeters / Yarn.LengthPerSkeinMeters);
            }
        }

       
    }
}