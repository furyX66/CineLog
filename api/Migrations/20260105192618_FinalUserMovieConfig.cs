using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class FinalUserMovieConfig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserMovies_Movies_MovieId",
                table: "UserMovies");

            migrationBuilder.DropIndex(
                name: "IX_UserMovies_InWatchlist",
                table: "UserMovies");

            migrationBuilder.AddColumn<bool>(
                name: "IsWatched",
                table: "UserMovies",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddCheckConstraint(
                name: "CK_UserMovie_NoBothLikeDislike",
                table: "UserMovies",
                sql: "\"IsLiked\" = false OR \"IsDisliked\" = false");

            migrationBuilder.AddForeignKey(
                name: "FK_UserMovies_Movies_MovieId",
                table: "UserMovies",
                column: "MovieId",
                principalTable: "Movies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserMovies_Movies_MovieId",
                table: "UserMovies");

            migrationBuilder.DropCheckConstraint(
                name: "CK_UserMovie_NoBothLikeDislike",
                table: "UserMovies");

            migrationBuilder.DropColumn(
                name: "IsWatched",
                table: "UserMovies");

            migrationBuilder.CreateIndex(
                name: "IX_UserMovies_InWatchlist",
                table: "UserMovies",
                column: "InWatchlist");

            migrationBuilder.AddForeignKey(
                name: "FK_UserMovies_Movies_MovieId",
                table: "UserMovies",
                column: "MovieId",
                principalTable: "Movies",
                principalColumn: "Id");
        }
    }
}
