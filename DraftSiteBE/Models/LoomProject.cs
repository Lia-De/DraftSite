using System;
using System.Collections.Generic;
using System.Linq;

namespace DraftSiteBE.Models
{
    public class LoomProject
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Owner { get; set; }
        public List<Tag> Tags { get; set; } = new List<Tag>();

        // Weaving dimensions (units clarified in property names)
        public decimal WeavingWidthCm { get; set; }           // width of the woven fabric, in centimeters
        public bool WidthInput { get; set; } = true;        // true if width is specified, false if left to be calculated
        public double WarpLengthMeters { get; set; }          // planned warp length, in meters
        
        public int InputEndsInWarp { get; set; }          // number of ends (threads) in the warp, if specified directly
        public bool EndsInput { get; set; } = false;       // true if ends is specified, false if left to be calculated

        // Thread density
        public double EndsPerCm { get; set; }                 // ends (warp threads) per centimeter
        public double PicksPerCm { get; set; }                // picks (weft picks) per centimeter

        // Yarn usages (warp, weft, supplementary, etc.)
        public List<Yarn> Yarns { get; set; } = new List<Yarn>();

        // Warp chains (multiple chains allowed)
        public List<WarpChain> WarpChains { get; set; }= new List<WarpChain>();


        // Derived/calculated values

        // Effective weaving width (cm):
        // - if the user provided width (WidthInput == true) return that,
        // - otherwise if user provided total ends (EndsInput == true) and EndsPerCm > 0 calculate width = ends / endsPerCm,
        // - otherwise fall back to the stored WeavingWidthCm (may be 0).
        public double EffectiveWeavingWidthCm
        {
            get
            {
                if (WidthInput && WeavingWidthCm > 0) return (double)WeavingWidthCm;
                if (EndsInput && EndsPerCm > 0) return InputEndsInWarp / EndsPerCm;
                return (double)WeavingWidthCm;
            }
        }

        // Total ends in the warp:
        // - if the user provided a total (EndsInput == true) use that,
        // - otherwise compute from ends per cm * effective width.
        public int EndsInWarp
        {
            get
            {
                if (EndsInput && InputEndsInWarp > 0) return InputEndsInWarp;

                // Use EndsPerCm * EffectiveWeavingWidthCm when possible
                if (EndsPerCm > 0 && EffectiveWeavingWidthCm > 0)
                {
                    return (int)Math.Round(EndsPerCm * EffectiveWeavingWidthCm);
                }

                // fallback to 0 if we can't compute
                return 0;
            }
        }

        // Prefer explicit chain data when present, otherwise fallback to the calculated EndsInWarp
        public int TotalEndsInWarp => WarpChains.Count >= 1 ? WarpChains.Sum(w => w.Ends) : EndsInWarp;

        // Projected yarn usages
        public int ProjectedTotalWarpLengthMeters => (int)Math.Ceiling(TotalEndsInWarp * WarpLengthMeters);
        public decimal ProjectedTotalWarpWeightGrams
        {
            get
            {
                // total warp weight = (total ends in warp * warp length (m)) / 1000 * yarn linear density (g/m)
                var totalWeight = 0.0m;
                var totalEnds = TotalEndsInWarp;
                if (totalEnds > 0 && WarpLengthMeters > 0)
                {
                    var warpYarns = Yarns.Where(y => y.UsageType == YarnUsageType.Warp);
                    foreach (var yarn in warpYarns)
                    {
                        var linearDensity = yarn.WeightPerSkeinGrams / (decimal) yarn.LengthPerSkeinMeters; // g/m
                        var weight = (decimal)(totalEnds * WarpLengthMeters) * linearDensity; // grams
                        totalWeight += weight;
                    }
                }
                return totalWeight;
            }
        }

        public double TotalWarpLengthMeters => WarpChains.Count >=1 ? WarpChains.Sum(w => w.TotalLengthMeters) :
            TotalEndsInWarp * WarpLengthMeters;
        public double TotalWeftLengthMeters
        {
            get
            {
                // total weft length = picks per cm * effective width (cm) * warp length (m)
                if (PicksPerCm > 0 && EffectiveWeavingWidthCm > 0 && WarpLengthMeters > 0)
                {
                    return PicksPerCm * EffectiveWeavingWidthCm * WarpLengthMeters;
                }
                return 0;
            }
        }

        public int TotalWarpSkeinsNeeded => WarpChains.Sum(w => w.SkeinsNeeded);

        // incorrect
        public decimal TotalYarnWeightGrams => Yarns.Sum(y => y.TotalWeightGrams);
        // incorrect
        public double TotalYarnLengthMeters => Yarns.Sum(y => y.TotalLengthMeters);
        public decimal TotalYarnPrice => Yarns.Sum(y => y.TotalPrice);

        // Administrative metadata
        public ProjectStatus Status { get; set; } = ProjectStatus.Planned;
        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset? StartedAt { get; set; }
        public DateTimeOffset LastUpdatedAt { get; set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset? FinishedAt { get; set; }

        // Convenience methods to update status & timestamps
        public void MarkStarted()
        {
            StartedAt ??= DateTimeOffset.UtcNow;
            Status = ProjectStatus.InProgress;
            UpdateTimestamp();
        }

        public void MarkFinished()
        {
            FinishedAt = DateTimeOffset.UtcNow;
            Status = ProjectStatus.Finished;
            UpdateTimestamp();
        }

        public void UpdateTimestamp()
        {
            LastUpdatedAt = DateTimeOffset.UtcNow;
        }
    }
}