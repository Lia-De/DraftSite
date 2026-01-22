namespace DraftSiteBE.DTOs
{
    public class ProjectEndsDto
    {
        // DTO returned by WarpChains Controller Create: total ends per project
        public Guid LoomProjectId { get; set; }
        public int TotalEnds { get; set; }

    }
}
