
using Elasticsearch.Net;
using LearningPlatform.Domain.Reporting;
using LearningPlatform.Domain.SurveyDesign;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;

namespace LearningPlatform.Domain.SurveyDashboard
{
    public class SurveyDashboardService
    {
        private const int MaxResultSize = 10000;

        private readonly IElasticsearchReportingClient _elasticsearchReportingClient;
        private const string DateFormat = "yyyy-MM-dd";

        public SurveyDashboardService(IElasticsearchReportingClient elasticsearchReportingClient)
        {
            _elasticsearchReportingClient = elasticsearchReportingClient;
        }

        public SurveyDashboard GetSurveyDashboard(Survey survey, bool isTesting)
        {
            var surveyDashboard = new SurveyDashboard
            {
                CreatedDate = survey.Created.HasValue ? survey.Created : null,
                ModifiedDate = survey.Modified.HasValue ? survey.Modified : null,
                LastPublishedDate = survey.LastPublished.HasValue ? survey.LastPublished : null
            };

            var searchCondition = BuildSurveyDashboardSearchCondition();
            var surveyIndexName = _elasticsearchReportingClient.GetSurveyIndex(survey.Id, isTesting);
            var surveyTypeName = _elasticsearchReportingClient.GetDefaultTypeName();
            var elasticsearchClient = _elasticsearchReportingClient.GetInstance();
            var surveyDashboardResult = elasticsearchClient.Search<dynamic>(surveyIndexName, surveyTypeName, searchCondition);

            if (surveyDashboardResult.HttpStatusCode != (int)HttpStatusCode.OK && surveyDashboardResult.HttpStatusCode != (int)HttpStatusCode.NotFound)
            {
                throw new Exception(surveyDashboardResult.DebugInformation);
            }

            if (surveyDashboardResult.HttpStatusCode == (int)HttpStatusCode.OK)
            {
                BuildResponsesStatus(surveyDashboardResult, surveyDashboard);
                surveyDashboard.Trend = BuildResponsesTrend(surveyDashboardResult);
            }

            return surveyDashboard;
        }

        private string BuildSurveyDashboardSearchCondition()
        {
            var searchCondition = new JObject(
                new JProperty("size", MaxResultSize),
                new JProperty("aggs", new JObject(
                    new JProperty("response_status", new JObject(
                        new JProperty("terms", new JObject(
                            new JProperty("field", "_ResponseStatus"))))),
                    new JProperty("last_14_days", new JObject(
                        new JProperty("date_range", new JObject(
                            new JProperty("field", "_LastModified"),
                            new JProperty("format", DateFormat),
                            new JProperty("ranges", new JArray(
                                new JObject(
                                    new JProperty("from", "now-13d")))))),
                        new JProperty("aggs", new JObject(
                            new JProperty("inprogress", new JObject(
                                new JProperty("filter", new JObject(
                                    new JProperty("term", new JObject(
                                        new JProperty("_ResponseStatus", "InProgress"))))),
                                new JProperty("aggs", new JObject(
                                    new JProperty("inprogress", new JObject(
                                        new JProperty("date_histogram", new JObject(
                                            new JProperty("field", "_LastModified"),
                                            new JProperty("interval", "day"),
                                            new JProperty("format", DateFormat))))))))),
                            new JProperty("completed", new JObject(
                                new JProperty("filter", new JObject(
                                    new JProperty("term", new JObject(
                                        new JProperty("_ResponseStatus", "Completed"))))),
                                new JProperty("aggs", new JObject(
                                    new JProperty("completed", new JObject(
                                        new JProperty("date_histogram", new JObject(
                                            new JProperty("field", "_LastModified"),
                                            new JProperty("interval", "day"),
                                            new JProperty("format", DateFormat))))))))))))),
                    new JProperty("drop_out", new JObject(
                        new JProperty("date_range", new JObject(
                            new JProperty("field", "_LastModified"),
                            new JProperty("format", DateFormat),
                            new JProperty("ranges", new JArray(
                                new JObject(
                                    new JProperty("to", "now-2d")))))),
                        new JProperty("aggs", new JObject(
                            new JProperty("drop_out", new JObject(
                                new JProperty("filter", new JObject(
                                    new JProperty("term", new JObject(
                                        new JProperty("_ResponseStatus", "InProgress"))))))))))))));

            return searchCondition.ToString();
        }

