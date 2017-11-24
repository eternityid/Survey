using System;
using System.Collections.Generic;
using System.Linq;
using LearningPlatform.Domain.Respondents;
using LearningPlatform.Domain.SurveyExecution.RepositoryContracts;

namespace LearningPlatform.SurveyExecution.Data.Repositories.Memory
{
    public class RespondentMemoryRepository : IRespondentSurveyExecutionRepository
    {
        private class RespondentComparer : IEqualityComparer<Respondent>
        {
            public bool Equals(Respondent x, Respondent y)
            {
                return x.Id == y.Id;
            }

            public int GetHashCode(Respondent obj)
            {
                var hash = 0;
                hash ^= obj.Id.GetHashCode();
                hash ^= obj.SurveyId.GetHashCode();
                return hash;
            }
        }

        private readonly Dictionary<string, HashSet<Respondent>> _respondentRows = new Dictionary<string, HashSet<Respondent>>();
        private readonly Dictionary<string, long> _currentRespondentIds = new  Dictionary<string, long>();


        private HashSet<Respondent> GetHashSet(string surveyId)
        {
            HashSet<Respondent> hashSet;
            if (_respondentRows.TryGetValue(surveyId, out hashSet))
            {
                return hashSet;                
            }
            hashSet = new HashSet<Respondent>(new RespondentComparer());

            if (!_currentRespondentIds.ContainsKey(surveyId))
            {
                _currentRespondentIds[surveyId] = 0;
            }
            _respondentRows[surveyId] = hashSet;
            return hashSet;
        }

        public void Add(Respondent respondent, bool isTesting)
        {
            var surveyId = respondent.SurveyId;
            var hashSet = GetHashSet(surveyId);
            var respondentId = _currentRespondentIds[surveyId]+1;
            _currentRespondentIds[surveyId] = respondentId;

            respondent.Id = respondentId;
            hashSet.Add(respondent);
        }
        public void Update(Respondent respondent, bool isTesting)
        {
            // Intentionally left blank
        }      

        public Respondent Get(long respondentId, string surveyId, bool isTesting)
        {
            var hashSet = GetHashSet(surveyId);
            var respondent = hashSet.FirstOrDefault(p=>p.Id==respondentId && p.SurveyId==surveyId);
            if(respondent==null)
                throw new Exception("UserInfo not found");
            return respondent;
        }

        public void SetRespondentId(string surveyId, long respondentId)
        {
            _currentRespondentIds[surveyId] = respondentId;
        }

        public void Clear()
        {
            _currentRespondentIds.Clear();
            _respondentRows.Clear();
        }


        public IList<Respondent> GetAll(string surveyId)
        {

            return GetHashSet(surveyId).ToList();
        }

        public Respondent GetWithExternalId(string externalId, string surveyId, bool isTesting)
        {
            var hashSet = GetHashSet(surveyId);
            var respondent = hashSet.FirstOrDefault(r => r.ExternalId == externalId && r.SurveyId == surveyId);
            return respondent;
        }
    }
}