using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class InitDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "role",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedById = table.Column<int>(type: "int", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedById = table.Column<int>(type: "int", nullable: true),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_role", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "user",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    fullname = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    telephone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    username = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    password = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedById = table.Column<int>(type: "int", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedById = table.Column<int>(type: "int", nullable: true),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "user_role",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    RoleId = table.Column<int>(type: "int", nullable: false),
                    CreatedById = table.Column<int>(type: "int", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedById = table.Column<int>(type: "int", nullable: true),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_role", x => x.Id);
                    table.ForeignKey(
                        name: "FK_user_role_role_RoleId",
                        column: x => x.RoleId,
                        principalTable: "role",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_user_role_user_UserId",
                        column: x => x.UserId,
                        principalTable: "user",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "role",
                columns: new[] { "Id", "CreatedById", "CreatedDate", "IsDeleted", "name", "UpdatedById", "UpdatedDate" },
                values: new object[,]
                {
                    { 1, null, new DateTime(2023, 10, 23, 16, 29, 19, 179, DateTimeKind.Local).AddTicks(5247), false, "ADMIN", null, null },
                    { 2, null, new DateTime(2023, 10, 23, 16, 29, 19, 179, DateTimeKind.Local).AddTicks(5248), false, "CONTENT CREATOR", null, null },
                    { 3, null, new DateTime(2023, 10, 23, 16, 29, 19, 179, DateTimeKind.Local).AddTicks(5249), false, "SALE", null, null }
                });

            migrationBuilder.InsertData(
                table: "user",
                columns: new[] { "Id", "address", "CreatedById", "CreatedDate", "email", "fullname", "IsDeleted", "password", "telephone", "UpdatedById", "UpdatedDate", "username" },
                values: new object[,]
                {
                    { 1, "Hà Nội", null, new DateTime(2023, 10, 23, 16, 29, 19, 179, DateTimeKind.Local).AddTicks(5113), null, "Admin", false, "123456", null, null, null, "admin" },
                    { 2, "Đà Nẵng", null, new DateTime(2023, 10, 23, 16, 29, 19, 179, DateTimeKind.Local).AddTicks(5125), null, "Nhân viên 1", false, "123456", null, null, null, "nv01" },
                    { 3, "Tp. Hồ Chí Minh", null, new DateTime(2023, 10, 23, 16, 29, 19, 179, DateTimeKind.Local).AddTicks(5127), null, "Nhân viên 2", false, "123456", null, null, null, "nv02" }
                });

            migrationBuilder.InsertData(
                table: "user_role",
                columns: new[] { "Id", "CreatedById", "CreatedDate", "IsDeleted", "RoleId", "UpdatedById", "UpdatedDate", "UserId" },
                values: new object[,]
                {
                    { 1, null, new DateTime(2023, 10, 23, 16, 29, 19, 179, DateTimeKind.Local).AddTicks(5264), false, 1, null, null, 1 },
                    { 2, null, new DateTime(2023, 10, 23, 16, 29, 19, 179, DateTimeKind.Local).AddTicks(5294), false, 2, null, null, 2 },
                    { 3, null, new DateTime(2023, 10, 23, 16, 29, 19, 179, DateTimeKind.Local).AddTicks(5295), false, 3, null, null, 3 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_user_role_RoleId",
                table: "user_role",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_user_role_UserId",
                table: "user_role",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "user_role");

            migrationBuilder.DropTable(
                name: "role");

            migrationBuilder.DropTable(
                name: "user");
        }
    }
}
