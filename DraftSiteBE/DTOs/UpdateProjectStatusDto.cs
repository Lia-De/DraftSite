namespace DraftSiteBE.DTOs
{
    public class UpdateProjectStatusDto
    {
        public Guid ProjectId { get; set; }
        public int Status { get; set; }
    }
}