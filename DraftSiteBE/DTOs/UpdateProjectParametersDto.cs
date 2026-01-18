using System;

namespace DraftSiteBE.DTOs
{
    // Sent from frontend to update numeric weaving parameters for an existing project.
    public class UpdateProjectParametersDto
    {
        public Guid ProjectId { get; set; }

        // Any of these may be provided. If provided, they will be applied.
        public decimal? WeavingWidthCm { get; set; }   // new weaving width in cm
        public double? EndsPerCm { get; set; }         // new ends (warp) per cm
        public double? PicksPerCm { get; set; }        // new picks (weft) per cm
        public int? InputEndsInWarp { get; set; }      // new total ends in the warp (if user supplies total ends)
        public double? WarpLengthMeters { get; set; } // New: allow updating the planned warp length (meters)
    }
}