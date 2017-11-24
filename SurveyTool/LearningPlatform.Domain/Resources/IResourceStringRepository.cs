using System.Collections.Generic;

namespace LearningPlatform.Domain.Resources
{
    public interface IResourceStringRepository
    {
        IList<ResourceString> GetByNameForSurvey(string name, string surveyId);
    }
}
