using System.IO;

namespace LearningPlatform.Application.Libraries.Dtos
{
    public class UploadLibraryBlobDto
    {
        public string Description { get; set; }
        public string Directory { get; set; }
        public Stream Stream { get; set; }
        public string FileContentType { get; set; }
        public string FileName { get; set; }
    }
}