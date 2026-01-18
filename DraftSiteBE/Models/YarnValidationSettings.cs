
using System;

namespace DraftSiteBE.Models
{
    public class YarnValidationSettings
    {
        // Singleton row to hold validation bounds for yarns
        public int Id { get; set; } = 1;

        public int PlyMin { get; set; } = 1;
        public int PlyMax { get; set; } = 3;

        public int ThicknessMin { get; set; } = 6;
        public int ThicknessMax { get; set; } = 36;

        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
    }
}