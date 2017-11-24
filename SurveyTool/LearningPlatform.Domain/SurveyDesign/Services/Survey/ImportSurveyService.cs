using LearningPlatform.Domain.SurveyDesign.ImportExportSurveyDefinition;
using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Surveys;
using LearningPlatform.Domain.SurveyLayout;
using Newtonsoft.Json;
using System;
using System.Linq;

namespace LearningPlatform.Domain.SurveyDesign.Services.Survey
{
    public class ImportSurveyService
    {
        private readonly ISurveyRepository _surveyRepository;
        private readonly INodeRepository _nodeRepository;
        private readonly IQuestionDefinitionRepository _questionDefinitionRepository;
        private readonly IOptionListRepository _optionListRepository;
        private readonly ILayoutRepository _layoutRepository;
        private readonly IThemeRepository _themeRepository;

        private readonly SurveyDesign.Factory _surveyDesignFactory;


        public ImportSurveyService(ISurveyRepository surveyRepository,
            INodeRepository nodeRepository,
            IQuestionDefinitionRepository questionDefinitionRepository,
            IOptionListRepository optionListRepository,
            ILayoutRepository layoutRepository,
            IThemeRepository themeRepository,
            SurveyDesign.Factory surveyDesignFactory)
        {
            _surveyRepository = surveyRepository;
            _nodeRepository = nodeRepository;
            _questionDefinitionRepository = questionDefinitionRepository;
            _optionListRepository = optionListRepository;
            _layoutRepository = layoutRepository;
            _themeRepository = themeRepository;

            _surveyDesignFactory = surveyDesignFactory;
        }

        public Domain.SurveyDesign.Survey Import(string content, string surveyName, string userId)
        {
            Domain.SurveyDesign.Survey newSurvey = CreateEmptySurvey(userId);
            _surveyRepository.Add(newSurvey);

            var deferredPropertyUpdates = new DeferredPropertyUpdates();
            Domain.SurveyDesign.Survey surveyFromFile = ReadSurveyFromJson(content, newSurvey.Id, deferredPropertyUpdates);

            newSurvey.SurveySettings = surveyFromFile.SurveySettings;
            newSurvey.SurveySettings.SurveyTitle = surveyName;
            newSurvey.TopFolder = surveyFromFile.TopFolder;
            new EnsureSurveyObjectIdsService().EnsureObjectIds(newSurvey);
            deferredPropertyUpdates.UpdateProperties(newSurvey);
            _nodeRepository.Update(newSurvey.TopFolder);

            var pages = newSurvey.TopFolder.ChildNodes.ToList();
            pages.ForEach(p =>
            {
                var page = p as PageDefinition;
                if (page != null)
                {
                    _nodeRepository.Update(page);
                    var questions = page.QuestionDefinitions.ToList();
                    questions.ForEach(q =>
                    {
                        _questionDefinitionRepository.Update(q);

                        var questionWithOptionsDefinition = q as QuestionWithOptionsDefinition;
                        if (questionWithOptionsDefinition != null) _optionListRepository.Update(questionWithOptionsDefinition.OptionList);

                        var gridQuestionDefinition = q as GridQuestionDefinition;
                        var subQuestionWithOptions = gridQuestionDefinition?.SubQuestionDefinition as QuestionWithOptionsDefinition;
                        if (subQuestionWithOptions != null) _optionListRepository.Update(subQuestionWithOptions.OptionList);
                    });
                }
            });
            newSurvey.Modified = DateTime.Now;
            newSurvey.Version = Guid.NewGuid().ToString();
            _surveyRepository.Update(newSurvey);
            return newSurvey;
        }

        private Domain.SurveyDesign.Survey CreateEmptySurvey(string userId)
        {
            var surveyFactory = _surveyDesignFactory.Invoke(useDatabaseIds: true);
            var newSurvey = surveyFactory.Survey(settings: s =>
            {
                s.UserId = userId;
                s.Status = SurveyStatus.New;
                s.Created = DateTime.Now;
                s.Modified = DateTime.Now;
                s.LayoutId = _layoutRepository.GetDefaultLayout().Id;
                s.ThemeId = _themeRepository.GetDefaultTheme().Id;
            });
            return newSurvey;
        }

        private Domain.SurveyDesign.Survey ReadSurveyFromJson(string content, string newSurveyId, DeferredPropertyUpdates deferredPropertyUpdates)
        {
            var json = TypeTokenUpdater.Restore(content);
            var jsonSerializerSettings = JsonSerializerSettingsFactory.CreateForImport(newSurveyId, deferredPropertyUpdates);
            return JsonConvert.DeserializeObject<Domain.SurveyDesign.Survey>(json, jsonSerializerSettings);
        }

    }
}
