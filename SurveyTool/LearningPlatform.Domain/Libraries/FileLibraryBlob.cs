using System;

namespace LearningPlatform.Domain.Libraries
{
    public class FileLibraryBlob
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string ContentType { get; set; }
        public string FileNameWithoutExtension { get; set; }
        public string FileName { get; set; }
        public string FileExtension { get; set; }
        public long Size { get; set; }
        public DateTimeOffset? LastModified { get; set; }
        public string Etag { get; set; }
        public string Uri { get; set; }
        public string Directory { get; set; }
        public string Library { get; set; }
    }
}
