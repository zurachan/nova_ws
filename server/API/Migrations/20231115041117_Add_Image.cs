using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class Add_Image : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "pathImage",
                table: "user",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "pathImage",
                table: "project",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "pathImage",
                table: "partner",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "pathImage",
                table: "event",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "pathImage",
                table: "customer",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "pathImage",
                table: "content",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "role",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2023, 11, 15, 11, 11, 17, 41, DateTimeKind.Local).AddTicks(6063));

            migrationBuilder.UpdateData(
                table: "role",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedDate",
                value: new DateTime(2023, 11, 15, 11, 11, 17, 41, DateTimeKind.Local).AddTicks(6064));

            migrationBuilder.UpdateData(
                table: "role",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedDate",
                value: new DateTime(2023, 11, 15, 11, 11, 17, 41, DateTimeKind.Local).AddTicks(6065));

            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedDate", "pathImage" },
                values: new object[] { new DateTime(2023, 11, 15, 11, 11, 17, 41, DateTimeKind.Local).AddTicks(5936), null });

            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedDate", "pathImage" },
                values: new object[] { new DateTime(2023, 11, 15, 11, 11, 17, 41, DateTimeKind.Local).AddTicks(5949), null });

            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedDate", "pathImage" },
                values: new object[] { new DateTime(2023, 11, 15, 11, 11, 17, 41, DateTimeKind.Local).AddTicks(5951), null });

            migrationBuilder.UpdateData(
                table: "user_role",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2023, 11, 15, 11, 11, 17, 41, DateTimeKind.Local).AddTicks(6077));

            migrationBuilder.UpdateData(
                table: "user_role",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedDate",
                value: new DateTime(2023, 11, 15, 11, 11, 17, 41, DateTimeKind.Local).AddTicks(6102));

            migrationBuilder.UpdateData(
                table: "user_role",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedDate",
                value: new DateTime(2023, 11, 15, 11, 11, 17, 41, DateTimeKind.Local).AddTicks(6103));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "pathImage",
                table: "user");

            migrationBuilder.DropColumn(
                name: "pathImage",
                table: "project");

            migrationBuilder.DropColumn(
                name: "pathImage",
                table: "partner");

            migrationBuilder.DropColumn(
                name: "pathImage",
                table: "event");

            migrationBuilder.DropColumn(
                name: "pathImage",
                table: "customer");

            migrationBuilder.DropColumn(
                name: "pathImage",
                table: "content");

            migrationBuilder.UpdateData(
                table: "role",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2023, 11, 9, 14, 0, 31, 315, DateTimeKind.Local).AddTicks(3150));

            migrationBuilder.UpdateData(
                table: "role",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedDate",
                value: new DateTime(2023, 11, 9, 14, 0, 31, 315, DateTimeKind.Local).AddTicks(3151));

            migrationBuilder.UpdateData(
                table: "role",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedDate",
                value: new DateTime(2023, 11, 9, 14, 0, 31, 315, DateTimeKind.Local).AddTicks(3153));

            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2023, 11, 9, 14, 0, 31, 315, DateTimeKind.Local).AddTicks(2986));

            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedDate",
                value: new DateTime(2023, 11, 9, 14, 0, 31, 315, DateTimeKind.Local).AddTicks(3000));

            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedDate",
                value: new DateTime(2023, 11, 9, 14, 0, 31, 315, DateTimeKind.Local).AddTicks(3002));

            migrationBuilder.UpdateData(
                table: "user_role",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2023, 11, 9, 14, 0, 31, 315, DateTimeKind.Local).AddTicks(3166));

            migrationBuilder.UpdateData(
                table: "user_role",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedDate",
                value: new DateTime(2023, 11, 9, 14, 0, 31, 315, DateTimeKind.Local).AddTicks(3168));

            migrationBuilder.UpdateData(
                table: "user_role",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedDate",
                value: new DateTime(2023, 11, 9, 14, 0, 31, 315, DateTimeKind.Local).AddTicks(3169));
        }
    }
}
