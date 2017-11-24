using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyDesign.FlowLogic
{
    public class GoToFolder : Node
    {
        public Folder GoToFolderNode { get; set; }

        public override IList<string> QuestionAliases => new List<string>();
    }
}