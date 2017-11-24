using LearningPlatform.Domain.SurveyDesign.LanguageStrings;
using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyDesign.RepositoryContracts
{
    public interface ILanguageStringRepository
    {
        void Delete(long id);
        void Delete(IEnumerable<LanguageString> languages);
    }
}
