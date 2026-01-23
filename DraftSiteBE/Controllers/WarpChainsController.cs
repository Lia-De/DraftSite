using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
        public async Task<ActionResult<IEnumerable<ProjectEndsDto>>> Create([FromBody] List<WarpChainCreateDto> dtos)
        {
            if (dtos == null || dtos.Count == 0) return BadRequest("Request body must contain at least one WarpChain.");

            // Per-item basic validation with helpful index-based messages
            for (var i = 0; i < dtos.Count; i++)
            {
                var dto = dtos[i];
                if (dto.LoomProjectId == Guid.Empty) return BadRequest($"Item {i}: LoomProjectId is required.");
                if (dto.Ends <= 0) return BadRequest($"Item {i}: Ends must be greater than 0.");
                if (!dto.WarpLength.HasValue || dto.WarpLength.Value <= 0.0) return BadRequest($"Item {i}: WarpLength (meters) must be provided and greater than 0.");
                if (dto.YarnId == Guid.Empty) return BadRequest($"Item {i}: YarnId is required.");
            }

            // Validate projects in batch
            var projectIds = dtos.Select(d => d.LoomProjectId).Distinct().ToList();
            var existingProjectIds = await _db.LoomProjects.Where(p => projectIds.Contains(p.Id)).Select(p => p.Id).ToListAsync();
            var missingProjects = projectIds.Except(existingProjectIds).ToList();
            if (missingProjects.Count > 0)
                return BadRequest($"The following LoomProject Ids do not exist: {string.Join(", ", missingProjects)}");

            // Validate yarns in batch (treat Guid.Empty as "not provided")
            var yarnIds = dtos.Select(d => d.YarnId).Where(id => id != Guid.Empty).Distinct().ToList();
            if (yarnIds.Count > 0)
            {
                var existingYarnIds = await _db.Yarns.Where(y => yarnIds.Contains(y.Id)).Select(y => y.Id).ToListAsync();
                var missingYarns = yarnIds.Except(existingYarnIds).ToList();
                if (missingYarns.Count > 0)
                    return BadRequest($"The following Yarn Ids do not exist: {string.Join(", ", missingYarns)}");
            }

            // Compute starting max order per project (0 when none exist)
            var maxOrders = await _db.WarpChains
                .Where(w => projectIds.Contains(w.LoomProjectId))
                .GroupBy(w => w.LoomProjectId)
                .Select(g => new { ProjectId = g.Key, MaxOrder = g.Max(w => w.Order) })
                .ToListAsync();

            var currentMaxByProject = projectIds.ToDictionary(
                id => id,
                id => maxOrders.FirstOrDefault(m => m.ProjectId == id)?.MaxOrder ?? 0
            );

            // Map DTOs to entities and assign backend-handled auto-incremented Order per project
            var toCreate = new List<WarpChain>();
            foreach (var dto in dtos)
            {
                var nextOrder = ++currentMaxByProject[dto.LoomProjectId];

                var chain = new WarpChain
                {
                    Id = Guid.NewGuid(),
                    LoomProjectId = dto.LoomProjectId,
                    Order = nextOrder,
                    Name = dto.Name,
                    CrossCount = dto.CrossCount ?? "1x1",
                    YarnId = dto.YarnId,
                    Ends = dto.Ends,
                    WarpLength = dto.WarpLength!.Value,
                    Notes = dto.Notes
                };

                toCreate.Add(chain);
            }

            // Ensure projects are marked as started (active) if not already
            var projectsToUpdate = await _db.LoomProjects.Where(p => projectIds.Contains(p.Id)).ToListAsync();
            foreach (var proj in projectsToUpdate)
            {
                if (proj.Status != ProjectStatus.InProgress)
                {
                    proj.MarkStarted();
                }
            }

            _db.WarpChains.AddRange(toCreate);
            await _db.SaveChangesAsync();

            // Reload created entities with Yarn navigation when available (not strictly required for totals)
            var createdIds = toCreate.Select(c => c.Id).ToList();
            var saved = await _db.WarpChains.Include(w => w.Yarn).Where(w => createdIds.Contains(w.Id)).ToListAsync();

            // Compute total ends in warpchains for each affected project (includes pre-existing and newly added chains)
            var totals = await _db.WarpChains
                .Where(w => projectIds.Contains(w.LoomProjectId))
                .GroupBy(w => w.LoomProjectId)
                .Select(g => new { ProjectId = g.Key, TotalEnds = g.Sum(w => w.Ends) })
                .ToListAsync();

            // Build result using the top-level DTO type in DraftSiteBE.DTOs
            var result = projectIds
                .Select(id =>
                {
                    var t = totals.FirstOrDefault(x => x.ProjectId == id);
                    return new ProjectEndsDto
                    {
                        LoomProjectId = id,
                        TotalEnds = t?.TotalEnds ?? 0
                    };
                })
                .ToList();

            // Return 201 with the list of projects and their total ends
            return CreatedAtAction(nameof(GetAll), null, result);
        }
    }
}