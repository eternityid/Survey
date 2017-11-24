using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using LearningPlatform.Data.EntityFramework.ResponsesDb;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Respondents;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;

namespace LearningPlatform.Data.EntityFramework.Repositories
{
    internal class RespondentSqlRepository : IRespondentRepository
    {
        private readonly ResponsesContextProvider _responsesContextProvider;

        public RespondentSqlRepository(ResponsesContextProvider responsesContextProvider)
        {
            _responsesContextProvider = responsesContextProvider;
        }

        private ResponsesContext GetResponsesContext(bool isTesting)
        {
            return _responsesContextProvider.Get(isTesting);
        }

        public Respondent Get(long respondentId, string surveyId, bool isTesting)
        {
            return GetResponsesContext(isTesting).Respondents.FirstOrDefault(p => p.Id == respondentId && p.SurveyId == surveyId);
        }

        public Respondent Get(string surveyId, string emailAddress, bool isTesting)
        {
            if (emailAddress == null) emailAddress = string.Empty;
            return GetResponsesContext(isTesting).Respondents.FirstOrDefault(p => p.SurveyId == surveyId && (string.Empty + p.EmailAddress).ToLower() == emailAddress.ToLower());
        }

        public void Add(Respondent respondent, bool isTesting)
        {
            GetResponsesContext(isTesting).Respondents.Add(respondent);
        }

        public void AddUsingMerge(Respondent respondent, bool isTesting)
        {
            var responsesContext = GetResponsesContext(isTesting);
            var existedRespondent = responsesContext.Respondents.
                FirstOrDefault(p => p.SurveyId == respondent.SurveyId && p.EmailAddress == respondent.EmailAddress);

            if (existedRespondent != null)
            {
                existedRespondent.CustomColumns = respondent.CustomColumns;
                responsesContext.Entry(existedRespondent).State = EntityState.Modified;
            }
            else
            {
                responsesContext.Respondents.Add(respondent);
            }
        }

        public void Update(Respondent respondent, bool isTesting)
        {
            var responsesContext = GetResponsesContext(isTesting);
            var respondents = responsesContext.Respondents;
            respondents.Attach(respondent);
            responsesContext.Entry(respondent).State = EntityState.Modified;
        }

        public IQueryable<Respondent> GetAll(string surveyId, bool isTesting)
        {
            return GetResponsesContext(isTesting).Respondents.Where(p => p.SurveyId == surveyId);
        }

        public int Count(RespondentSearchFilter filter, bool isTesting)
        {
            return Search(filter, isTesting).Count;
        }

        public List<Respondent> Search(RespondentSearchFilter filter, int start, int limit, bool isTesting)
        {
            return Search(filter, isTesting).Skip(start).Take(limit).ToList();
        }

