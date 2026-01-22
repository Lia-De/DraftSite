using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DraftSiteBE.Data;
using DraftSiteBE.Models;
using DraftSiteBE.Services;
using DraftSiteBE.DTOs;

namespace DraftSiteBE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class YarnsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly YarnValidationService _validationService;

        public YarnsController(ApplicationDbContext db, YarnValidationService validationService)
        {
            _db = db;
            _validationService = validationService;
        }

        // GET api/yarns
        [HttpGet]
        public async Task<IEnumerable<Yarn>> GetAll() => await _db.Yarns.ToListAsync();

        // GET api/yarns/{id}
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<Yarn>> GetById(Guid id)
        {
            var yarn = await _db.Yarns.FindAsync(id);
            if (yarn == null) return NotFound();
            return Ok(yarn);
        }

        // POST api/yarns
        [HttpPost]
        public async Task<ActionResult<Yarn>> Create([FromBody] Yarn yarn)
        {
            if (yarn == null) return BadRequest("Request body is required.");

            var validation = await _validationService.GetAsync();

            var errors = new List<string>();
            if (yarn.LengthPerSkeinMeters <= 0) errors.Add("LengthPerSkeinMeters must be > 0.");
            if (yarn.WeightPerSkeinGrams <= 0) errors.Add("WeightPerSkeinGrams must be > 0.");
            if (yarn.NumberOfSkeins < 0) errors.Add("NumberOfSkeins must be >= 0.");

            if (yarn.Ply.HasValue && (yarn.Ply < validation.PlyMin || yarn.Ply > validation.PlyMax))
                errors.Add($"Ply must be between {validation.PlyMin} and {validation.PlyMax} if specified.");

            if (yarn.ThicknessNM.HasValue && (yarn.ThicknessNM < validation.ThicknessMin || yarn.ThicknessNM > validation.ThicknessMax))
                errors.Add($"ThicknessNM must be between {validation.ThicknessMin} and {validation.ThicknessMax} if specified.");

            if (errors.Count > 0) return BadRequest(new { Errors = errors });

            if (yarn.Id == Guid.Empty) yarn.Id = Guid.NewGuid();

            // If assigned to a project, ensure project exists
            if (yarn.LoomProjectId.HasValue)
            {
                var projectExists = await _db.LoomProjects.AnyAsync(p => p.Id == yarn.LoomProjectId.Value);
                if (!projectExists) return BadRequest($"LoomProject {yarn.LoomProjectId} does not exist.");
            }

            _db.Yarns.Add(yarn);
            await _db.SaveChangesAsync();

            // Use CreatedAtAction so the framework resolves the action in this controller
            return CreatedAtAction(nameof(GetById), new { id = yarn.Id }, yarn);
        }

        // PATCH api/yarns/{id}
        // Update yarn fields using YarnUpdateDto. Moving a yarn between different projects is forbidden.
        [HttpPatch()]
        public async Task<IActionResult> Update( [FromBody] YarnUpdateDto dto)
        {
            if (dto == null) return BadRequest("Request body is required.");
            if (dto.Id != Guid.Empty) return BadRequest("Id in body must exist.");
            Guid? incomingProjectId = dto.LoomProjectId;
            if (!incomingProjectId.HasValue)
            {
                return BadRequest("LoomProjectId in body must exist.");
            }
            
            var validation = await _validationService.GetAsync();
            var errors = new List<string>();
            
            if (dto.LengthPerSkeinMeters.HasValue && dto.LengthPerSkeinMeters.Value <= 0) errors.Add("LengthPerSkeinMeters must be > 0.");
            if (dto.WeightPerSkeinGrams.HasValue && dto.WeightPerSkeinGrams.Value <= 0) errors.Add("WeightPerSkeinGrams must be > 0.");
            if (dto.NumberOfSkeins.HasValue && dto.NumberOfSkeins.Value < 0) errors.Add("NumberOfSkeins must be >= 0.");

            if (dto.Ply.HasValue && (dto.Ply < validation.PlyMin || dto.Ply > validation.PlyMax))
                errors.Add($"Ply must be between {validation.PlyMin} and {validation.PlyMax} if specified.");

            if (dto.ThicknessNM.HasValue && (dto.ThicknessNM < validation.ThicknessMin || dto.ThicknessNM > validation.ThicknessMax))
                errors.Add($"ThicknessNM must be between {validation.ThicknessMin} and {validation.ThicknessMax} if specified.");

            if (errors.Count > 0) return BadRequest(new { Errors = errors });

 
            // Load existing yarn (tracked)
            var existing = await _db.Yarns.FirstOrDefaultAsync(y => y.Id == dto.Id);
            if (existing == null) return NotFound($"Yarn {dto.Id} not found.");
            var anyChange = false;


            // UsageType
            if (dto.UsageType.HasValue && dto.UsageType.Value != existing.UsageType)
            {
                existing.UsageType = dto.UsageType.Value;
                anyChange = true;
            }

            // Strings: update only when provided and different
            if (dto.Brand != null && dto.Brand != existing.Brand)
            {
                existing.Brand = dto.Brand;
                anyChange = true;
            }
            if (dto.Color != null && dto.Color != existing.Color)
            {
                existing.Color = dto.Color;
                anyChange = true;
            }
            if (dto.ColorCode != null && dto.ColorCode != existing.ColorCode)
            {
                existing.ColorCode = dto.ColorCode;
                anyChange = true;
            }
            if (dto.DyeLot != null && dto.DyeLot != existing.DyeLot)
            {
                existing.DyeLot = dto.DyeLot;
                anyChange = true;
            }
            if (dto.Notes != null && dto.Notes != existing.Notes)
            {
                existing.Notes = dto.Notes;
                anyChange = true;
            }

            // Enums / simple scalars
            if (dto.FibreType.HasValue && dto.FibreType.Value != existing.FibreType)
            {
                existing.FibreType = dto.FibreType.Value;
                anyChange = true;
            }

            if (dto.Ply.HasValue && dto.Ply != existing.Ply)
            {
                existing.Ply = dto.Ply;
                anyChange = true;
            }

            if (dto.ThicknessNM.HasValue && dto.ThicknessNM != existing.ThicknessNM)
            {
                existing.ThicknessNM = dto.ThicknessNM;
                anyChange = true;
            }

            // Numeric measurements
            if (dto.WeightPerSkeinGrams.HasValue && dto.WeightPerSkeinGrams.Value != existing.WeightPerSkeinGrams)
            {
                existing.WeightPerSkeinGrams = dto.WeightPerSkeinGrams.Value;
                anyChange = true;
            }

            if (dto.LengthPerSkeinMeters.HasValue && dto.LengthPerSkeinMeters.Value != existing.LengthPerSkeinMeters)
            {
                existing.LengthPerSkeinMeters = dto.LengthPerSkeinMeters.Value;
                anyChange = true;
            }

            if (dto.NumberOfSkeins.HasValue && dto.NumberOfSkeins != existing.NumberOfSkeins)
            {
                existing.NumberOfSkeins = dto.NumberOfSkeins;
                anyChange = true;
            }

            if (dto.PricePerSkein.HasValue && dto.PricePerSkein != existing.PricePerSkein)
            {
                existing.PricePerSkein = dto.PricePerSkein;
                anyChange = true;
            }

            if (!anyChange) return BadRequest("No changes detected.");

            // Update timestamps on affected project(s)
            if (existing.LoomProjectId.HasValue)
            {
                var proj = await _db.LoomProjects.FindAsync(existing.LoomProjectId.Value);
                if (proj != null) proj.UpdateTimestamp();
            }

            try
            {
                await _db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return BadRequest("Failed to update Yarn.");
            }

            return Ok();
        }
    }
}