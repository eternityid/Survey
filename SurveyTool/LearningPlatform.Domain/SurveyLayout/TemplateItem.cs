using System;

namespace LearningPlatform.Domain.SurveyLayout
{
    public class TemplateItem
    {
        public ItemType ItemType { get; set; }
        public string Html { get; set; }
        public static TemplateItem CreateHtml(string html)
        {
            return new TemplateItem {Html = html, ItemType = ItemType.Html};
        }
        public static TemplateItem Create(ItemType type)
        {
            if (type == ItemType.Html) throw new ArgumentOutOfRangeException("type", "Use CreateHtml instead");
            return new TemplateItem { ItemType = type };
        }

    }
}