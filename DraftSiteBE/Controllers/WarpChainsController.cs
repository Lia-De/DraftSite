using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DraftSiteBE.Data;
using DraftSiteBE.Models;

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
        public async Task<ActionResult<WarpChain>> Create([FromBody] WarpChain chain)
        {
            if (chain == null) return BadRequest("Request body is required.");
            if (chain.Id == Guid.Empty) chain.Id = Guid.NewGuid();

            // Validate project
            var projectExists = await _db.LoomProjects.AnyAsync(p => p.Id == chain.LoomProjectId);
            if (!projectExists) return BadRequest($"LoomProject {chain.LoomProjectId} does not exist.");

            // If YarnId specified, validate it
            if (chain.YarnId.HasValue)
            {
                var yarnExists = await _db.Yarns.AnyAsync(y => y.Id == chain.YarnId.Value);
                if (!yarnExists) return BadRequest($"Yarn {chain.YarnId} does not exist.");
            }

            _db.WarpChains.Add(chain);
            await _db.SaveChangesAsync();

            // Use CreatedAtAction to avoid global route name collision
            return CreatedAtAction(nameof(GetById), new { id = chain.Id }, chain);
        }
    }
}