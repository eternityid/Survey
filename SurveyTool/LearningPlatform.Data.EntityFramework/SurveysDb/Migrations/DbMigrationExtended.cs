using System;
using System.Collections.Generic;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    public abstract class DbMigrationExtended : DbMigration
    {
        private const int IdMaxLength = 24;

        protected void ConvertIdColumn(string table, KeyValuePair<string, string>[] children = null)
        {
            AddColumn(table, "Id2", c => c.String(nullable: false, maxLength: IdMaxLength));
            Sql($"update {table} set Id2=Id");

            if (children != null)
            {
                foreach (var keyValue in children)
                {
                    var childTable = keyValue.Key;
                    var childColumn = keyValue.Value;
                    DropForeignKey(childTable, childColumn, table);
                    DropIndex(childTable, new[] { childColumn });
                    RenameColumn(childTable, childColumn, $"{childColumn}2");
                    AddColumn(childTable, childColumn, c => c.String(nullable: true, maxLength: IdMaxLength));
                    Sql($"update {childTable} set {childColumn}={childColumn}2 from {childTable}");
                    DropColumn(childTable, $"{childColumn}2");
                }
            }

            DropPrimaryKey(table);
            DropColumn(table, "Id");
            RenameColumn(table, "Id2", "Id");
            AddPrimaryKey(table, "Id");
            if (children != null)
            {
                foreach (var keyValue in children)
                {
                    var childTable = keyValue.Key;
                    var childColumn = keyValue.Value;

                    CreateIndex(childTable, childColumn);
                    AddForeignKey(childTable, childColumn, table, "Id");
                }
            }
        }


    }
}
