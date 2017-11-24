using System.Collections;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;

namespace LearningPlatform.ResponseDataIndexer
{
    public class Document : IEnumerable<KeyValuePair<string, object>>
    {
        private readonly Dictionary<string, object> _fields;

        public Document()
        {
            _fields = new Dictionary<string, object>();
        }

        public string SurveyId { get; set; }
        public long RespondentId { get; set; }
        public int AnswerChangeVersion { get; set; }
        public int RespondentChangeVersion { get; set; }

        public object this[string name]
        {
            get
            {
                object ret;
                _fields.TryGetValue(name, out ret);
                return ret;
            }
            set { _fields[name] = value; }
        }

        public JObject GetJson(string surveyId)
        {
            var jObject = new JObject
            {
                ["_SurveyId"] = surveyId,
                ["_RespondentId"] = RespondentId
            };
            foreach (var key in _fields.Keys)
            {
                SetJObject(jObject, key);
            }
            return jObject;
        }

        private void SetJObject(JObject jObject, string key)
        {
            var obj = this[key];
            var list = obj as IList;
            if (list != null)
            {
                jObject[key] = new JArray(list);
            }
            else
            {
                jObject[key] = new JValue(obj);
            }
        }

        public IEnumerator<KeyValuePair<string, object>> GetEnumerator()
        {
            return _fields.GetEnumerator();

        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }
    }
}