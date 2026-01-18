using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DraftSiteBE.Data;
using DraftSiteBE.Models;
using DraftSiteBE.Services;

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
    }
}