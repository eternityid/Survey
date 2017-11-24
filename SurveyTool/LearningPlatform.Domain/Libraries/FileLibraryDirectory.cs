using System.Collections.Generic;

namespace LearningPlatform.Domain.Libraries
{
    public class FileLibraryDirectory
    {
        public string Name { get; set; }
        public List<FileLibraryBlob> Blobs { get; set; }
        public string Uri { get; set; }
        public string Prefix { get; set; }
        public string Library { get; set; }
    }
}