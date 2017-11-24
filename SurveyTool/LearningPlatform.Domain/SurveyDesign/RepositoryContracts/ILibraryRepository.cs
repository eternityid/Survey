using LearningPlatform.Domain.Libraries;

namespace LearningPlatform.Domain.SurveyDesign.RepositoryContracts
{
    public interface ILibraryRepository
    {
        Library GetDefaultLibraryByUserId(string userId);
        Library Add(Library library);
    }
}