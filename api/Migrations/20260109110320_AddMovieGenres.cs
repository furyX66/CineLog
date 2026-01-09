using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddMovieGenres : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OriginalLanguage",
                table: "Movies");

            migrationBuilder.AddColumn<string>(
                name: "Genres",
                table: "Movies",
                type: "jsonb",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Genres",
                table: "Movies");

            migrationBuilder.AddColumn<string>(
                name: "OriginalLanguage",
                table: "Movies",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
