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
    public class ProjectsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public ProjectsController(ApplicationDbContext db) => _db = db;

        // GET api/projects
        [HttpGet]
        public async Task<IEnumerable<LoomProject>> GetAll()
        {
            return await _db.LoomProjects.ToListAsync();
        }

        // GET api/projects/{id}
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<LoomProject>> GetById(Guid id)
        {
            var project = await _db.LoomProjects
                .Include(p => p.Yarns)
                .Include(p => p.WarpChains)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null) return NotFound();
            return Ok(project);
        }

        // POST api/projects
        // Accept a DTO so we control what input is required and how it maps to the LoomProject model.
        [HttpPost]
        public async Task<ActionResult<LoomProject>> Create([FromBody] LoomProjectCreateDto dto)
        {
            if (dto == null) return BadRequest("Project body required.");

            var errors = new List<string>();

            if (string.IsNullOrWhiteSpace(dto.Name)) errors.Add("Name is required.");

            // require either width or total ends supplied (and EndsPerCm > 0)
            var hasWidth = dto.WeavingWidthCm.HasValue && dto.WeavingWidthCm.Value > 0m;
            var hasEnds = dto.InputEndsInWarp.HasValue && dto.InputEndsInWarp.Value > 0;
            if (!hasWidth && !hasEnds)
            {
                errors.Add("Either WeavingWidthCm or InputEndsInWarp must be provided and greater than 0.");
            }

            if (dto.EndsPerCm <= 0) errors.Add("EndsPerCm must be greater than 0.");

            // Prepare project entity
            var project = new LoomProject
            {
                Id = Guid.NewGuid(),
                Name = dto.Name.Trim(),
                Description = dto.Description?.Trim(),
                Owner = dto.Owner?.Trim(),
                WeavingWidthCm = dto.WeavingWidthCm ?? 0m,
                WidthInput = hasWidth,
                InputEndsInWarp = dto.InputEndsInWarp ?? 0,
                EndsInput = hasEnds,
                EndsPerCm = dto.EndsPerCm,
                PicksPerCm = dto.PicksPerCm,
                WarpLengthMeters = dto.WarpLengthMeters
            };

            // Tags: DTO provides list of strings -> create Tag objects
            if (dto.Tags != null && dto.Tags.Any())
            {
                project.Tags = dto.Tags
                    .Where(t => !string.IsNullOrWhiteSpace(t))
                    .Select(t => new Tag { Id = Guid.NewGuid(), Name = t!.Trim() })
                    .ToList();
            }

            // Validate and prepare inline yarns
            var inlineYarnIds = new HashSet<Guid>();
            if (dto.Yarns != null && dto.Yarns.Any())
            {
                project.Yarns = new List<Yarn>();
                foreach (var y in dto.Yarns)
                {
                    if (y == null) continue;
                    if (y.Id == Guid.Empty) y.Id = Guid.NewGuid();
                    y.LoomProjectId = project.Id;

                    if (y.LengthPerSkeinMeters <= 0) errors.Add($"Inline Yarn {y.Id}: LengthPerSkeinMeters must be > 0.");
                    if (y.WeightPerSkeinGrams <= 0) errors.Add($"Inline Yarn {y.Id}: WeightPerSkeinGrams must be > 0.");
                    if (y.NumberOfSkeins < 0) errors.Add($"Inline Yarn {y.Id}: NumberOfSkeins must be >= 0.");
                    if (y.Ply.HasValue && (y.Ply < 1 || y.Ply > 3)) errors.Add($"Inline Yarn {y.Id}: Ply must be between 1 and 3 if specified.");
                    if (y.ThicknessNM.HasValue && (y.ThicknessNM < 6 || y.ThicknessNM > 36)) errors.Add($"Inline Yarn {y.Id}: ThicknessNM must be between 6 and 36 if specified.");

                    project.Yarns.Add(y);
                    inlineYarnIds.Add(y.Id);
                }
            }

            // Validate and prepare warp chains
            if (dto.WarpChains != null && dto.WarpChains.Any())
            {
                project.WarpChains = new List<WarpChain>();
                foreach (var w in dto.WarpChains)
                {
                    if (w == null) continue;
                    if (w.Id == Guid.Empty) w.Id = Guid.NewGuid();
                    // set LoomProjectId now so EF will track relationship
                    w.LoomProjectId = project.Id;

                    if (w.Ends <= 0) errors.Add($"WarpChain {w.Id}: Ends must be > 0.");
                    if (w.WarpLength <= 0) errors.Add($"WarpChain {w.Id}: WarpLength must be > 0.");

                    if (w.YarnId.HasValue && !inlineYarnIds.Contains(w.YarnId.Value))
                    {
                        var yarnExists = await _db.Yarns.AnyAsync(y => y.Id == w.YarnId.Value);
                        if (!yarnExists) errors.Add($"WarpChain {w.Id}: referenced Yarn {w.YarnId} does not exist.");
                    }

                    project.WarpChains.Add(w);
                }
            }

            if (errors.Count > 0) return BadRequest(new { Errors = errors });

            // Add inline yarns first so FK references from warp chains are valid
            if (project.Yarns != null && project.Yarns.Count > 0)
            {
                _db.Yarns.AddRange(project.Yarns);
            }

            // Add project (warps will be saved as children)
            _db.LoomProjects.Add(project);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = project.Id }, project);
        }

        // PATCH api/projects/parameters
        // Update numeric weaving parameters for a project (width, ends per cm, picks per cm, total ends).
        [HttpPatch("parameters")]
        public async Task<ActionResult<LoomProject>> UpdateParameters([FromBody] UpdateProjectParametersDto dto)
        {
            if (dto == null) return BadRequest("Request body required.");
            if (dto.ProjectId == Guid.Empty) return BadRequest("ProjectId is required.");

            // fetch project with navigation properties so we can return the updated state
            var project = await _db.LoomProjects
                .Include(p => p.Yarns)
                .Include(p => p.WarpChains)
                .FirstOrDefaultAsync(p => p.Id == dto.ProjectId);

            if (project == null) return NotFound($"Project {dto.ProjectId} not found.");

            var errors = new List<string>();
            var anyChange = false;

            if (dto.WeavingWidthCm.HasValue)
            {
                if (dto.WeavingWidthCm.Value <= 0m) errors.Add("WeavingWidthCm must be > 0.");
                else
                {
                    project.WeavingWidthCm = dto.WeavingWidthCm.Value;
                    project.WidthInput = true;
                    anyChange = true;
                }
            }

            if (dto.InputEndsInWarp.HasValue)
            {
                if (dto.InputEndsInWarp.Value <= 0) errors.Add("InputEndsInWarp must be > 0.");
                else
                {
                    project.InputEndsInWarp = dto.InputEndsInWarp.Value;
                    project.EndsInput = true;
                    project.WidthInput = false;
                    anyChange = true;
                }
            }

            if (dto.EndsPerCm.HasValue)
            {
                if (dto.EndsPerCm.Value <= 0) errors.Add("EndsPerCm must be > 0.");
                else
                {
                    project.EndsPerCm = dto.EndsPerCm.Value;
                    project.EndsInput = false;
                    anyChange = true;
                }
            }

            if (dto.PicksPerCm.HasValue)
            {
                if (dto.PicksPerCm.Value < 0) errors.Add("PicksPerCm must be >= 0.");
                else
                {
                    project.PicksPerCm = dto.PicksPerCm.Value;
                    anyChange = true;
                }
            }

            if (dto.WarpLengthMeters.HasValue)
            {
                if (dto.WarpLengthMeters.Value <= 0) errors.Add("WarpLengthMeters must be > 0.");
                else
                {
                    project.WarpLengthMeters = dto.WarpLengthMeters.Value;
                    anyChange = true;
                }
            }

            if (errors.Count > 0) return BadRequest(new { Errors = errors });
            if (!anyChange) return BadRequest("No updatable parameters provided.");

            project.UpdateTimestamp();

            await _db.SaveChangesAsync();

            // re-read to ensure computed values / navigation properties are up-to-date
            var updated = await _db.LoomProjects
                .FirstOrDefaultAsync(p => p.Id == project.Id);

            return Ok(updated);
        }
    }
}