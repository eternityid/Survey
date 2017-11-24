using System;
using System.Collections.Generic;
using System.Linq;
using LearningPlatform.Domain.Common;
using Newtonsoft.Json;

namespace LearningPlatform.Domain.SurveyLayout
{
    public abstract class Template
    {
        private readonly Dictionary<string, ItemType> _itemTypes = new Dictionary<string, ItemType>
        {
            {"@page", ItemType.Body},
            {"@surveyProgress", ItemType.SurveyProgressArea},
            {"@progress", ItemType.Progress},
            {"@pageErrorArea", ItemType.PageErrorArea},
            {"@questions", ItemType.Questions},
            {"@navigation", ItemType.Navigation},
            {"@pageErrors", ItemType.Errors},
            {"@questionErrorArea", ItemType.QuestionErrorArea},
            {"@questionErrors", ItemType.Errors},
            {"@error", ItemType.Error},
            {"@questionTitle", ItemType.Title},
            {"@questionDescription", ItemType.Description},
            {"@userInputArea", ItemType.UserInputArea}
        };
        //TODO serialize without Id, should we remove this property
        public long Id { get; set; }
        public string Name { get; set; }

        // This is a property that is included for surveys launched before the new layout system.
        public List<TemplateItem> Items { get; set; }

        public virtual List<TemplateItem> GetTemplateItems()
        {
            if (Content == null) return Items;
            return ParseTemplateItems();
        } 

        private List<TemplateItem> ParseTemplateItems()
        {
            var items = new List<TemplateItem>();
            string[] parts = Content.SplitAndKeep(_itemTypes.Keys);
            foreach (string p in parts)
            {
                if (p.StartsWith("@"))
                {
                    ItemType val;
                    if (_itemTypes.TryGetValue(p, out val))
                    {
                        items.Add(TemplateItem.Create(val));
                        continue;
                    }
                }
                items.Add(TemplateItem.CreateHtml(p));
            }
            return items;
        }

        public string Content { get; set; }
        public bool IsDefault { get; set; }

        //TODO serialize without LayoutId, should we remove this property
        public string LayoutId { get; set; }
    }
}