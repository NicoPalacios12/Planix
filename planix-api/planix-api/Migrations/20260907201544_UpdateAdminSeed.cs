using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace planix_api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAdminSeed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "11111111-1111-1111-1111-111111111111",
                columns: new[] { "ConcurrencyStamp", "Email", "NormalizedEmail", "PasswordHash" },
                values: new object[] { "23575f3e-1c88-4b72-bc48-fb217b155855", "admin@exemple.com", "ADMIN@EXEMPLE.COM", "AQAAAAIAAYagAAAAEJFCqMwlII9fLVbme1CrGEkmxbKk3PPJdl5KP92zI0w9odM+YSNMXM3omkSZUZGKAg==" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "11111111-1111-1111-1111-111111111111",
                columns: new[] { "ConcurrencyStamp", "Email", "NormalizedEmail", "PasswordHash" },
                values: new object[] { "2f47333c-4ee8-4428-a37a-4f4524bc0b35", "admin@gmail.com", "ADMIN@GMAIL.COM", "AQAAAAIAAYagAAAAEDOVsDhPwPn9tfO63HuEXUFJtGsIr2lYYlBPt4vnFXrEHKlbDlXZlCSW1C5c8YYLmw==" });
        }
    }
}
