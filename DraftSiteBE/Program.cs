using System;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using DraftSiteBE.Data;
using DraftSiteBE.Models;
using DraftSiteBE.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(o =>
    {
        // Prevent reference-cycle failures when returning entities with navigation properties
        o.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

// Register EF Core with SQLite. Uses connection string "DefaultConnection" if present,
// otherwise falls back to local file "loom.db".
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=loom.db";
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(connectionString));

// YarnValidationService persisted in DB
builder.Services.AddScoped<YarnValidationService>();

// Swagger / OpenAPI (Swashbuckle)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "DraftSiteBE API",
        Version = "v1",
        Description = "API for loom projects, yarns and warp chains"
    });

    // Include XML comments when available (enable XML documentation file in project properties)
    try
    {
        var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
        var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
        if (File.Exists(xmlPath))
        {
            c.IncludeXmlComments(xmlPath);
        }
    }
    catch
    {
        // ignore XML comment inclusion failures
    }

    // Optional: group actions by controller name
    c.TagActionsBy(api =>
    {
        var controller = api.ActionDescriptor.RouteValues["controller"];
        return new[] { controller ?? "Default" };
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", p =>
        //p.AllowAnyOrigin()      // in production restrict origins
         p.WithOrigins("http://127.0.0.1:5173", "http://localhost:5173").AllowCredentials()
         .AllowAnyMethod()
         .AllowAnyHeader());
});

var app = builder.Build();

// Check configuration to decide whether to seed data.
// Configure this in appsettings.json: { "SeedData": { "Enabled": true } }
var seedEnabled = app.Configuration.GetValue<bool>("SeedData:Enabled", false);

if (seedEnabled)
{
    try
    {
        var seedPath = Path.Combine(app.Environment.ContentRootPath, "Data", "yarns.json");
        if (File.Exists(seedPath))
        {
            using var scope = app.Services.CreateScope();
            var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("DataSeed");
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            // Apply migrations (creates DB if necessary). If you prefer EnsureCreated(), replace this call.
            db.Database.Migrate();

            var json = File.ReadAllText(seedPath);
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };
            options.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));

            var yarns = JsonSerializer.Deserialize<List<Yarn>>(json, options) ?? new List<Yarn>();

            // Insert only yarns that do not already exist (by Id)
            var existingIds = db.Yarns.Select(y => y.Id).ToHashSet();
            var toAdd = yarns.Where(y => y != null && !existingIds.Contains(y.Id)).ToList();

            if (toAdd.Count > 0)
            {
                db.Yarns.AddRange(toAdd);
                db.SaveChanges();
                logger.LogInformation("Seeded {Count} yarn(s) from {File}.", toAdd.Count, seedPath);
            }
            else
            {
                logger.LogInformation("No new yarns to seed from {File}.", seedPath);
            }
        }
    }
    catch (Exception ex)
    {
        // Log but don't stop the app from starting
        var loggerFactory = app.Services.GetService<ILoggerFactory>();
        loggerFactory?.CreateLogger("DataSeed")?.LogError(ex, "An error occurred while seeding the database.");
    }
}

// Ensure migrations applied for validation table and create default row if missing
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.Migrate();

    // Ensure a default settings row exists via YarnValidationService
    var validationService = scope.ServiceProvider.GetRequiredService<YarnValidationService>();
    _ = await validationService.GetAsync();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // Show Swagger UI at application root in Development for convenience
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "DraftSiteBE API v1");
        c.RoutePrefix = string.Empty; // root ("/")
    });
}
else
{
    // In production expose swagger under /swagger
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "DraftSiteBE API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseCors("DevCors");

app.MapControllers();

app.Run();
