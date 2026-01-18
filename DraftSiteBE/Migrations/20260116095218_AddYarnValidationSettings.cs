using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DraftSiteBE.Migrations
{
    /// <inheritdoc />
    public partial class AddYarnValidationSettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LoomProjectTag_Tags_TagsId",
                table: "LoomProjectTag");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Tags",
                table: "Tags");

            migrationBuilder.RenameTable(
                name: "Tags",
                newName: "Tag");

            migrationBuilder.AddColumn<string>(
                name: "ColorCode",
                table: "Yarns",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DyeLot",
                table: "Yarns",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CrossCount",
                table: "WarpChains",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<DateTimeOffset>(
                name: "LastUpdatedAt",
                table: "LoomProjects",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)),
                oldClrType: typeof(DateTimeOffset),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "EndsInput",
                table: "LoomProjects",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "InputEndsInWarp",
                table: "LoomProjects",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "WidthInput",
                table: "LoomProjects",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Tag",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "LastTagged",
                table: "Tag",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "LoomProjectId",
                table: "Tag",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Tag",
                table: "Tag",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "YarnValidationSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    PlyMin = table.Column<int>(type: "INTEGER", nullable: false),
                    PlyMax = table.Column<int>(type: "INTEGER", nullable: false),
                    ThicknessMin = table.Column<int>(type: "INTEGER", nullable: false),
                    ThicknessMax = table.Column<int>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_YarnValidationSettings", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_LoomProjectTag_Tag_TagsId",
                table: "LoomProjectTag",
                column: "TagsId",
                principalTable: "Tag",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LoomProjectTag_Tag_TagsId",
                table: "LoomProjectTag");

            migrationBuilder.DropTable(
                name: "YarnValidationSettings");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Tag",
                table: "Tag");

            migrationBuilder.DropColumn(
                name: "ColorCode",
                table: "Yarns");

            migrationBuilder.DropColumn(
                name: "DyeLot",
                table: "Yarns");

            migrationBuilder.DropColumn(
                name: "CrossCount",
                table: "WarpChains");

            migrationBuilder.DropColumn(
                name: "EndsInput",
                table: "LoomProjects");

            migrationBuilder.DropColumn(
                name: "InputEndsInWarp",
                table: "LoomProjects");

            migrationBuilder.DropColumn(
                name: "WidthInput",
                table: "LoomProjects");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Tag");

            migrationBuilder.DropColumn(
                name: "LastTagged",
                table: "Tag");

            migrationBuilder.DropColumn(
                name: "LoomProjectId",
                table: "Tag");

            migrationBuilder.RenameTable(
                name: "Tag",
                newName: "Tags");

            migrationBuilder.AlterColumn<DateTimeOffset>(
                name: "LastUpdatedAt",
                table: "LoomProjects",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(DateTimeOffset),
                oldType: "TEXT");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Tags",
                table: "Tags",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_LoomProjectTag_Tags_TagsId",
                table: "LoomProjectTag",
                column: "TagsId",
                principalTable: "Tags",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
