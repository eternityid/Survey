using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyDesign
{
    public class SurveyAccessRights
    {
        public SurveyAccessRights()
        {
            Write = new List<string>();
            Full = new List<string>();
        }

        public List<string> Write { get; set; }
        public List<string> Full { get; set; }
    }
}
