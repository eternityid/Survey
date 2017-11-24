using LearningPlatform.Data.MongoDb.Mappings;
using System.Collections.Generic;

namespace LearningPlatform.Data.MongoDb
{
    public static class MongoDbMappings
    {
        public static void Map()
        {
            // ReSharper disable ObjectCreationAsStatement
            //TODO: We should unmap Id for classes that are not aggregate roots.
            new List<object>
            {
                new SurveyMap(),
                new LayoutMap(),
                new ThemeMap(),
                new NodeMap(),
                new QuestionDefinitionMap(),
                new OptionListMap(),
                new LanguageStringMap(),
                new QuestionValidationMap(),
                new ExpressionMap(),
                new LibraryMap(),
                new CompanyMap(),
                new UserMap()
            };

            // ReSharper restore ObjectCreationAsStatement

        }
    }
}
