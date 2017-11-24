using LearningPlatform.Domain.SurveyDesign.Pages;
using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyDesign.RepositoryContracts
{
    public interface ILibraryNodeRepository
    {
        void Add(Node node);
        void Update(Node node);
        void Delete(Node node);
        PageDefinition GetPage(string libraryId, string nodeId);
        IList<PageDefinition> GetPagesByLibraryId(string libraryId);
        IList<PageDefinition> GetPagesByLibraryId(string libraryId, IList<string> nodeIds);
        int CountPagesByLibraryId(string libraryId, string term);
        IList<PageDefinition> SearchPagesByLibraryId(string libraryId, string term, int limit, int offset);
    }
}