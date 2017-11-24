using LearningPlatform.Application.SurveyDesign.Dtos;
using LearningPlatform.Domain.AccessControl;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Exceptions;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Services.Survey;
using LearningPlatform.Domain.SurveyDesign.Surveys;
using LearningPlatform.Domain.SurveyPublishing;
using LearningPlatform.Domain.UtilServices;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;

namespace LearningPlatform.Application.SurveyDesign
{
    public class SurveyDefinitionAppService
    {
        private readonly ISurveyVersionRepository _surveyVersionRepository;
        private readonly ISurveyRepository _surveyRepository;
        private readonly IReadSurveyService _readSurveyService;
        private readonly IUserRepository _userRepository;
        private readonly Domain.SurveyDesign.SurveyDesign.Factory _surveyDesignFactory;
        private readonly InsertSurveyService _insertSurveyService;
        private readonly PublishingService _publishingService;
        private readonly ExportSurveyService _exportSurveyService;
        private readonly DuplicateSurveyService _duplicateSurveyService;

        public SurveyDefinitionAppService(ISurveyRepository surveyRepository,
            ISurveyVersionRepository surveyVersionRepository,
            IReadSurveyService readSurveyService,
            IUserRepository userRepository,
            Domain.SurveyDesign.SurveyDesign.Factory surveyDesignFactory,
            InsertSurveyService insertSurveyService,
            PublishingService publishingService,
            ExportSurveyService exportSurveyService,
            DuplicateSurveyService duplicateSurveyService)
        {
            _surveyRepository = surveyRepository;
            _surveyVersionRepository = surveyVersionRepository;
            _readSurveyService = readSurveyService;
            _userRepository = userRepository;

            _surveyDesignFactory = surveyDesignFactory;
            _insertSurveyService = insertSurveyService;
            _publishingService = publishingService;
            _exportSurveyService = exportSurveyService;
            _duplicateSurveyService = duplicateSurveyService;
        }

        public void DeleteSurvey(Survey surveyInfo)
        {
            surveyInfo.IsDeleted = true;
            _surveyRepository.Update(surveyInfo);
        }

        public void RestoreSurvey(Survey surveyInfo)
        {
            surveyInfo.IsDeleted = false;
            _surveyRepository.Update(surveyInfo);
        }

        public Survey GetFullSurvey(Survey shallowSurvey)
        {
            _readSurveyService.PopulateSurveyContent(shallowSurvey);
            return shallowSurvey;
        }

        public Survey GetShallowSurvey(string surveyId)
        {
            return _surveyRepository.GetById(surveyId);
        }

        public string GetSurveyLatestPublishedVersion(string surveyId)
        {
            var survey = _surveyVersionRepository.GetLatest(surveyId);
            if (survey == null)
            {
                throw new SurveyNotFoundException($"Survey version with survey id = {surveyId} not found");
            }
            return survey.SerializedString;
        }

        public Survey CreateSurvey(string surveyName, string userId)
        {
            var surveyFactory = _surveyDesignFactory.Invoke(useDatabaseIds: true);

            var survey = surveyFactory.Survey(surveyName, userId);
            survey.LayoutId = "000000000000000000000001"; //TODO: Modify migration tool.
            survey.ThemeId = "000000000000000000000001"; //TODO: Modify migration tool.
            PopulateSurveySettings(survey, new SurveySettings
            {
                EnableBackButton = true,
                ResumeRespondentWhereLeftOff = false,
                KeyboardSupport = true,
                DisplayProgressBar = true,
                DisplayRequiredStar = true,
                DisplayPageTitleAndDescription = false,
                DisplayOneQuestionOnScreen = true,
                SurveyTitle = surveyName,
                Version = Guid.NewGuid().ToString()
            });

            surveyFactory.Survey(
                surveyFactory.Folder("topFolder",
                    surveyFactory.Page(p =>
                    {
                        p.Alias = "Page_" + DateTime.Now.Ticks;
                        p.OrderType = OrderType.InOrder;
                        p.NavigationButtonSettings = NavigationButtonSettings.Default;
                        p.Title = surveyFactory.CreateLanguageString("Page 1");
                        p.Version = Guid.NewGuid().ToString();
                    }),
                    surveyFactory.ThankYouPage()
                )
            );
            survey.TopFolder.OrderType = OrderType.InOrder;
            survey.TopFolder.Version = Guid.NewGuid().ToString();
            survey.Version = Guid.NewGuid().ToString();

            _insertSurveyService.InsertSurvey(survey);

            return survey;
        }

        public SurveySettings UpdateSurveySettings(Survey survey, SurveySettings settings)
        {
            PopulateSurveySettings(survey, settings);
            survey.SurveySettings.RowVersion = Guid.NewGuid().ToByteArray();
            survey.SurveySettings.Version = Guid.NewGuid().ToString();
            survey.Modified = DateTime.Now;

            _surveyRepository.Update(survey);

            return survey.SurveySettings;
        }

