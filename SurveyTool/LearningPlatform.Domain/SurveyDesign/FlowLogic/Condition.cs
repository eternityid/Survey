using System.Collections.Generic;
using LearningPlatform.Domain.SurveyDesign.Expressions;
using Newtonsoft.Json;

namespace LearningPlatform.Domain.SurveyDesign.FlowLogic
{
    public class Condition : Folder
    {
        public Condition(string alias, string scriptCodeExpression, Folder trueFolder, Folder falseFolder)
            : base(alias)
        {
            Alias = alias;
            ScriptCodeExpression = scriptCodeExpression;
            TrueFolder = trueFolder;
            FalseFolder = falseFolder;
        }


        private Condition()
        {
            // Required for Entity Framework
        }

        public string ScriptCodeExpression { get; set; }
        public Expression Expression { get; set; }

        public Folder TrueFolder { get; set; }
        public Folder FalseFolder { get; set; }


        [JsonIgnore]
        public override IList<string> QuestionAliases
        {
            get
            {
                var list = new List<string>();
                if (TrueFolder != null)
                {
                    list.AddRange(TrueFolder.QuestionAliases);
                }
                if (FalseFolder != null)
                {
                    list.AddRange(FalseFolder.QuestionAliases);
                }
                return list;
            }
        }
    }
}