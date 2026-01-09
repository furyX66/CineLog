using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class ChangeMovieModelToTMDBType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "Movies");

            migrationBuilder.RenameColumn(
                name: "ReleaseYear",
                table: "Movies",
                newName: "VoteCount");

            migrationBuilder.RenameColumn(
                name: "Rating",
                table: "Movies",
                newName: "VoteAverage");

            migrationBuilder.RenameColumn(
                name: "PosterUrl",
                table: "Movies",
                newName: "ReleaseDate");

            migrationBuilder.RenameColumn(
                name: "Genre",
                table: "Movies",
                newName: "OriginalLanguage");

            migrationBuilder.AddColumn<bool>(
                name: "Adult",
                table: "Movies",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "BackdropPath",
                table: "Movies",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OriginalTitle",
                table: "Movies",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Overview",
                table: "Movies",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Popularity",
                table: "Movies",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "PosterPath",
                table: "Movies",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Runtime",
                table: "Movies",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TmdbId",
                table: "Movies",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Adult",
                table: "Movies");

            migrationBuilder.DropColumn(
                name: "BackdropPath",
                table: "Movies");

            migrationBuilder.DropColumn(
                name: "OriginalTitle",
                table: "Movies");

            migrationBuilder.DropColumn(
                name: "Overview",
                table: "Movies");

            migrationBuilder.DropColumn(
                name: "Popularity",
                table: "Movies");

            migrationBuilder.DropColumn(
                name: "PosterPath",
                table: "Movies");

            migrationBuilder.DropColumn(
                name: "Runtime",
                table: "Movies");

            migrationBuilder.DropColumn(
                name: "TmdbId",
                table: "Movies");

            migrationBuilder.RenameColumn(
                name: "VoteCount",
                table: "Movies",
                newName: "ReleaseYear");

            migrationBuilder.RenameColumn(
                name: "VoteAverage",
                table: "Movies",
                newName: "Rating");

            migrationBuilder.RenameColumn(
                name: "ReleaseDate",
                table: "Movies",
                newName: "PosterUrl");

            migrationBuilder.RenameColumn(
                name: "OriginalLanguage",
                table: "Movies",
                newName: "Genre");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Movies",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
