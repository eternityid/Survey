using System;
using System.Collections.Generic;

namespace LearningPlatform.ResponseDataIndexer
{
    public class Indexer
    {
        public static void Index(bool isTesting)
        {
            var start = DateTime.Now;

	        var changedDocumentsStore = GetChangedDocumentsStore(isTesting);
			if (changedDocumentsStore.IsEmpty) return;

			try
			{
				ElasticsearchService.IndexUpsertedDocuments(changedDocumentsStore.UpsertedDocuments, isTesting);
				ElasticsearchService.DeleteDocuments(changedDocumentsStore.DeletedDocuments, isTesting);
				ElasticsearchService.UpdateDocumentSysChangeVersion(changedDocumentsStore.RespondentChangeVersion, changedDocumentsStore.AnswerChangeVersion, isTesting);

				var totalTime = DateTime.Now.Subtract(start).TotalMilliseconds;
				Logger.Log("Processed {0} {1}responses in {2} ms", changedDocumentsStore.TotalDocuments, isTesting ? "test " : "", totalTime);
			}
			catch (ElasticsearchException e)
			{
				Logger.Log(e.ToString());
			}
		}

	    private static ChangedDocumentsStore GetChangedDocumentsStore(bool isTesting)
	    {
		    var changedDocumentsStore = new ChangedDocumentsStore
		    {
			    UpsertedDocuments = new UpsertedDocumentCollection(),
			    DeletedDocuments = new List<Document>()
		    };
			RespondentReader.Read(changedDocumentsStore, isTesting);
		    AnswerReader.Read(changedDocumentsStore.UpsertedDocuments, isTesting);
			return changedDocumentsStore;
	    }
    }
}
