using LearningPlatform.Domain.Libraries;

namespace LearningPlatform.Application.Libraries.Dtos
{
    public class FileLibraryDirectoryTreeDto
    {
        public FileLibrary SystemLibrary { get; set; }
        public FileLibrary UserLibrary { get; set; }
    }
}
