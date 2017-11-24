namespace LearningPlatform.Domain.Common
{
    public interface ILanguageString
    {
        ILanguageStringItem GetItem(string language);
        void AddItem(ILanguageStringItem languageStringItem);
        ILanguageStringItem FirstItem();
    }
}