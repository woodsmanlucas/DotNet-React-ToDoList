using Microsoft.EntityFrameworkCore.Migrations;

namespace roleDemo.Migrations
{
    public partial class updatetodo : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "userEmail",
                table: "ToDos",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "ToDos",
                keyColumn: "Id",
                keyValue: 1,
                column: "userEmail",
                value: "woodsman.lucas@gmail.com");

            migrationBuilder.UpdateData(
                table: "ToDos",
                keyColumn: "Id",
                keyValue: 2,
                column: "userEmail",
                value: "woodsman.lucas@gmail.com");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "userEmail",
                table: "ToDos");
        }
    }
}
