using LearningPlatform.Application.SurveyExecution.Models;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Exceptions;
using LearningPlatform.Domain.SurveyExecution;
using LearningPlatform.Domain.SurveyExecution.Engine;
using LearningPlatform.Domain.SurveyExecution.RepositoryContracts;
using LearningPlatform.Domain.SurveyExecution.Request;
using LearningPlatform.Domain.SurveyPublishing;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using LearningPlatform.Domain.SurveyDesign.Services.Page;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace LearningPlatform.Application.SurveyExecution
{
    public class SurveyAppService
    {
        private readonly PublishingService _publishingService;
        private readonly SurveyExecutor _surveyExecutor;
        private readonly RequestInitializer _requestInitializer;
        private readonly IRespondentSurveyExecutionRepository _respondentRepository;
        private readonly DynamicPageService _dynamicPageService;

        public SurveyAppService(SurveyExecutor surveyExecutor,
            PublishingService publishingService,
            RequestInitializer requestInitializer,
            IRespondentSurveyExecutionRepository respondentRepository, 
            DynamicPageService dynamicPageService)
        {
            _surveyExecutor = surveyExecutor;
            _publishingService = publishingService;
            _requestInitializer = requestInitializer;
            _respondentRepository = respondentRepository;
            _dynamicPageService = dynamicPageService;
        }

        public Page BeginSurvey(string surveyId, bool isTesting, string pageIdAsString, string securityString, DeviceDetectionModel deviceDetectionModel)
        {
            return securityString == null ?
                BeginOpenSurvey(surveyId, isTesting, pageIdAsString) :
                ResumeSurvey(surveyId, isTesting, securityString, pageIdAsString);
        }

        public Page BeginOpenSurvey(string surveyId, bool isTesting, string pageIdString = null, DeviceDetectionModel deviceDetectionModel = null)
        {
            var surveyAndLayout = _publishingService.GetSurveyAndLayout(surveyId, isTesting);
            var requestContext = _requestInitializer.Initialize(surveyAndLayout, Direction.FirstPage);
            var standardPage = _surveyExecutor.ValidateSurvey(surveyAndLayout);
            if (standardPage != null) return standardPage;

            var page = _surveyExecutor.BeginOpenSurvey(surveyAndLayout, pageIdString);
            SetupPageMetadata(page, requestContext);
            UpdateRespondentDevice(requestContext, deviceDetectionModel);
            return page;
        }

        public Page ResumeSurvey(string surveyId, bool isTesting, string securityString, string pageIdString = null, DeviceDetectionModel deviceDetectionModel = null)
        {
            if (securityString == null) throw new ArgumentNullException(nameof(securityString));

            var surveyAndLayout = _publishingService.GetSurveyAndLayout(surveyId, isTesting);
            var requestContext = _requestInitializer.Initialize(surveyAndLayout, Direction.Forward);

            var errorPage = _surveyExecutor.ValidateSurvey(surveyAndLayout);
            if (errorPage != null) return errorPage;

            var page = _surveyExecutor.ResumeSurvey(surveyAndLayout, securityString, pageIdString);
            SetupPageMetadata(page, requestContext);
            UpdateRespondentDevice(requestContext, deviceDetectionModel);
            return page;
        }


        private void UpdateRespondentDevice(IRequestContext requestContext, DeviceDetectionModel deviceDetectionModel)
        {
            var respondent = requestContext.Respondent;
            if (respondent == null || deviceDetectionModel == null) return;

            respondent.IsMobile = deviceDetectionModel.IsMobile;
            respondent.TouchEvents = deviceDetectionModel.TouchEvents;
            respondent.ScreenPixelsWidth = deviceDetectionModel.ScreenPixelsWidth;
            respondent.ScreenPixelsHeight = deviceDetectionModel.ScreenPixelsHeight;
            respondent.UserAgent = deviceDetectionModel.UserAgent;

            _respondentRepository.Update(respondent, requestContext.IsTesting);
        }

        public Page Navigate(string surveyId, bool isTesting, Direction direction, NameValueCollection nameValueCollection)
        {
            var surveyAndLayout = _publishingService.GetSurveyAndLayout(surveyId, isTesting);
            var requestContext = _requestInitializer.Initialize(surveyAndLayout, direction);

            var standardPage = _surveyExecutor.ValidateSurvey(surveyAndLayout);
            if (standardPage != null) return standardPage;
            var page = _surveyExecutor.Navigate(surveyAndLayout, direction, nameValueCollection);
            SetupPageMetadata(page, requestContext);
            return page;
        }

        public Page PeekPage(string surveyId, bool isTesting, NameValueCollection nameValueCollection, Direction direction)
        {
            var surveyAndLayout = _publishingService.GetSurveyAndLayout(surveyId, isTesting);
            if (surveyAndLayout == null) throw new InvalidDataException("Survey is not found");

            var requestContext = _requestInitializer.Initialize(surveyAndLayout, direction);
            var page = _surveyExecutor.PeekPage(surveyAndLayout, nameValueCollection, direction);
            SetupPageMetadata(page, requestContext);
            return page;
        }

        public IList<QuestionError> UpsertIncommingPageAnswers(string surveyId, bool isTesting, NameValueCollection nameValueCollection)
        {
            var surveyAndLayout = _publishingService.GetSurveyAndLayout(surveyId, isTesting);
            if (surveyAndLayout == null) throw new InvalidDataException("Survey is not found");

            _requestInitializer.Initialize(surveyAndLayout, Direction.SamePage);
            var pageErrors = _surveyExecutor.UpsertIncommingPageAnswers(surveyAndLayout, nameValueCollection);
            return pageErrors;
        }

        private void SetupPageMetadata(Page page, IRequestContext requestContext)
        {
            var pageDef = requestContext.NodeService.GetPageDefinition(page.GetPageId());
            if (pageDef == null) return;
			
            page.HasSkipActions = pageDef.SkipCommands.Any();
            page.IsDynamicPage = _dynamicPageService.IsDynamicPage(pageDef);
        }

    }
}