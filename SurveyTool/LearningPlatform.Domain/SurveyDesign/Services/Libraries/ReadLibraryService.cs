using LearningPlatform.Domain.Libraries;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;

namespace LearningPlatform.Domain.SurveyDesign.Services.Libraries
{
    public class ReadLibraryService
    {
        private readonly ILibraryRepository _libraryRepository;

        public ReadLibraryService(ILibraryRepository libraryRepository)
        {
            _libraryRepository = libraryRepository;
        }

        public Library GetDefaultLibraryByUserId(string userId)
        {
            var library = _libraryRepository.GetDefaultLibraryByUserId(userId);
            if (library != null)
            {
                return library;
            }

            var newLibrary = new Library {
                Name = "My Default Library",
                UserId = userId,
                Type = LibraryType.User
            };
            _libraryRepository.Add(newLibrary);
            return newLibrary;
        }
    }
}
