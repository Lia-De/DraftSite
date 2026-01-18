using System;

namespace DraftSiteBE.Models
{
    public class Yarn
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        // FK to LoomProject (optional; a yarn may belong to a project)
        public Guid? LoomProjectId { get; set; }
        public LoomProject? LoomProject { get; set; }

        // purpose of this yarn in the project
        public YarnUsageType UsageType { get; set; } = YarnUsageType.Warp;

        // descriptive fields
        public string? Brand { get; set; }
        public string? Color { get; set; }
        public string? ColorCode { get; set; } // e.g. dye lot or hex code
        public string? DyeLot { get; set; }
        public YarnFibreType FibreType { get; set; } = YarnFibreType.Wool;
        public int? Ply { get; set; } = 1; // number of plies
        public int? ThicknessNM { get; set; } = 0; // thickness in nanometers (NM)
        public string? Notes { get; set; }

        // Yarn measurements (units clarified in property names)
        public decimal WeightPerSkeinGrams { get; set; }    // grams per skein
        public double LengthPerSkeinMeters { get; set; }   // meters per skein
        public int NumberOfSkeins { get; set; }
        public decimal PricePerSkein { get; set; }         // currency per skein

        // Computed helpers
        public decimal TotalWeightGrams => WeightPerSkeinGrams * NumberOfSkeins;
        public double TotalLengthMeters => LengthPerSkeinMeters * NumberOfSkeins;
        public decimal TotalPrice => PricePerSkein * NumberOfSkeins;
    }
}