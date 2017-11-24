using Elasticsearch.Net;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Text;

namespace LearningPlatform.ResponseDataIndexer
{
	public class ElasticsearchService
	{
		private static volatile ElasticLowLevelClient _elasticsearchClient;
		private static readonly object SyncRoot = new object();
		private static readonly string indexType = "responses";

		private static ElasticLowLevelClient Instance
		{
			get
			{
				if (_elasticsearchClient != null) return _elasticsearchClient;
				lock (SyncRoot)
				{
					if (_elasticsearchClient != null) return _elasticsearchClient;

					var connectionPool = new SingleNodeConnectionPool(new Uri(Config.ElasticsearchConnectionString));
					var config = new ConnectionConfiguration(connectionPool);// p=>new ElasticsearchJsonNetSerializer());
					config.RequestTimeout(TimeSpan.FromMinutes(1));
					_elasticsearchClient = new ElasticLowLevelClient(config);
				}

				return _elasticsearchClient;
			}
		}

		public static void EnsureTemplateExists()
		{
			var getResponse = Instance.IndicesGetTemplateForAll<object>(Config.SurveyDefaultIndexName);
			if (getResponse.HttpStatusCode == (int)HttpStatusCode.NotFound)
			{
				// Default is that strings are not analyized (Index this field, so it is searchable, but index the value exactly as specified. Do not analyze it.)
				// Currently, if we want a field to be tokenized, append __ in front which will then use analyzed (First analyze the string and then index it. In other words, index this field as full text.).
				var putResponse = Instance.IndicesPutTemplateForAll<object>(Config.SurveyDefaultIndexName, new PostData<object>(@"
{
  ""template"": """ + Config.SurveyDefaultIndexName + @"_*"",
  ""settings"": {
    ""number_of_shards"": 1
  },
  ""mappings"": {
    ""responses"": {
      ""dynamic_templates"": [
        {
          ""default"": {
            ""match"": ""__*"",
            ""match_mapping_type"": ""string"",
            ""mapping"": {
              ""type"": ""string""
            }
          }
        },
        {
          ""notanalyzed"": {
            ""match"": ""*"",
            ""match_mapping_type"": ""string"",
            ""mapping"": {
              ""type"": ""string"",
              ""index"": ""not_analyzed""
            }
          }
        }

      ]
    }
  }
}"));
				if (!putResponse.Success)
				{
					throw new ElasticsearchException("Could not create template", putResponse.OriginalException);
				}
			}
		}

		public static void GetResponseDocuments(UpsertedDocumentCollection upsertedDocumentCollection, bool isTesting, string surveyId, IList<long> respondentIds)
		{
			var index = GetSurveyIndex(surveyId, isTesting);
			var query = @"
{
  ""query"": {
    ""constant_score"" : {
      ""filter"" : {
        ""bool"" : {
          ""must"" : [
            {""terms"" : {""_RespondentId"" : [" + string.Join(", ", respondentIds) + @"]}}
          ]
        }
      }
    }
  }
}";
			var elasticsearchResponse = Instance.Search<dynamic>(index, indexType, query);
			if (!elasticsearchResponse.Success)
			{
				if (elasticsearchResponse.HttpStatusCode == (int)HttpStatusCode.NotFound)
				{
					return;
				}
				throw new ElasticsearchException("Getting documents from Elasticsearch failed", elasticsearchResponse.OriginalException);
			}
			var resultDocuments = elasticsearchResponse.Body["hits"]["hits"];
			foreach (var document in resultDocuments)
			{
				var source = document["_source"];
				var response = upsertedDocumentCollection.GetOrCreateDocument(source["_SurveyId"], source["_RespondentId"]);
				foreach (dynamic k in source)
				{
					if (k.Key != "_SurveyId" && k.Key != "_RespondentId")
					{
						response[k.Key] = k.Value;
					}
				}
			}
		}

		private static string GetSurveyIndex(string surveyId, bool isTesting)
		{
			return $"{Config.SurveyDefaultIndexName}_" + (isTesting ? surveyId.ToString(CultureInfo.InvariantCulture) + "_test" : surveyId.ToString(CultureInfo.InvariantCulture));
		}

		public static void IndexUpsertedDocuments(UpsertedDocumentCollection upsertedDocumentCollection, bool isTesting)
		{
			var elasticDocumentCollection = GetElasticDocuments(isTesting, upsertedDocumentCollection);
			elasticDocumentCollection.MergeResponses(upsertedDocumentCollection);

			var count = 0;
			var surveyMap = new Dictionary<string, bool>();
			var stringBuilder = new StringBuilder();
			foreach (var document in elasticDocumentCollection)
			{
				BuildBulkIndexCommand(isTesting, document, stringBuilder);
				count++;
				surveyMap[document.SurveyId] = true;
				if (count != 5000 && surveyMap.Count != 20) continue;

				BulkIndex(stringBuilder);
				count = 0;
				surveyMap.Clear();
				stringBuilder.Clear();
			}
			if (count > 0) BulkIndex(stringBuilder);

			//var body = new PostData<object>("{\"_id\":1,\"_SurveyId\":10,\"_RespondentId\":1,\"_ResponseStatus\":\"Completed\",\"_Started\":\"2016 - 08 - 25T14: 59:09.717\",\"_LastModified\":\"2016 - 08 - 25T14: 59:09.887\",\"_Completed\":\"2016 - 08 - 25T14: 59:09.887\"}");
		}

		private static UpsertedDocumentCollection GetElasticDocuments(bool isTesting, UpsertedDocumentCollection changedUpsertedDocuments)
		{
			var elasticUpsertedDocumentCollection = new UpsertedDocumentCollection();

			var surveyIds = changedUpsertedDocuments.Select(p => p.SurveyId).Distinct();
			foreach (var surveyId in surveyIds)
			{
				var respondentIds = changedUpsertedDocuments.GetDocuments(surveyId).Select(d => d.RespondentId).ToList();
				ElasticsearchService.GetResponseDocuments(elasticUpsertedDocumentCollection, isTesting, surveyId, respondentIds);
			}
			return elasticUpsertedDocumentCollection;
		}

		public static void DeleteDocuments(List<Document> documents, bool isTesting)
		{
            if (documents.Count == 0) return;

			const string queryPath = "*/_delete_by_query";
			var deleteDocumentsCommand = BuildDeleteDocumentsCommand(documents.Select(d => d.RespondentId));
			Instance.DoRequest<dynamic>(HttpMethod.POST, queryPath, deleteDocumentsCommand);
		}

		private static string BuildDeleteDocumentsCommand(IEnumerable<long> documentIds)
		{
			var condition = new JObject(
				new JProperty("query", new JObject(
					new JProperty("ids", new JObject(
						new JProperty("values", new JArray(documentIds)))))));
			return condition.ToString();
		}

		public static void UpdateDocumentSysChangeVersion(int respondentChangeVersion, int answerChangeVersion, bool isTesting)
		{
			if (respondentChangeVersion > 0)
			{
				UpdateSysChangeVersion(GetRespondentChangeVersionKey(isTesting), respondentChangeVersion);
			}
			if (answerChangeVersion > 0)
			{
				UpdateSysChangeVersion(GetAnswerChangeVersionKey(isTesting), answerChangeVersion);
			}
		}

		private static void BuildBulkIndexCommand(bool isTesting, Document document, StringBuilder stringBuilder)
		{
			var surveyId = document.SurveyId;
			var index = GetSurveyIndex(surveyId, isTesting);
			var jObject = document.GetJson(surveyId);
			stringBuilder.AppendFormat("{{\"index\": {{\"_index\": \"{0}\", \"_type\": \"{1}\", \"_id\": {2}}}}}\n", index,
				indexType, jObject["_RespondentId"]);
			stringBuilder.Append(jObject.ToString(Formatting.None) + "\n");
		}

		private static void BulkIndex(StringBuilder stringBuilder)
		{
			var elasticsearchResponse = Instance.Bulk<string>(new PostData<object>(stringBuilder.ToString()));
			if (!elasticsearchResponse.Success)
			{
				throw new ElasticsearchException("Bulk indexing was unsuccessful\t", elasticsearchResponse.OriginalException);
			}
		}

		public static int? GetRespondentChangeVersion(bool isTesting)
		{
			return GetSysChangeVersion(GetRespondentChangeVersionKey(isTesting));
		}

		public static int? GetAnswerChangeVersion(bool isTesting)
		{
			return GetSysChangeVersion(GetAnswerChangeVersionKey(isTesting));
		}

		private static void UpdateSysChangeVersion(string sysChangeVersionKey, int sysChangeVersion)
		{
			var lastSysChangeVersion = new JObject { ["current_version"] = sysChangeVersion };
			Instance.Index<string>($"{Config.SurveyDefaultIndexName}_current_version", "current_version", sysChangeVersionKey, JsonConvert.SerializeObject(lastSysChangeVersion));
		}

		private static string GetRespondentChangeVersionKey(bool isTesting)
		{
			return isTesting ? ChangeVersionKey.TestRespondents : ChangeVersionKey.Respondents;
		}

		private static string GetAnswerChangeVersionKey(bool isTesting)
		{
			return isTesting ? ChangeVersionKey.TestAnswers : ChangeVersionKey.Answers;
		}

		private static int? GetSysChangeVersion(string sysChangeVersionKey)
		{
			var elasticResponse = Instance.GetSource<dynamic>($"{Config.SurveyDefaultIndexName}_current_version", "current_version", sysChangeVersionKey);
			if (elasticResponse.HttpStatusCode.Equals((int)HttpStatusCode.NotFound))
			{
				UpdateSysChangeVersion(sysChangeVersionKey, 0);
				return null;
			}

			return (int)elasticResponse.Body["current_version"];
		}
	}
}

