using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyLayout
{
    public class BodyTemplate : Template
    {
        public override List<TemplateItem> GetTemplateItems()
        {
            if (Content == null)
            {
                return new List<TemplateItem>(Items) {TemplateItem.Create(ItemType.SurveyProgressArea)};
            }

            return base.GetTemplateItems();
        }
    }
}