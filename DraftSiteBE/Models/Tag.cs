namespace DraftSiteBE.Models
{
    public class Tag
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        // Additional properties can be added as needed
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime LastTagged { get; set; } = DateTime.UtcNow;
        // navigation properties to LoomProjects
        public List<Guid>? LoomProjectId { get; set; }
        public List<LoomProject>? LoomProjects { get; set; }
    }
}