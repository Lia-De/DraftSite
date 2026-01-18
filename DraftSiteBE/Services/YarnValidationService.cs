
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using DraftSiteBE.Data;
using DraftSiteBE.Models;

namespace DraftSiteBE.Services
{
    // scoped service that persists / retrieves yarn validation bounds from the database
    public class YarnValidationService
    {
        private readonly ApplicationDbContext _db;
        private readonly IConfiguration _config;

        public YarnValidationService(ApplicationDbContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        // Return the single settings row, creating it with sensible defaults (or config overrides) if missing.
        public async Task<YarnValidationSettings> GetAsync()
        {
            var settings = await _db.YarnValidationSettings.FirstOrDefaultAsync();

            if (settings != null) return settings;

            // create defaults, but allow appsettings overrides
            var section = _config.GetSection("YarnValidation");
            var plyMin = section.GetValue<int?>("PlyMin") ?? 1;
            var plyMax = section.GetValue<int?>("PlyMax") ?? 3;
            var thicknessMin = section.GetValue<int?>("ThicknessMin") ?? 6;
            var thicknessMax = section.GetValue<int?>("ThicknessMax") ?? 36;

            settings = new YarnValidationSettings
            {
                Id = 1,
                PlyMin = plyMin,
                PlyMax = plyMax,
                ThicknessMin = thicknessMin,
                ThicknessMax = thicknessMax,
                CreatedAt = System.DateTimeOffset.UtcNow,
                UpdatedAt = System.DateTimeOffset.UtcNow
            };

            _db.YarnValidationSettings.Add(settings);
            await _db.SaveChangesAsync();

            return settings;
        }

        // Update bounds and persist
        public async Task<YarnValidationSettings> UpdateAsync(int plyMin, int plyMax, int thicknessMin, int thicknessMax)
        {
            if (plyMin <= 0) throw new System.ArgumentException(nameof(plyMin));
            if (plyMax < plyMin) throw new System.ArgumentException(nameof(plyMax));
            if (thicknessMin <= 0) throw new System.ArgumentException(nameof(thicknessMin));
            if (thicknessMax < thicknessMin) throw new System.ArgumentException(nameof(thicknessMax));

            var settings = await _db.YarnValidationSettings.FirstOrDefaultAsync();

            if (settings == null)
            {
                settings = new YarnValidationSettings { Id = 1 };
                _db.YarnValidationSettings.Add(settings);
            }

            settings.PlyMin = plyMin;
            settings.PlyMax = plyMax;
            settings.ThicknessMin = thicknessMin;
            settings.ThicknessMax = thicknessMax;
            settings.UpdatedAt = System.DateTimeOffset.UtcNow;

            await _db.SaveChangesAsync();

            return settings;
        }
    }
}