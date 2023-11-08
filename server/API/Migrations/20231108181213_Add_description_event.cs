using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class Add_description_event : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "description",
                table: "event",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "role",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2023, 11, 9, 1, 12, 13, 709, DateTimeKind.Local).AddTicks(6047));

            migrationBuilder.UpdateData(
                table: "role",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedDate",
                value: new DateTime(2023, 11, 9, 1, 12, 13, 709, DateTimeKind.Local).AddTicks(6049));

            migrationBuilder.UpdateData(
                table: "role",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedDate",
                value: new DateTime(2023, 11, 9, 1, 12, 13, 709, DateTimeKind.Local).AddTicks(6050));

            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2023, 11, 9, 1, 12, 13, 709, DateTimeKind.Local).AddTicks(5877));

            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedDate",
                value: new DateTime(2023, 11, 9, 1, 12, 13, 709, DateTimeKind.Local).AddTicks(5890));

            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedDate",
                value: new DateTime(2023, 11, 9, 1, 12, 13, 709, DateTimeKind.Local).AddTicks(5892));

            migrationBuilder.UpdateData(
                table: "user_role",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2023, 11, 9, 1, 12, 13, 709, DateTimeKind.Local).AddTicks(6066));

            migrationBuilder.UpdateData(
                table: "user_role",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedDate",
                value: new DateTime(2023, 11, 9, 1, 12, 13, 709, DateTimeKind.Local).AddTicks(6067));

            migrationBuilder.UpdateData(
                table: "user_role",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedDate",
                value: new DateTime(2023, 11, 9, 1, 12, 13, 709, DateTimeKind.Local).AddTicks(6068));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "description",
                table: "event");

            migrationBuilder.UpdateData(
                table: "role",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2023, 11, 8, 15, 25, 23, 392, DateTimeKind.Local).AddTicks(7574));

            migrationBuilder.UpdateData(
                table: "role",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedDate",
                value: new DateTime(2023, 11, 8, 15, 25, 23, 392, DateTimeKind.Local).AddTicks(7575));

            migrationBuilder.UpdateData(
                table: "role",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedDate",
                value: new DateTime(2023, 11, 8, 15, 25, 23, 392, DateTimeKind.Local).AddTicks(7576));

            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2023, 11, 8, 15, 25, 23, 392, DateTimeKind.Local).AddTicks(7436));

            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedDate",
                value: new DateTime(2023, 11, 8, 15, 25, 23, 392, DateTimeKind.Local).AddTicks(7451));

            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedDate",
                value: new DateTime(2023, 11, 8, 15, 25, 23, 392, DateTimeKind.Local).AddTicks(7452));

            migrationBuilder.UpdateData(
                table: "user_role",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2023, 11, 8, 15, 25, 23, 392, DateTimeKind.Local).AddTicks(7586));

            migrationBuilder.UpdateData(
                table: "user_role",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedDate",
                value: new DateTime(2023, 11, 8, 15, 25, 23, 392, DateTimeKind.Local).AddTicks(7588));

            migrationBuilder.UpdateData(
                table: "user_role",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedDate",
                value: new DateTime(2023, 11, 8, 15, 25, 23, 392, DateTimeKind.Local).AddTicks(7589));
        }
    }
}
