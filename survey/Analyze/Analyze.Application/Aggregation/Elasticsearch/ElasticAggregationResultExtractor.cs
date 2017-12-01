using System.Collections.Generic;
using System.Linq;
using Analyze.Domain.AggregationQueries.Dimensions;
using Analyze.Domain.AggregationQueries.Measures;
using Analyze.Domain.DataSources;
using Newtonsoft.Json.Linq;

namespace Analyze.Application.Aggregation.Elasticsearch
{
	public class ElasticAggregationResultExtractor : IElasticAggregationResultExtractor
	{
		public AggregationResultModel ExtractAggregationResult(dynamic elasticAggregationResult, ElasticAggregationContext context)
		{
			var aggregationResult = new AggregationResultModel
			{
				DataSourceId = context.DataSourceId,
				Dimensions = context.Dimensions,
				Measures = context.Measures,
				Filters = context.Filters,
				FieldsDictionary = new Dictionary<string, LanguageString>(),
				FieldAnswersDictionary = new Dictionary<string, Dictionary<string, LanguageString>>(),
				Documents = new List<JObject>()
			};

			PopulateDocuments(aggregationResult, context, elasticAggregationResult);
			PopulateDictionaries(aggregationResult, context);

			return aggregationResult;
		}


		private void PopulateDocuments(AggregationResultModel aggregationResult, ElasticAggregationContext context, dynamic elasticAggregationResult)
		{
			var firstDimension = context.Dimensions.First();
			var sharedDocument = new JObject();
			aggregationResult.Documents = ExtractDocumentsFromBucketAggregation(context, elasticAggregationResult[firstDimension.FieldName], firstDimension, sharedDocument);
		}

		private List<JObject> ExtractDocumentsFromBucketAggregation(ElasticAggregationContext context, dynamic bucketAggregation, Dimension dimension, JObject sharedDocument)
		{
			var documents = new List<JObject>();

			var buckets = bucketAggregation["buckets"];
			if (buckets == null) return documents;

			var nextDimension = context.FindNextDimension(dimension);
			if (nextDimension != null)
			{
				foreach (var bucket in buckets)
				{
					var document = (JObject)sharedDocument.DeepClone();
					document[dimension.FieldName] = bucket["key"].ToString();
					var subBucketDocuments = ExtractDocumentsFromBucketAggregation(context, bucket[nextDimension.FieldName], nextDimension, document);
					documents.AddRange(subBucketDocuments);
				}
			}
			else
			{
				foreach (var bucket in buckets)
				{
					var document = (JObject)sharedDocument.DeepClone();
					document[dimension.FieldName] = bucket["key"].ToString();
					PopulateDocumentData(context, bucket, document);
					documents.Add(document);
				}
			}
			return documents;
		}

		private void PopulateDocumentData(ElasticAggregationContext context, dynamic rawDocumentData, JObject document)
		{
			foreach (var measure in context.Measures)
			{
				var measureHashValue = measure.GetHashValue();
				if (measure.Operator == MeasureOperator.Percentiles)
				{
					document[measureHashValue] = rawDocumentData[measureHashValue]["values"];
				}
				else if (measure.Operator == MeasureOperator.StandardDeviation)
				{
					document[measureHashValue] = rawDocumentData[measureHashValue]["std_deviation"];
				}
				else if (measure.Operator == MeasureOperator.Variance)
				{
					document[measureHashValue] = rawDocumentData[measureHashValue]["variance"];
				}
				else
				{
					document[measureHashValue] = rawDocumentData[measureHashValue]["value"];
				}
			}
		}

		private void PopulateDictionaries(AggregationResultModel aggregationResult, ElasticAggregationContext context)
		{
			var dimensionFieldNames = context.Dimensions.Select(p => p.FieldName).ToList();
			foreach (var dimensionFieldName in dimensionFieldNames)
			{
				var dimensionField = context.FieldNamesMap[dimensionFieldName];
				aggregationResult.FieldsDictionary[dimensionFieldName] = dimensionField.Title;

				var subFieldAnswersDictionary = new Dictionary<string, LanguageString>();
				aggregationResult.FieldAnswersDictionary[dimensionFieldName] = subFieldAnswersDictionary;

				var dimensionValues = aggregationResult.Documents.Select(document => document[dimensionFieldName].ToString()).Distinct();
				foreach (var value in dimensionValues)
				{
					var fieldAnswer = new LanguageString();
					fieldAnswer.UpsertDefaultLanguageStringItem(value);
					subFieldAnswersDictionary[value] = fieldAnswer;
				}

				if (dimensionField.LegalValues == null) continue;
				foreach (var legalValue in dimensionField.LegalValues)
				{
					subFieldAnswersDictionary[legalValue.Value] = legalValue.Title;
				}
			}
			foreach (var measure in context.Measures)
			{
				var measureField = context.FieldNamesMap[measure.FieldName];
				aggregationResult.FieldsDictionary[measure.FieldName] = measureField.Title;
			}
		}
	}
}



