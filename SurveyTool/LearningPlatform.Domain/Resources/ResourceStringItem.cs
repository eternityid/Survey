using LearningPlatform.Domain.Common;

namespace LearningPlatform.Domain.Resources
{
    public class ResourceStringItem : ILanguageStringItem
    {
        public long Id { get; set; }
        public string Language { get; set; }
        public string Text { get; set; }
        public long ResourceStringId { get; set; }
    }
}