using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using LearningPlatform.Domain.Common;

namespace LearningPlatform.Domain.Resources
{
    public class ResourceString : ILanguageString
    {
        public ResourceString()
        {
            Items = new List<ResourceStringItem>();
        }

        public long Id { get; set; }
        public string SurveyId { get; set; }
        public string Name { get; set; }

        public List<ResourceStringItem> Items { get; set; }

        public ILanguageStringItem GetItem(string language)
        {
            var cultureInfoName = language;
            while (!string.IsNullOrEmpty(cultureInfoName))
            {
                var item = Items.FirstOrDefault(o => o.Language == cultureInfoName);
                if (item != null)
                {
                    return item;
                }

                var culture = CultureInfo.GetCultureInfo(cultureInfoName);
                cultureInfoName = culture.Parent.Name;
            }
            return null;
        }

        public void AddItem(ILanguageStringItem languageStringItem)
        {
            Items.Add((ResourceStringItem) languageStringItem);
        }

        public ILanguageStringItem FirstItem()
        {
            return Items.FirstOrDefault();
        }
    }
}