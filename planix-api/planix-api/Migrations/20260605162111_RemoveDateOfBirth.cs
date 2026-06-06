using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace planix_api.Migrations
{
    /// <inheritdoc />
    public partial class RemoveDateOfBirth : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DateOfBirth",
                table: "AspNetUsers");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "11111111-1111-1111-1111-111111111111",
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "4921f272-4eab-4cc1-b242-5b463893fd39", "AQAAAAIAAYagAAAAEFfhZwaFbxiTZbXVjS7uXqkhM7ZI5pZMSjSlm03JjRbnDOIFSuywEaTrDPz/0oEprQ==" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DateOfBirth",
                table: "AspNetUsers",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "11111111-1111-1111-1111-111111111111",
                columns: new[] { "ConcurrencyStamp", "DateOfBirth", "PasswordHash" },
                values: new object[] { "0b6a09dc-1d1f-4fb7-87a7-7ae21a4c2bd5", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "AQAAAAIAAYagAAAAEEO927se3nW0elhuOHJkYzBxEtlbBTrDXv35VF7OsFjJbsUxIOHqBRBB/c19giIleg==" });
        }
    }
}
