using Analyze.Domain.AggregationQueries.Filters;
using Analyze.Domain.Exceptions;
using Newtonsoft.Json.Linq;

namespace Analyze.Application.Aggregation.Elasticsearch
{
	public class ElasticFilterFactory : IElasticFilterFactory
	{
		public JObject CreateFilter(string elasticColumnName, Filter filter)
		{
			if (string.IsNullOrEmpty(elasticColumnName)) throw new AnalyzeDomainException($"{nameof(elasticColumnName)} cannot be null or empty");
			if (filter == null) throw new AnalyzeDomainException($"{nameof(filter)} cannot be null");

			switch (filter.Type)
			{
				case FilterType.Equal:
					return CreateEqualFilter(elasticColumnName, filter);
				case FilterType.NotEqual:
					return CreateNotEqualFilter(elasticColumnName, filter);
				case FilterType.GreaterThan:
					return CreateGreaterThanFilter(elasticColumnName, filter);
				case FilterType.GreaterThanOrEqualTo:
					return CreateGreaterThanOrEqualToFilter(elasticColumnName, filter);
				case FilterType.LessThan:
					return CreateLessThanFilter(elasticColumnName, filter);
				case FilterType.LessThanOrEqualTo:
					return CreateLessThanOrEqualToFilter(elasticColumnName, filter);
				case FilterType.Between:
					return CreateBetweenFilter(elasticColumnName, filter);
				default:
					throw new AnalyzeDomainException($"Filter '{filter.Type.ToString()}' is unsupported");
			}
		}

		private JObject CreateEqualFilter(string elasticColumnName, Filter filter)
		{
			return new JObject
			{
				{
					"term", new JObject
					{
						{elasticColumnName, filter.Value}
					}
				}
			};
		}

		private JObject CreateNotEqualFilter(string elasticColumnName, Filter filter)
		{
			return new JObject
			{
				{
					"bool", new JObject
					{
						{
							"must_not", new JObject
							{
								{
									"term", new JObject
									{
										{elasticColumnName, filter.Value}
									}
								}
							}
						}
					}
				}
			};
		}

		private JObject CreateGreaterThanFilter(string elasticColumnName, Filter filter)
		{
			return new JObject
			{
				{
					"range", new JObject
					{
						{elasticColumnName, new JObject
						{
							{"gt", filter.Value }
						} }
					}
				}
			};
		}

		private JObject CreateGreaterThanOrEqualToFilter(string elasticColumnName, Filter filter)
		{
			return new JObject
			{
				{
					"range", new JObject
					{
						{elasticColumnName, new JObject
						{
							{"gte", filter.Value }
						} }
					}
				}
			};
		}

		private JObject CreateLessThanFilter(string elasticColumnName, Filter filter)
		{
			return new JObject
			{
				{
					"range", new JObject
					{
						{elasticColumnName, new JObject
						{
							{"lt", filter.Value }
						} }
					}
				}
			};
		}

		private JObject CreateLessThanOrEqualToFilter(string elasticColumnName, Filter filter)
		{
			return new JObject
			{
				{
					"range", new JObject
					{
						{elasticColumnName, new JObject
						{
							{"lte", filter.Value }
						} }
					}
				}
			};
		}

		private JObject CreateBetweenFilter(string elasticColumnName, Filter filter)
		{
			return new JObject
			{
				{
					"range", new JObject
					{
						{elasticColumnName, new JObject
						{
							{"gte", filter.Value[0] },
							{"lte", filter.Value[1] }
						} }
					}
				}
			};
		}
	}
}