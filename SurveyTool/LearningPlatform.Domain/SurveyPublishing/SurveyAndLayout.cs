using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyLayout;
using LearningPlatform.Domain.SurveyThemes;
using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Domain.SurveyPublishing
{
    public class SurveyAndLayout
    {
        public Survey Survey { get; set; }
        public Layout Layout { get; set; }
        public Theme Theme { get; set; }
        public bool IsTesting { get; set; }
        public IList<Layout> PageLayouts { get; set; }
        public IList<Theme> PageThemes { get; set; }

        public Layout GetPageLayout(string pageLayoutId)
        {
            if (pageLayoutId == null) return Layout;
            var layout = PageLayouts.FirstOrDefault(p => p.Id == pageLayoutId);
            return layout ?? Layout;
        }

        public Theme GetPageTheme(string pageThemeId)
        {
            if (pageThemeId == null) return Theme;
            var theme = PageThemes.FirstOrDefault(p => p.Id == pageThemeId);
            return theme ?? Theme;
        }

    }

}