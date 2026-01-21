using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DraftSiteBE.Data;
using DraftSiteBE.Models;
using DraftSiteBE.DTOs;

namespace DraftSiteBE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WarpChainsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public WarpChainsController(ApplicationDbContext db) => _db = db;

        // GET api/warpchains
        [HttpGet]
        public async Task<IEnumerable<WarpChain>> GetAll() => await _db.WarpChains.Include(w => w.Yarn).ToListAsync();

        // GET api/warpchains/{id}
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<WarpChain>> GetById(Guid id)
        {
            var chain = await _db.WarpChains.Include(w => w.Yarn).FirstOrDefaultAsync(w => w.Id == id);
            if (chain == null) return NotFound();
            return Ok(chain);
        }

        // POST api/warpchains
        [HttpPost]
        public async Task<ActionResult<WarpChain>> Create([FromBody] WarpChainCreateDto dto)
        {
            if (dto == null) return BadRequest("Request body is required.");

            // Basic required field validation
            if (dto.LoomProjectId == Guid.Empty) return BadRequest("LoomProjectId is required.");
            if (dto.Ends <= 0) return BadRequest("Ends must be greater than 0.");
            if (!dto.WarpLength.HasValue || dto.WarpLength.Value <= 0.0) return BadRequest("WarpLength (meters) must be provided and greater than 0.");

            // Validate project
            var projectExists = await _db.LoomProjects.AnyAsync(p => p.Id == dto.LoomProjectId);
            if (!projectExists) return BadRequest($"LoomProject {dto.LoomProjectId} does not exist.");

            // If YarnId specified (non-empty GUID), validate it
            var yarnIdProvided = dto.YarnId != Guid.Empty;
            if (yarnIdProvided)
            {
                var yarnExists = await _db.Yarns.AnyAsync(y => y.Id == dto.YarnId);
                if (!yarnExists) return BadRequest($"Yarn {dto.YarnId} does not exist.");
            }

            // Compute backend-handled auto-incremented Order for the given project.
            // Start at 1 when no chains exist for the project.
            var maxOrderForProject = await _db.WarpChains
                .Where(w => w.LoomProjectId == dto.LoomProjectId)
                .MaxAsync(w => (int?)w.Order) ?? 0;
            var nextOrder = maxOrderForProject + 1;

            var chain = new WarpChain
            {
                Id = Guid.NewGuid(),
                LoomProjectId = dto.LoomProjectId,
                // Order is assigned by backend (auto-increment per project)
                Order = nextOrder,
                Name = dto.Name,
                CrossCount = dto.CrossCount ?? "1x1",
                YarnId = yarnIdProvided ? dto.YarnId : Guid.Empty,
                Ends = dto.Ends,
                WarpLength = dto.WarpLength!.Value,
                Notes = dto.Notes
            };

            _db.WarpChains.Add(chain);
            await _db.SaveChangesAsync();

            // Return the saved entity including navigation property (Yarn) populated when available
            var saved = await _db.WarpChains.Include(w => w.Yarn).FirstOrDefaultAsync(w => w.Id == chain.Id);

            return CreatedAtAction(nameof(GetById), new { id = chain.Id }, saved ?? chain);
        }
    }
}