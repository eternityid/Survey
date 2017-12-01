using System.Collections.Generic;
using Analyze.Persistence.Mappings;

namespace Analyze.Persistence
{
	public static class AnalyzeDbContextMapping
	{
		public static void Map()
		{
			// ReSharper disable ObjectCreationAsStatement
			//TODO: We should unmap Id for classes that are not aggregate roots.
			new List<object>
			{
				new DataSourceMapping()
			};

			// ReSharper restore ObjectCreationAsStatement

		}
	}
}
