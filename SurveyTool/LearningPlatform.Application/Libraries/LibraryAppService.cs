using LearningPlatform.Domain.Libraries;
using LearningPlatform.Domain.SurveyDesign.Services.Libraries;

namespace LearningPlatform.Application.Libraries
{
    public class LibraryAppService
    {
        private readonly ReadLibraryService _readLibraryService;

        public LibraryAppService(ReadLibraryService readLibraryService)
        {
            _readLibraryService = readLibraryService;
        }

        public Library GetUserLibrary(string userId)
        {
            return _readLibraryService.GetDefaultLibraryByUserId(userId);
        }
    }
}
