using System.Collections.Generic;
using System.Linq;
using LearningPlatform.Domain.Resources;

namespace LearningPlatform.Data.MongoDb.Repositories
{
    // Most likely the table will be moved to Results db. Not sure yet though. 
    // Currently, this is used by survey execusion. However, we will support overriding these texts per survey. 
    // This will then be done in survey designer. Maybe they should be deployed in the survey package?
    class ResourceStringRepository : IResourceStringRepository
    {

        public IList<ResourceString> GetByNameForSurvey(string name, string surveyId)
        {
            throw new System.NotImplementedException();
        }
    }
}
