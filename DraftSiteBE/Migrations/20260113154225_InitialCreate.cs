using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DraftSiteBE.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LoomProjects",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    Owner = table.Column<string>(type: "TEXT", nullable: true),
                    WeavingWidthCm = table.Column<decimal>(type: "TEXT", nullable: false),
                    WarpLengthMeters = table.Column<double>(type: "REAL", nullable: false),
                    EndsPerCm = table.Column<double>(type: "REAL", nullable: false),
                    PicksPerCm = table.Column<double>(type: "REAL", nullable: false),
                    Status = table.Column<int>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "TEXT", nullable: false),
                    StartedAt = table.Column<DateTimeOffset>(type: "TEXT", nullable: true),
                    LastUpdatedAt = table.Column<DateTimeOffset>(type: "TEXT", nullable: true),
                    FinishedAt = table.Column<DateTimeOffset>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LoomProjects", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Tags",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tags", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Yarns",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    LoomProjectId = table.Column<Guid>(type: "TEXT", nullable: true),
                    UsageType = table.Column<int>(type: "INTEGER", nullable: false),
                    Brand = table.Column<string>(type: "TEXT", nullable: true),
                    Color = table.Column<string>(type: "TEXT", nullable: true),
                    FibreType = table.Column<int>(type: "INTEGER", nullable: false),
                    Ply = table.Column<int>(type: "INTEGER", nullable: true),
                    ThicknessNM = table.Column<int>(type: "INTEGER", nullable: true),
                    Notes = table.Column<string>(type: "TEXT", nullable: true),
                    WeightPerSkeinGrams = table.Column<decimal>(type: "TEXT", nullable: false),
                    LengthPerSkeinMeters = table.Column<double>(type: "REAL", nullable: false),
                    NumberOfSkeins = table.Column<int>(type: "INTEGER", nullable: false),
                    PricePerSkein = table.Column<decimal>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Yarns", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Yarns_LoomProjects_LoomProjectId",
                        column: x => x.LoomProjectId,
                        principalTable: "LoomProjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LoomProjectTag",
                columns: table => new
                {
                    LoomProjectsId = table.Column<Guid>(type: "TEXT", nullable: false),
                    TagsId = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LoomProjectTag", x => new { x.LoomProjectsId, x.TagsId });
                    table.ForeignKey(
                        name: "FK_LoomProjectTag_LoomProjects_LoomProjectsId",
                        column: x => x.LoomProjectsId,
                        principalTable: "LoomProjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_LoomProjectTag_Tags_TagsId",
                        column: x => x.TagsId,
                        principalTable: "Tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WarpChains",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: true),
                    Order = table.Column<int>(type: "INTEGER", nullable: false),
                    LoomProjectId = table.Column<Guid>(type: "TEXT", nullable: false),
                    YarnId = table.Column<Guid>(type: "TEXT", nullable: true),
                    Ends = table.Column<int>(type: "INTEGER", nullable: false),
                    WarpLength = table.Column<double>(type: "REAL", nullable: false),
                    Notes = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WarpChains", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WarpChains_LoomProjects_LoomProjectId",
                        column: x => x.LoomProjectId,
                        principalTable: "LoomProjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_WarpChains_Yarns_YarnId",
                        column: x => x.YarnId,
                        principalTable: "Yarns",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LoomProjectTag_TagsId",
                table: "LoomProjectTag",
                column: "TagsId");

            migrationBuilder.CreateIndex(
                name: "IX_WarpChains_LoomProjectId",
                table: "WarpChains",
                column: "LoomProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_WarpChains_YarnId",
                table: "WarpChains",
                column: "YarnId");

            migrationBuilder.CreateIndex(
                name: "IX_Yarns_LoomProjectId",
                table: "Yarns",
                column: "LoomProjectId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LoomProjectTag");

            migrationBuilder.DropTable(
                name: "WarpChains");

            migrationBuilder.DropTable(
                name: "Tags");

            migrationBuilder.DropTable(
                name: "Yarns");

            migrationBuilder.DropTable(
                name: "LoomProjects");
        }
    }
}
