using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Services.Survey;
using System.Collections.Generic;

namespace LearningPlatform.Data.EntityFramework.DemoData
{
    public class ComplexSurveyDefinitionDemo
    {
        private readonly ISurveyRepository _surveyRepository;
        private readonly InsertSurveyService _insertSurveyService;
        private readonly Domain.SampleData.ComplexSurveyDefinitionSample _complexSurveyDefinitionDemo;


        public ComplexSurveyDefinitionDemo(ISurveyRepository surveyRepository, 
            InsertSurveyService insertSurveyService,
            Domain.SampleData.ComplexSurveyDefinitionSample complexSurveyDefinitionDemo)
        {
            _surveyRepository = surveyRepository;
            _insertSurveyService = insertSurveyService;
            _complexSurveyDefinitionDemo = complexSurveyDefinitionDemo;
        }

        public void InsertData()
        {
            const string surveyId = "2";
            if (_surveyRepository.Exists(surveyId)) return;

            _insertSurveyService.InsertSurvey(_complexSurveyDefinitionDemo.CreateSurvey());
        }
    }
}