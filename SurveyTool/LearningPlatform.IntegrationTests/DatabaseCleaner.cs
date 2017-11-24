using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace LearningPlatform.IntegrationTests
{

    public class DatabaseDeleter
    {
        private static readonly string[] IgnoredTables =
        {
            "sysdiagrams",
            "usd_AppliedDatabaseScript",
            "__MigrationHistory"
        };

        private readonly DbContext _dbContext;
        private readonly Lazy<string> _deleteSql;

        public DatabaseDeleter(DbContext dbContext)
        {
            _dbContext = dbContext;
            _deleteSql = new Lazy<string>(GetDeleteSql);
        }

        string GetDeleteSql()
        {
            var allTables = GetAllTables();

            var allRelationships = GetRelationships();

            var tablesToDelete = BuildTableList(allTables, allRelationships);

            return BuildTableSql(tablesToDelete);
        }

        public virtual void DeleteAllObjects()
        {
            var sql = _deleteSql.Value;

            _dbContext.Database.ExecuteSqlCommand(sql);
        }

        static string BuildTableSql(IEnumerable<string> tablesToDelete)
        {
            return tablesToDelete.Aggregate(string.Empty, (current, tableName) => current + string.Format("delete from [{0}];", tableName));
        }

        static string[] BuildTableList(ICollection<string> allTables, ICollection<Relationship> allRelationships)
        {
            var tablesToDelete = new List<string>();

            while (allTables.Any())
            {
                IEnumerable<string> except = allRelationships.Select(rel => rel.PrimaryKeyTable).ToList();
                var leafTables = allTables.Except(except).ToList();

                tablesToDelete.AddRange(leafTables);

                leafTables.ForEach(lt =>
                {
                    allTables.Remove(lt);
                    var relToRemove = allRelationships.Where(rel => rel.ForeignKeyTable == lt).ToList();
                    relToRemove.ForEach(toRemove => allRelationships.Remove(toRemove));
                });
            }

            return tablesToDelete.ToArray();
        }

        IList<Relationship> GetRelationships()
        {
            const string sql =
                @"select
so_pk.name as PrimaryKeyTable
,   so_fk.name as ForeignKeyTable
from
sysforeignkeys sfk
	inner join sysobjects so_pk on sfk.rkeyid = so_pk.id
	inner join sysobjects so_fk on sfk.fkeyid = so_fk.id
order by
so_pk.name
,   so_fk.name";

            return _dbContext.Database.SqlQuery<Relationship>(sql).Where(p=>p.ForeignKeyTable!=p.PrimaryKeyTable).ToList();
        }

        IList<string> GetAllTables()
        {
            return _dbContext.Database.SqlQuery<string>("select name from sys.tables").Except(IgnoredTables).ToList();
        }

        class Relationship
        {
            public string ForeignKeyTable { get; set; }
            public string PrimaryKeyTable { get; set; }
        }
    }

}