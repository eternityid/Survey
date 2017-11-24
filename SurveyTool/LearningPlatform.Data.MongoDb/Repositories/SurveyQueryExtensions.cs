using System;
using System.Collections.Generic;
using System.Linq;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Surveys;

namespace LearningPlatform.Data.MongoDb.Repositories
{
    public static class SurveyQueryExtensions
    {
        public static IQueryable<Survey> SearchStringQuery(this IQueryable<Survey> query, SurveySearchFilter surveySearchModel)
        {
            if (!string.IsNullOrWhiteSpace(surveySearchModel.SearchString))
            {
                query = query.Where(survey => survey.SurveySettings.SurveyTitle.ToLower().Contains(surveySearchModel.SearchString.ToLower()));
            }
            return query;
        }

        public static IQueryable<Survey> DateQuery(this IQueryable<Survey> query, string operatorString, string dateFrom, string dateTo)
        {
            if (string.IsNullOrWhiteSpace(operatorString)) return query;

            ComparisonOperator comparisonOperator;
            if (!Enum.TryParse(operatorString, out comparisonOperator))
            {
                throw new InvalidOperationException($"Unknown comparison string {operatorString}");
            }
            DateTime createdDateFrom = ConvertDate(dateFrom);
            DateTime createdDateTo = ConvertDate(dateTo);

            switch (comparisonOperator)
            {
                case ComparisonOperator.Equal:
                    var endOfDay = createdDateFrom.Date.AddDays(1);
                    return query.Where(survey =>
                            survey.Created >= createdDateFrom.Date && survey.Created <= endOfDay);
                case ComparisonOperator.LessThan:
                    return query.Where(survey => survey.Created < createdDateFrom.Date);
                case ComparisonOperator.LessThanOrEqual:
                    return query.Where(survey => survey.Created <= createdDateFrom.Date);
                case ComparisonOperator.GreaterThan:
                    return query.Where(survey => survey.Created > createdDateFrom.Date);
                case ComparisonOperator.GreaterThanOrEqual:
                    return query.Where(survey => survey.Created >= createdDateFrom.Date);
                case ComparisonOperator.Between:
                    return query.Where(survey => survey.Created >= createdDateFrom.Date && survey.Created <= createdDateTo.Date);
                default:
                    throw new InvalidOperationException($"Unknown comparison operator {comparisonOperator}");
            }
        }

        public static IQueryable<Survey> StatusFilterQuery(this IQueryable<Survey> query, SurveySearchFilter surveySearchModel)
        {
            var listOfStatus = GetListOfStatus(surveySearchModel.Status);
            return surveySearchModel.ShowDeletedSurveys
                ? query.Where(survey => listOfStatus.Contains(survey.Status) || survey.IsDeleted)
                : query.Where(survey => listOfStatus.Contains(survey.Status) && survey.IsDeleted == false);
        }


        private static List<SurveyStatus> GetListOfStatus(SurveyStatusFilter surveyStatusFilter)
        {
            var listOfStatus = new List<SurveyStatus>();
            if (surveyStatusFilter.New)
            {
                listOfStatus.Add(SurveyStatus.New);
            }
            if (surveyStatusFilter.Open)
            {
                listOfStatus.Add(SurveyStatus.Open);
            }
            if (surveyStatusFilter.Closed)
            {
                listOfStatus.Add(SurveyStatus.Closed);
            }
            if (surveyStatusFilter.TemprorarilyClosed)
            {
                listOfStatus.Add(SurveyStatus.TemprorarilyClosed);
            }
            return listOfStatus;
        }

        private static DateTime ConvertDate(string value)
        {
            DateTime dateTimeResult;
            return DateTime.TryParse(value, out dateTimeResult) ? dateTimeResult : DateTime.MinValue;
        }
    }
}
