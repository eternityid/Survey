using System;

namespace LearningPlatform.Domain.Libraries
{
    public class Library
    {
        public Library()
        {
            CreatedDate = DateTime.Now;
        }

        public string Id { get; set; }
        public string Name { get; set; }
        public LibraryType Type { get; set; }
        public string UserId { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
