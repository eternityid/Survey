using LearningPlatform.Domain.Helpers;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Data.MongoDbMigration.Converters
{
    public class OptionListConverter
    {
        public Dictionary<string, string> IdMap { get; } = new Dictionary<string, string>();
        public Dictionary<string, string> OptionIdMap { get; } = new Dictionary<string, string>();


        public void Convert(NodeService nodeService)
        {
            foreach (var optionList in nodeService.OptionLists.ToList())
            {
                // Ensure the correct order of options
                optionList.Options = optionList.Options.OrderBy(o => o.Position).ToList();
                var objectId = ObjectIdHelper.GetObjectIdFromLongString(optionList.Id);
                IdMap[optionList.Id] = objectId;
                optionList.Id = objectId;
                optionList.SurveyId = nodeService.Survey.Id;
            }

        }


        public void UpdateOptions(OptionList optionList, QuestionConverter questionConverter)
        {
            foreach (var option in optionList.Options)
            {
                var objectId = ObjectIdHelper.GetObjectIdFromLongString(option.Id);
                OptionIdMap[option.Id] = objectId;
                option.Id = objectId;
                if (option.OptionsMask?.QuestionId != null)
                {
                    option.OptionsMask.QuestionId = questionConverter.IdMap[option.OptionsMask.QuestionId];
                }
                if (option.ReferenceListId != null)
                {
                    option.ReferenceListId = IdMap[option.ReferenceListId];
                }
                if (option.OtherQuestionDefinition != null)
                {
                    option.OtherQuestionDefinition.Id = null;
                }
            }
        }
    }
}
