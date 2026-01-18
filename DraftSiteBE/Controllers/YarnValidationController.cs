using Microsoft.AspNetCore.Mvc;
using DraftSiteBE.Models;
using DraftSiteBE.Services;
using DraftSiteBE.DTOs;

namespace DraftSiteBE.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/yarn-validation")]
    public class YarnValidationController : ControllerBase
    {
        private readonly YarnValidationService _service;

        public YarnValidationController(YarnValidationService service) => _service = service;

        // GET api/admin/yarn-validation
        [HttpGet]
        public async Task<ActionResult<UpdateYarnValidationDto>> Get()
        {
            var settings = await _service.GetAsync();

            var dto = new UpdateYarnValidationDto
            {
                PlyMin = settings.PlyMin,
                PlyMax = settings.PlyMax,
                ThicknessMin = settings.ThicknessMin,
                ThicknessMax = settings.ThicknessMax
            };

            return Ok(dto);
        }

        // PUT api/admin/yarn-validation
        [HttpPut]
        public async Task<ActionResult<YarnValidationSettings>> Update([FromBody] UpdateYarnValidationDto dto)
        {
            if (dto == null) return BadRequest("Body required.");
            if (dto.PlyMin <= 0 || dto.PlyMax < dto.PlyMin) return BadRequest("Invalid ply min/max.");
            if (dto.ThicknessMin <= 0 || dto.ThicknessMax < dto.ThicknessMin) return BadRequest("Invalid thickness min/max.");

            var updated = await _service.UpdateAsync(dto.PlyMin, dto.PlyMax, dto.ThicknessMin, dto.ThicknessMax);
            return Ok(updated);
        }

    }
}