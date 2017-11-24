using System.Collections.Generic;
using System.Linq;
using LearningPlatform.Domain.SurveyExecution.Questions;
using LearningPlatform.Domain.SurveyExecution.RepositoryContracts;
using LearningPlatform.Domain.SurveyExecution.ResponseRows;

namespace LearningPlatform.SurveyExecution.Data.Repositories.Memory
{
    public class ResponseRowMemoryRepository : IResponseRowRepository
    {
        class ResponseRowComparer : IEqualityComparer<ResponseRow>
        {
            public bool Equals(ResponseRow x, ResponseRow y)
            {
                return x.Id == y.Id &&
                       x.SurveyId == y.SurveyId &&
                       x.RespondentId == y.RespondentId &&
                       x.QuestionName == y.QuestionName &&
                       x.LoopState.ToString() == y.LoopState.ToString() &&
                       x.Alias == y.Alias;
            }

            public int GetHashCode(ResponseRow obj)
            {
                var hash = 0;
                hash ^= obj.Id.GetHashCode();
                hash ^= obj.SurveyId.GetHashCode();
                hash ^= obj.RespondentId.GetHashCode();
                hash ^= obj.QuestionName.GetHashCode();
                if (obj.LoopState != null) hash ^= obj.LoopState.ToString().GetHashCode();
                if(obj.Alias!=null) hash ^= obj.Alias.GetHashCode();
                return hash;
            }
        }

        private readonly Dictionary<string, HashSet<ResponseRow>> _responseRows = new Dictionary<string, HashSet<ResponseRow>>();
        private int _id;

        public HashSet<ResponseRow> AllRows
        {
            get
            {
                var ret = new HashSet<ResponseRow>(new ResponseRowComparer());
                foreach (var hashSet in _responseRows.Values)
                {
                    foreach (var responseRow in hashSet)
                    {
                        ret.Add(responseRow);
                    }
                }
                return ret;
            }
        }



        public override int GetHashCode()
        {
            unchecked
            {
                return ((_responseRows != null ? _responseRows.GetHashCode() : 0)*397) ^ _id;
            }
        }

        public IEnumerable<ResponseRow> GetRows(IList<Question> questions, long respondentId, string surveyId)
        {
            var ret = new List<ResponseRow>();
            foreach (var question in questions)
            {
                var key = GetKey(respondentId, surveyId, question.Alias);
                HashSet<ResponseRow> hashSet;
                if (_responseRows.TryGetValue(key, out hashSet))
                {
                    ret.AddRange(hashSet);
                }
            }
            return ret;
        }

        private static string GetKey(long respondentId, string surveyId, string alias)
        {
            return string.Format("{0}@{1}@{2}", surveyId, alias, respondentId);
        }

        public void Update(IEnumerable<ResponseRow> responseRows)
        {
            foreach (var row in responseRows)
            {
                var updatedRow = (ResponseRow)row.Clone();
                var key = GetKey(row.RespondentId, row.SurveyId, row.QuestionName);
                // We need to remove the old element first to be able to update the answer
                HashSet<ResponseRow> hashSet;
                if (!_responseRows.TryGetValue(key, out hashSet))
                {
                    hashSet = new HashSet<ResponseRow>(new ResponseRowComparer());
                    _responseRows[key] = hashSet;
                }
                if (!hashSet.Remove(row))
                {
                    updatedRow.Id = ++_id;
                }
                hashSet.Add(updatedRow);
            }
        }


        public void Delete(IList<string> questionIds, long respondentId, string surveyId)
        {
            foreach (var row in questionIds)
            {
                var key = GetKey(respondentId, surveyId, row);
                _responseRows.Remove(key);
            }
        }

        public IList<ResponseRow> GetAll(string surveyId)
        {
            return AllRows.Where(r=>r.SurveyId==surveyId).ToList();
        }

        public void Clear()
        {
            _responseRows.Clear();
            _id = 0;
        }
    }
}