        private void PopulateSurveySettings(Survey survey, SurveySettings settings)
        {
            survey.SurveySettings.EnableBackButton = settings.EnableBackButton;
            survey.SurveySettings.ResumeRespondentWhereLeftOff = settings.ResumeRespondentWhereLeftOff;
            survey.SurveySettings.KeyboardSupport = settings.KeyboardSupport;
            survey.SurveySettings.DisplayProgressBar = settings.DisplayProgressBar;
            survey.SurveySettings.DisplayRequiredStar = settings.DisplayRequiredStar;
            survey.SurveySettings.DisplayPageTitleAndDescription = settings.DisplayPageTitleAndDescription;
            survey.SurveySettings.DisplayOneQuestionOnScreen = settings.DisplayOneQuestionOnScreen;
            survey.SurveySettings.InvitationOnlySurvey = settings.InvitationOnlySurvey;
            survey.SurveySettings.SingleSignOnSurvey = settings.SingleSignOnSurvey;
            survey.SurveySettings.SurveyTitle = settings.SurveyTitle;
        }

        public SurveyListItemDto DuplicateSurvey(Survey shallowSurvey, string userId, string newSurveyTitle)
        {
            _readSurveyService.PopulateSurveyContent(shallowSurvey);
            shallowSurvey.UserId = userId;

            var errors = new ValidateSurveyService(shallowSurvey).Validate();
            if (errors.Any())
            {
                throw new Exception("Can't duplicate an invalid survey");
            }

            Survey newSurvey;
            if (shallowSurvey.LibraryId == null)
            {
                newSurvey = _duplicateSurveyService.DuplicateSurveyAndAssets(shallowSurvey, newSurveyTitle);
            }
            else
            {
                shallowSurvey.LibraryId = null;
                newSurvey = _duplicateSurveyService.DuplicateSurvey(shallowSurvey, newSurveyTitle);
            }
            return new SurveyListItemDto(newSurvey);
        }

        public List<SurveyListItemDto> GetSurveyListItems(string userId)
        {
            var surveys = _surveyRepository.GetByUserId(userId);
            return surveys.Select(survey => new SurveyListItemDto(survey)).ToList();
        }

        public SurveyListDto Search(SurveySearchFilter searchModel)
        {
            var surveys = _surveyRepository.GetSurveys(searchModel);
            var surveyListItems = surveys.Select(survey => new SurveyListItemDto(survey)).ToList();
            var totalSurveys = _surveyRepository.Count(searchModel);

            PopulateSurveyOwners(surveyListItems);

            return new SurveyListDto
            {
                Surveys = surveyListItems,
                TotalSurveys = totalSurveys
            };
        }

        private void PopulateSurveyOwners(List<SurveyListItemDto> surveyListItems)
        {
            if (!surveyListItems.Any()) return;

            var surveyOwnerIds = surveyListItems.Select(p => p.UserId).Distinct().ToList();
            var surveyOwners = _userRepository.GetUsers(surveyOwnerIds);
            if (!surveyOwners.Any()) return;

            var surveyOwnerMap = new Dictionary<string, User>();
            foreach (var owner in surveyOwners)
            {
                surveyOwnerMap[owner.ExternalId] = owner;
            }

            foreach (var surveyListItem in surveyListItems)
            {
                User surveyOwner;
                if (surveyOwnerMap.TryGetValue(surveyListItem.UserId, out surveyOwner))
                {
                    surveyListItem.UserFullName = surveyOwner.FullName;
                }
            }
        }

        public Survey Publish(Survey survey)
        {
            _readSurveyService.PopulateSurveyContent(survey);

            var surveyErrors = new ValidateSurveyService(survey).Validate();
            if (surveyErrors.Any())
            {
                throw new Exception("Can't publish/re-publish an invalid survey.");
            }

            survey.Status = SurveyStatus.Open;
            _surveyRepository.Update(survey);

            _publishingService.Publish(survey.Id);

            return survey;
        }

        public string Export(Survey survey)
        {
            _readSurveyService.PopulateSurveyContent(survey);
            return _exportSurveyService.Export(survey);
        }

        public void UpdateSurveyStatus(Survey survey, SurveyStatus surveyStatus)
        {
            survey.Status = surveyStatus;
            _surveyRepository.Update(survey);
        }

