using LearningPlatform.Domain.SurveyLayout;
using System.Collections.Generic;

namespace LearningPlatform.Domain.DefaultData.Layouts
{
    public class DefaultLayoutDefinitionFactory
    {
        public static Layout Create(string id,string name, string css,List<Template> templates)
        {
            return new Layout
            {
                Id = id,
                Name = name,
                Css = css,
                Templates = templates
            };
        }
    }
}
