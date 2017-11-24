using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyDesign
{
    public class Script : Node
    {
        public Script(string scriptCode)
        {
            ScriptCode = scriptCode;
        }

        private Script()
        { }

        public string ScriptCode { get; private set; }

        public override IList<string> QuestionAliases => new List<string>();
    }
}