        public void UpdateAccessRights(Survey survey, SurveyAccessRights accessRights, User currentUser, List<User> companyUsers)
        {
            accessRights.Full = accessRights.Full.Distinct().ToList();
            accessRights.Write = accessRights.Write.Distinct().ToList();
            accessRights.Write.RemoveAll(userId => accessRights.Full.Contains(userId));

            var receivedInvitationUserIds = new List<string>();
            if (survey.AccessRights != null)
            {
                receivedInvitationUserIds.AddRange(survey.AccessRights.Full);
                receivedInvitationUserIds.AddRange(survey.AccessRights.Write);
            }

            survey.AccessRights = accessRights;
            survey.Modified = DateTime.Now;
            _surveyRepository.Update(survey);

            var invitationUsers = companyUsers.Where(p =>
            receivedInvitationUserIds.Contains(p.ExternalId) == false &&
            (survey.AccessRights.Full.Contains(p.ExternalId) || survey.AccessRights.Write.Contains(p.ExternalId))).ToList();

            SendSurveyInvitations(survey, currentUser, invitationUsers);
        }

        public void SendSurveyInvitations(Survey survey, User sender, List<User> receivers)
        {
            var senderFullName = string.IsNullOrWhiteSpace(sender.FullName) ? "Someone" : sender.FullName;
            var surveyCreatorUrl = ConfigurationManager.AppSettings["SurveyCreatorUrl"];
            var surveyTitle = survey.SurveySettings.SurveyTitle;
            var surveyLink = $"{surveyCreatorUrl}/app/#/surveys/{survey.Id}/designer";
            var emailSubject = $"Survey \"{surveyTitle}\" - Invitation";

            foreach (var receiver in receivers.Where(p => !string.IsNullOrWhiteSpace(p.Email)))
            {
                var logo = ConfigurationManager.AppSettings["Logo"];
                var accessEmailHeaderImage = ConfigurationManager.AppSettings["AccessEmailHeaderImage"];
                var emailContent =
                    "<html><head><title>Survey Invitation</title></head><body style='margin: 0;'>" +
                        "<table width='100%' style='margin: 0; padding: 0; background-color: #eceff0' cellspacing='0' cellpadding='0'><tbody><tr><td><center>" +
                            "<table style='width: 640px; text-align: center; margin: 50px auto; font-family: Verdana; font-size: 16px; color: #444444; line-height: 25px; border: 0; border-spacing: 0; -webkit-font-smoothing: antialiased;' cellspacing='0' cellpadding='0'><tbody>" +
                                $"<tr><td style='border: 0; margin: 0; padding: 20px 0 40px'><img src='{logo}' style='display: block; margin: 0 auto' width='216' height='auto' alt='JobsCentral'/></td></tr>" +
                                $"<tr><td><img src='{accessEmailHeaderImage}' style='display: block' width='640' height='auto' alt='Apply Successully' /></td></tr>" +
                                "<tr><td style='height: 20px; background-color:#ffffff; margin: 0; padding: 0'></td></tr>" +
                                "<tr><td style='background-color:#ffffff; padding:0 30px; margin: 0; text-align: left;'>" +
                                    $"<p>Hi <strong>{receiver.FullName}</strong>,</p>" +
                                    $"<p><strong>{senderFullName}</strong> has granted you access to the survey \'<strong>{surveyTitle}</strong>\'. </td></tr>" +
                                "<tr><td style='height: 20px; background-color:#ffffff; margin: 0; padding: 0'></td></tr>" +
                                "<tr><td style='background-color:#ffffff; margin: 0; padding: 0' align='center'>" +
                                    "<table width='35%'><tr>" +
                                        "<td style='background-color: #3f73c7; margin: 0 auto; padding: 10px; display: block; border-radius: 10px; cursor: pointer;' align='center'>" +
                                            $"<a style='font-family: Verdana; text-align:center; font-size: 14px; color: #ffffff; border: 0; display: block; text-transform: uppercase; font-weight: normal; text-decoration: none;' href = '{surveyLink}' alt = 'Click Here To View This Application'>" +
                                                "Click here to edit it" +
                                            "</a>" +
                                    "</td></tr></table>" +
                                "</td></tr>" +
                                "<tr><td style='height: 20px; background-color:#ffffff; margin: 0; padding: 0'></td></tr>" +
                            "</tbody></table>" +
                        "</center></td></tr></tbody></table>" +
                    "</body></html>";

                EmailService.SendMail(receiver.Email, emailSubject, emailContent);
            }
        }

        public ValidationResult ValidateAccessRights(SurveyAccessRights accessRights, List<User> companyUsers)
        {
            if (accessRights == null)
            {
                return new ValidationResult { Valid = false, Message = "Invalid access rights" };
            }

            var companyUserIds = companyUsers.Select(p => p.ExternalId).ToList();
            if (accessRights.Full.Except(companyUserIds).Any() ||
                accessRights.Write.Except(companyUserIds).Any())
            {
                return new ValidationResult { Valid = false, Message = "Access rights contains invalid user ids" };
            }

            return new ValidationResult { Valid = true };
        }
    }
}
