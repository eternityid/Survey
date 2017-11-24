using Autofac;
using LearningPlatform.Data.EntityFramework.Repositories;
using LearningPlatform.Domain.Helpers;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Services.Survey;
using System;
using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Data.MongoDbMigration.Converters
{
    public class SurveyConverter
    {
        private readonly Containers _containers;
        private readonly LayoutConverter _layoutConverter;
        private readonly ThemeConverter _themeConverter;
        private readonly QuestionConverter _questionConverter;
        private readonly NodeConverter _nodeConverter;
        private readonly OptionListConverter _optionListConverter;

        public SurveyConverter(Containers containers,
            LayoutConverter layoutConverter,
            ThemeConverter themeConverter,
            QuestionConverter questionConverter,
            NodeConverter nodeConverter,
            OptionListConverter optionListConverter)
        {
            _containers = containers;
            _layoutConverter = layoutConverter;
            _themeConverter = themeConverter;
            _questionConverter = questionConverter;
            _nodeConverter = nodeConverter;
            _optionListConverter = optionListConverter;
        }

        public void Convert()
        {
            var surveyInsertService = _containers.MongoDbContainer.Resolve<InsertSurveyService>();
            var surveysContext = _containers.EntityFrameworkContainer.Resolve<SurveysContextProvider>().Get();
            var sqlSurveyRepository = _containers.EntityFrameworkContainer.Resolve<ISurveyRepository>();

            var surveyIds = surveysContext.Surveys.Select(s => s.Id).ToList();
            var totalSurveys = surveyIds.Count;
            var currentSurveyIndex = 1;

            foreach (var surveyId in surveysContext.Surveys.Select(s => s.Id).ToList())
            {
                Console.WriteLine($"Converting Survey: {currentSurveyIndex}/{totalSurveys}");
                currentSurveyIndex++;

                var survey = sqlSurveyRepository.GetById(surveyId);
                survey.Id = ObjectIdHelper.GetObjectIdFromLongString(survey.Id);

                var nodeService = new NodeService(survey);
                _optionListConverter.Convert(nodeService);

                HandleSharedOptions(survey);

                _questionConverter.Convert(nodeService);
                _nodeConverter.Convert(nodeService);

                survey.LayoutId = _layoutConverter.IdMap[survey.LayoutId];
                survey.ThemeId = _themeConverter.IdMap[survey.ThemeId];
                survey.AccessRights = new SurveyAccessRights();
                survey.SurveySettings.SurveyTitle = survey.Name;
                survey.Name = null;
                surveyInsertService.InsertSurvey(survey);
            }
        }

        private static void HandleSharedOptions(Survey survey)
        {
            if (survey.SharedOptionLists != null)
            {
                survey.SharedOptionListIds = new List<string>();
                foreach (var optionList in survey.SharedOptionLists)
                {
                    survey.SharedOptionListIds.Add(optionList.Id);
                }
            }
        }
    }
}
