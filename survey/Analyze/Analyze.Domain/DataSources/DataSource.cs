using System.Collections.Generic;
using Analyze.Domain.Common;

namespace Analyze.Domain.DataSources
{
	public class DataSource : IEntity, IAggregateRoot
	{
		public string Id { get; set; }
		public string ExternalId { get; set; }
		public string Title { get; set; }
		public List<Field> Fields { get; set; }
	}
}
