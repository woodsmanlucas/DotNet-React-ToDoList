using Microsoft.EntityFrameworkCore.Migrations;

namespace roleDemo.Migrations
{
    public partial class createtodo : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ToDos",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Priority = table.Column<int>(nullable: false),
                    Description = table.Column<string>(nullable: true),
                    IsComplete = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ToDos", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "ToDos",
                columns: new[] { "Id", "Description", "IsComplete", "Priority" },
                values: new object[] { 1, "Clean house", false, 1 });

            migrationBuilder.InsertData(
                table: "ToDos",
                columns: new[] { "Id", "Description", "IsComplete", "Priority" },
                values: new object[] { 2, "Bake cake", false, 3 });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ToDos");
        }
    }
}