        public List<Respondent> Search(RespondentSearchFilter filter, bool isTesting)
        {
            ComparisonOperator sentOperator;
            IQueryable<Respondent> query = GetResponsesContext(isTesting).Respondents.Where(p => p.SurveyId == filter.SurveyId).OrderByDescending(p=>p.Id);
            if (!string.IsNullOrWhiteSpace(filter.EmailAddress))
            {
                query = query.Where(p => p.EmailAddress.Contains(filter.EmailAddress));
            }
            if (!string.IsNullOrWhiteSpace(filter.ResponseStatus))
            {
                query = query.Where(p => p.ResponseStatus == filter.ResponseStatus);
            }
            if (!string.IsNullOrWhiteSpace(filter.NumberSentOperator))
            {
                Enum.TryParse(filter.NumberSentOperator, out sentOperator);
                switch (sentOperator) {
                    case ComparisonOperator.Equal:
                        query = query.Where(p => p.NumberSent == filter.NumberSent);
                        break;
                    case ComparisonOperator.LessThan:
                        query = query.Where(p => p.NumberSent < filter.NumberSent);
                        break;
                    case ComparisonOperator.LessThanOrEqual:
                        query = query.Where(p => p.NumberSent <= filter.NumberSent);
                        break;
                    case ComparisonOperator.GreaterThan:
                        query = query.Where(p => p.NumberSent > filter.NumberSent);
                        break;
                    case ComparisonOperator.GreaterThanOrEqual:
                        query = query.Where(p => p.NumberSent >= filter.NumberSent);
                        break;
                    case ComparisonOperator.Between:
                        query = query.Where(p => p.NumberSent >= filter.NumberSent && p.NumberSent <= filter.NumberSentTo);
                        break;
                }
            }
            if (!string.IsNullOrWhiteSpace(filter.LastTimeSentOperator))
            {
                Enum.TryParse(filter.LastTimeSentOperator, out sentOperator);
                DateTime lastTimeSent = ConvertDate(filter.LastTimeSent);
                DateTime lastTimeSentTo = ConvertDate(filter.LastTimeSentTo);

                switch (sentOperator){
                    case ComparisonOperator.Equal:
                        query = query.Where(p => DbFunctions.TruncateTime(p.LastTimeSent) == lastTimeSent.Date);
                        break;
                    case ComparisonOperator.LessThan:
                        query = query.Where(p => DbFunctions.TruncateTime(p.LastTimeSent) < lastTimeSent.Date);
                        break;
                    case ComparisonOperator.GreaterThan:
                        query = query.Where(p => DbFunctions.TruncateTime(p.LastTimeSent) > lastTimeSent.Date);
                        break;
                    case ComparisonOperator.Between:
                        query = query.Where(p => DbFunctions.TruncateTime(p.LastTimeSent) >= lastTimeSent.Date && (DateTime)p.LastTimeSent <= lastTimeSentTo.Date);
                        break;
                }
            }
            if (!string.IsNullOrWhiteSpace(filter.CompletedTimeSentOperator))
            {
                Enum.TryParse(filter.CompletedTimeSentOperator, out sentOperator);
                DateTime completedTimeSent = ConvertDate(filter.CompletedTimeSent);
                DateTime completedTimeSentTo = ConvertDate(filter.CompletedTimeSentTo);

                switch (sentOperator)
                {
                    case ComparisonOperator.Equal:
                        query = query.Where(p => DbFunctions.TruncateTime(p.Completed) == completedTimeSent.Date);
                        break;
                    case ComparisonOperator.LessThan:
                        query = query.Where(p => DbFunctions.TruncateTime(p.Completed) < completedTimeSent.Date);
                        break;
                    case ComparisonOperator.GreaterThan:
                        query = query.Where(p => DbFunctions.TruncateTime(p.Completed) > completedTimeSent.Date);
                        break;
                    case ComparisonOperator.Between:
                        query = query.Where(p => DbFunctions.TruncateTime(p.Completed) >= completedTimeSent.Date && DbFunctions.TruncateTime(p.Completed) <= completedTimeSentTo.Date);
                        break;
                }
            }

            var convertedRespondents = ConvertDateTimeKind(query.ToList(), DateTimeKind.Utc);
            return convertedRespondents;
        }

        private DateTime ConvertDate(string value)
        {
            DateTime dateTimeResult;
            return DateTime.TryParse(value, out dateTimeResult) ? dateTimeResult : DateTime.MinValue;
        }

        public void DeleteById(long respondentId, bool isTesting)
        {
            var responsesContext = GetResponsesContext(isTesting);
            var respondent = responsesContext.Respondents.Find(respondentId);
            if (respondent == null) return;

            responsesContext.Respondents.Remove(respondent);
            var responseRows = responsesContext.ResponseRows.Where(p => p.RespondentId == respondentId);
            responsesContext.ResponseRows.RemoveRange(responseRows);
        }

        private List<Respondent> ConvertDateTimeKind(List<Respondent> respondents, DateTimeKind kind)
        {
            if (respondents == null) return null; 
            if (!respondents.Any()) return new List<Respondent>();

            respondents.ForEach(respondent =>
            {
                if (respondent.LastTimeSent.HasValue)
                    respondent.LastTimeSent = DateTime.SpecifyKind(respondent.LastTimeSent.Value, kind);
                if (respondent.Completed.HasValue)
                    respondent.Completed = DateTime.SpecifyKind(respondent.Completed.Value, kind);
            });
            return respondents;
        }

    }
}