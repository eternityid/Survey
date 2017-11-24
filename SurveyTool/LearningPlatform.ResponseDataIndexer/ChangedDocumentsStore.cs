using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.ResponseDataIndexer
{
	public class ChangedDocumentsStore
	{
		public UpsertedDocumentCollection UpsertedDocuments { get; set; }
		public List<Document> DeletedDocuments { get; set; }
		public bool IsEmpty => !UpsertedDocuments.Any() && !DeletedDocuments.Any();
		public int TotalDocuments => UpsertedDocuments.Count + DeletedDocuments.Count;

		public int RespondentChangeVersion
		{
			get
			{
				var upsertedRespondentChangeVersion = UpsertedDocuments.Count > 0 ? UpsertedDocuments.Max(p => p.RespondentChangeVersion) : 0;
                var deletedRespondentChangeVersion = DeletedDocuments.Count > 0 ?  DeletedDocuments.Max(p => p.RespondentChangeVersion) : 0;
				return upsertedRespondentChangeVersion > deletedRespondentChangeVersion
					? upsertedRespondentChangeVersion
					: deletedRespondentChangeVersion;
			}
		}
		public int AnswerChangeVersion => UpsertedDocuments.Count > 0 ? UpsertedDocuments.Max(p => p.AnswerChangeVersion) : 0;
	}
}