        private void BuildResponsesStatus(ElasticsearchResponse<dynamic> surveyDashboardData, SurveyDashboard surveyDashboard)
        {
            surveyDashboard.Total = (int)surveyDashboardData.Body["hits"]["total"];
            surveyDashboard.DropoutRate = 0;

            dynamic responsesDropout;
            try
            {
                responsesDropout = surveyDashboardData.Body["aggregations"]["drop_out"]["buckets"][0]["drop_out"]["doc_count"];
            }
            catch (Exception exception)
            {
                if (exception is KeyNotFoundException)
                {
                    responsesDropout = surveyDashboardData.Body["aggregations"]["drop_out"]["buckets"][0]["doc_count"];
                }
                else
                {
                    throw;
                }
            }
            if (surveyDashboard.Total != 0 && responsesDropout != null)
                surveyDashboard.DropoutRate = (short)((int)responsesDropout * 100 / surveyDashboard.Total);

            var responsesStatus = surveyDashboardData.Body["aggregations"]["response_status"]["buckets"];
            foreach (var responseStatus in responsesStatus)
            {
                if (responseStatus["key"].ToString() == "InProgress")
                    surveyDashboard.InProgress = (int)responseStatus["doc_count"];
                if (responseStatus["key"].ToString() == "Completed")
                    surveyDashboard.Completed = (int)responseStatus["doc_count"];
            }

            surveyDashboard.Started = surveyDashboard.InProgress + surveyDashboard.Completed;
        }

        private ResponsesTrend BuildResponsesTrend(ElasticsearchResponse<dynamic> surveyDashboardData)
        {
            var responsesTrend = new ResponsesTrend();

            var responsesTrendData = surveyDashboardData.Body["aggregations"]["last_14_days"]["buckets"][0];
            responsesTrend.From = DateTime.ParseExact(
                ((string)responsesTrendData["from_as_string"]).Substring(0, DateFormat.Length), DateFormat, null);
            responsesTrend.To = DateTime.Now;
            responsesTrend.Points = RenderTrendPoints(responsesTrendData, responsesTrend.From, responsesTrend.To);

            return responsesTrend;
        }

        private List<ResponsesPoint> RenderTrendPoints(dynamic responsesTrendData, DateTime from, DateTime to)
        {
            var responsesPoints = InitResponsesPoints(from, to);

            UpdateInprogressReponsesPoints(responsesTrendData, responsesPoints);
            UpdateCompletedReponsesPoints(responsesTrendData, responsesPoints);
            UpdateTotalResponsesPoints(responsesPoints);

            return responsesPoints;
        }

        private List<ResponsesPoint> InitResponsesPoints(DateTime from, DateTime to)
        {
            var responsesPoints = new List<ResponsesPoint>();

            for (var day = from; day <= to; day = day.AddDays(1))
            {
                responsesPoints.Add(new ResponsesPoint
                {
                    At = day,
                    Started = 0,
                    InProgress = 0,
                    Completed = 0
                });
            }

            return responsesPoints;
        }

        private void UpdateInprogressReponsesPoints(dynamic responsesTrendData, List<ResponsesPoint> responsesPoints)
        {
            dynamic inprogressReponsesPoints;
            try
            {
                inprogressReponsesPoints = responsesTrendData["inprogress"]["inprogress"]["buckets"];
            }
            catch (Exception exception)
            {
                if (exception is KeyNotFoundException)
                {
                    return;
                }
                throw;
            }

            foreach (var point in inprogressReponsesPoints)
            {
                string pointAt = point["key_as_string"];
                var responsesPoint = responsesPoints.FirstOrDefault(item => item.At.ToString(DateFormat) == pointAt);
                if (responsesPoint != null) responsesPoint.InProgress = (int)point["doc_count"];
            }
        }

        private void UpdateCompletedReponsesPoints(dynamic responsesTrendData, List<ResponsesPoint> responsesPoints)
        {
            dynamic completedReponsesPoints;
            try
            {
                completedReponsesPoints = responsesTrendData["completed"]["completed"]["buckets"];
            }
            catch (Exception exception)
            {
                if (exception is KeyNotFoundException)
                {
                    return;
                }
                throw;
            }

            foreach (var point in completedReponsesPoints)
            {
                string pointAt = point["key_as_string"];
                var responsesPoint = responsesPoints.FirstOrDefault(item => item.At.ToString(DateFormat) == pointAt);
                if (responsesPoint != null) responsesPoint.Completed = (int) point["doc_count"];
            }
        }

        private void UpdateTotalResponsesPoints(IEnumerable<ResponsesPoint> responsesPoints)
        {
            foreach (var point in responsesPoints)
            {
                point.Started = point.InProgress + point.Completed;
            }
        }
    }
}