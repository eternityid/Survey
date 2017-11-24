using System;
using System.Collections.Generic;
using Autofac;
using LearningPlatform.Domain.Resources;
using LearningPlatform.Domain.SurveyExecution.Questions;
using LearningPlatform.Domain.Constants;

namespace LearningPlatform.Domain.SurveyExecution
{
    public class StandardPageFactory
    {
        private readonly IResourceManager _resourceManager;
        private readonly IComponentContext _componentContext;

        public StandardPageFactory(IResourceManager resourceManager, IComponentContext componentContext)
        {
            _resourceManager = resourceManager;
            _componentContext = componentContext;
        }


        public Page CreateInvitationOnlyPage()
        {
            var invitationOnlyMessage = _resourceManager.GetString(ValidationConstants.InvitationOnly);
            return CreatePage(invitationOnlyMessage);
        }

        public Page CreateNotOpenSurveyPage()
        {
            var surveyNotOpenMessage = _resourceManager.GetString(ValidationConstants.SurveyNotOpen);
            return CreatePage(surveyNotOpenMessage);
        }

        public Page CreateDeletedSurveyPage()
        {
            var surveyNotOpenMessage = _resourceManager.GetString(ValidationConstants.DeletedSurvey);
            return CreatePage(surveyNotOpenMessage);
        }

        private Page CreatePage(string message)
        {
            return new Page(new List<Question>
            {
                new Information {
                    TitleEvaluationString = CreateEvaluationString(message),
                    DescriptionEvaulationString = CreateEvaluationString("")
                }
            })
            {
                NavigationButtons = NavigationButtons.None,
            };
        }

        private EvaluationString CreateEvaluationString(string message)
        {
            var ret = _componentContext.Resolve<EvaluationString>();
            ret.Value = message;
            return ret;
        }
    }
}