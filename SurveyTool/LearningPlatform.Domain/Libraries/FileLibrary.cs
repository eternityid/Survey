using System.Collections.Generic;

namespace LearningPlatform.Domain.Libraries
{
    public class FileLibrary
    {
        public string LibraryId { get; set; }
        public string Name { get; set; }
        public List<FileLibraryDirectory> Directories { get; set; }
        public string Uri { get; set; }
        public LibraryType Type { get; set; }
        public string Prefix { get; set; }
    }
}
