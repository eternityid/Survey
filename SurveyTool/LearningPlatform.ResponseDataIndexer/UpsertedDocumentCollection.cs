using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;

namespace LearningPlatform.ResponseDataIndexer
{
    public class UpsertedDocumentCollection : IEnumerable<Document>
    {
        private readonly OrderedDictionary _documents;
        private readonly Dictionary<string, List<Document>> _documentsPerSurveyId;

        public UpsertedDocumentCollection()
        {
            _documentsPerSurveyId = new Dictionary<string, List<Document>>();
            _documents = new OrderedDictionary();
        }

        public Document GetDocument(string surveyId, long respondentId)
        {
            return _documents[GetKey(surveyId, respondentId)] as Document;
        }

        public Document GetOrCreateDocument(string surveyId, long respondentId)
        {
            var document = GetDocument(surveyId, respondentId);
            if (document == null)
            {
                document = new Document { SurveyId = surveyId, RespondentId = respondentId };
                Add(document);
            }
            return document;
        }

        public IList<Document> GetDocuments(string surveyId)
        {
            return _documentsPerSurveyId[surveyId];
        }
        public IEnumerator<Document> GetEnumerator()
        {
            return _documents.Values.Cast<Document>().ToList().GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }

        public void Add(Document item)
        {
            _documents[GetKey(item.SurveyId, item.RespondentId)] = item;

            List<Document> surveyDocuments;
            if (!_documentsPerSurveyId.TryGetValue(item.SurveyId, out surveyDocuments))
            {
                surveyDocuments = new List<Document>();
                _documentsPerSurveyId[item.SurveyId] = surveyDocuments;
            }
            surveyDocuments.Add(item);
        }

        private static string GetKey(string surveyId, long respondentId)
        {
            return surveyId+"_"+respondentId;
        }

        public int Count { get { return _documents.Count; } }

        public void MergeResponses(UpsertedDocumentCollection changedUpsertedDocuments)
        {
            foreach (var changedDocument in changedUpsertedDocuments)
            {
                var document = GetDocument(changedDocument.SurveyId, changedDocument.RespondentId);
                if (document == null)
                {
                    Add(changedDocument);
                }
                else
                {
                    document.AnswerChangeVersion = changedDocument.AnswerChangeVersion;
                    document.RespondentChangeVersion = changedDocument.RespondentChangeVersion;

                    foreach (var changed in changedDocument)
                    {
                        document[changed.Key] = changed.Value;
                    }
                }
            }
        }
    }
}