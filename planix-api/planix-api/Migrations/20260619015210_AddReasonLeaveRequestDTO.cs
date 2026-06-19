using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace planix_api.Migrations
{
    /// <inheritdoc />
    public partial class AddReasonLeaveRequestDTO : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "11111111-1111-1111-1111-111111111111",
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "2f47333c-4ee8-4428-a37a-4f4524bc0b35", "AQAAAAIAAYagAAAAEDOVsDhPwPn9tfO63HuEXUFJtGsIr2lYYlBPt4vnFXrEHKlbDlXZlCSW1C5c8YYLmw==" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "11111111-1111-1111-1111-111111111111",
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "86b01e13-8d8f-47ac-b9dc-14e2bd1f1ff2", "AQAAAAIAAYagAAAAEOFoh55F2+neNQNdSzt5EKNILUxN5HKrzdGPjW4W7S8KWqDU2ycGSOi252Yd8rdHHA==" });
        }
    }
}
