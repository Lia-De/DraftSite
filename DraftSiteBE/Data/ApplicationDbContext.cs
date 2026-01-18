using Microsoft.EntityFrameworkCore;
using DraftSiteBE.Models;

namespace DraftSiteBE.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
        public ApplicationDbContext()
        {
            
        }

        public DbSet<LoomProject> LoomProjects { get; set; } = null!;
        public DbSet<Yarn> Yarns { get; set; } = null!;
        public DbSet<WarpChain> WarpChains { get; set; } = null!;
        public DbSet<YarnValidationSettings> YarnValidationSettings { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<LoomProject>()
                .HasMany(p => p.Yarns)
                .WithOne(y => y.LoomProject)
                .HasForeignKey(y => y.LoomProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<LoomProject>()
                .HasMany(p => p.WarpChains)
                .WithOne(w => w.LoomProject)
                .HasForeignKey(w => w.LoomProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<WarpChain>()
                .HasOne(w => w.Yarn)
                .WithMany()
                .HasForeignKey(w => w.YarnId)
                .OnDelete(DeleteBehavior.SetNull);

            // Configure YarnValidationSettings as a single-row table (Id = 1)
            modelBuilder.Entity<YarnValidationSettings>()
                .HasKey(x => x.Id);

            // Optional: ensure a default seed can be added later by migrations.
        }
    }
}