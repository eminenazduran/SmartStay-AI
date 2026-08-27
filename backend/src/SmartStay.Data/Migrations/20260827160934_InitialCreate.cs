using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartStay.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Listings",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NeighbourhoodCleansed = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    RoomType = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Accommodates = table.Column<int>(type: "int", nullable: false),
                    Bedrooms = table.Column<double>(type: "float(5)", precision: 5, scale: 1, nullable: false),
                    Beds = table.Column<double>(type: "float(5)", precision: 5, scale: 1, nullable: false),
                    Bathrooms = table.Column<double>(type: "float(5)", precision: 5, scale: 1, nullable: false),
                    Latitude = table.Column<double>(type: "float(10)", precision: 10, scale: 7, nullable: false),
                    Longitude = table.Column<double>(type: "float(10)", precision: 10, scale: 7, nullable: false),
                    NumberOfReviews = table.Column<int>(type: "int", nullable: false),
                    ReviewScoresRating = table.Column<double>(type: "float(5)", precision: 5, scale: 2, nullable: false),
                    ReviewsPerMonth = table.Column<double>(type: "float(6)", precision: 6, scale: 2, nullable: false),
                    MinimumNights = table.Column<int>(type: "int", nullable: false),
                    Availability365 = table.Column<int>(type: "int", nullable: false),
                    Amenities = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Listings", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Listings_NeighbourhoodCleansed",
                table: "Listings",
                column: "NeighbourhoodCleansed");

            migrationBuilder.CreateIndex(
                name: "IX_Listings_Price",
                table: "Listings",
                column: "Price");

            migrationBuilder.CreateIndex(
                name: "IX_Listings_RoomType",
                table: "Listings",
                column: "RoomType");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Listings");
        }
    }
}
