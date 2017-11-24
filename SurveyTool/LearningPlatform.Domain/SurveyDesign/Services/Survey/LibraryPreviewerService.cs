using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Constants;
using LearningPlatform.Domain.Respondents;
using LearningPlatform.Domain.SurveyDesign.Libraries;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyExecution;
using LearningPlatform.Domain.SurveyExecution.Request;
using LearningPlatform.Domain.SurveyLayout;
using LearningPlatform.Domain.SurveyPublishing;

namespace LearningPlatform.Domain.SurveyDesign.Services.Survey
{
    public class LibraryPreviewerService
    {
        private readonly ILayoutRepository _layoutRepository;
        private readonly IThemeRepository _themeRepository;
        private readonly IRequestObjectProvider<IRequestContext> _requestContextProvider;
        private readonly RequestContextFactory _requestContextFactory;

        public LibraryPreviewerService (ILayoutRepository layoutRepository,
            IThemeRepository themeRepository,
            IRequestObjectProvider<IRequestContext> requestContextProvider,
            RequestContextFactory requestContextFactory)
        {
            _layoutRepository = layoutRepository;
            _themeRepository = themeRepository;
            _requestContextProvider = requestContextProvider;
            _requestContextFactory = requestContextFactory;
        }

        public LayoutThemeAndSurveyModel GetLayoutThemeAndEmptySurvey(bool displayPageTitleAndDescription)
        {
            var defaultLayout = _layoutRepository.GetDefaultLayout();
            var defaultTheme = _themeRepository.GetDefaultTheme();

            var survey = new Domain.SurveyDesign.Survey
            {
                SurveySettings = new SurveySettings
                {
                    DisplayPageTitleAndDescription = displayPageTitleAndDescription,
                    DisplayRequiredStar = true
                },
                LayoutId = defaultLayout.Id,
                ThemeId = defaultTheme.Id
            };

            return new LayoutThemeAndSurveyModel
            {
                Layout = defaultLayout,
                Theme = defaultTheme,
                Survey = survey
            };
        }

        public void SetRequestContext(LayoutThemeAndSurveyModel defaultLayoutThemeAndSurveyModel) {
            _requestContextProvider.Set(
                _requestContextFactory.Create(
                    new SurveyAndLayout {
                        Layout = defaultLayoutThemeAndSurveyModel.Layout,
                        Theme = defaultLayoutThemeAndSurveyModel.Theme,
                        Survey = defaultLayoutThemeAndSurveyModel.Survey
                    },
                    new Respondent { Language = LanguageCodeConstants.English },
                    Direction.FirstPage)
            );
        }
    }
}
