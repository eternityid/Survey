using Analyze.Domain.DataSources;
using MongoDB.Bson.Serialization;

namespace Analyze.Persistence.Mappings
{
	public class DataSourceMapping
	{
		public DataSourceMapping()
		{
			BsonClassMap.RegisterClassMap<DataSource>(cm =>
			{
				cm.AutoMap();
				cm.MapStringIdProperty();
			});

			BsonClassMap.RegisterClassMap<Field>(cm =>
			{
				cm.AutoMap();
			});
		}
	}
}
