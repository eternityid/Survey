using LearningPlatform.Application.SurveyDesign;
using LearningPlatform.Application.SurveyExecution;
using LearningPlatform.Data.Memory.Repositories;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Respondents;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyExecution.Engine;
using LearningPlatform.Domain.SurveyExecution.Engine.RandomDataGenerator;
using LearningPlatform.Domain.SurveyExecution.Questions;
using LearningPlatform.Domain.SurveyExecution.RepositoryContracts;
using LearningPlatform.Domain.SurveyExecution.Request;
using LearningPlatform.Domain.SurveyPublishing;
using LearningPlatform.SurveyExecution.Data.Repositories.Memory;
using LearningPlatform.TestFramework;

namespace LearningPlatform.Specs
{
    public class InstanceContext
    {
        public InstanceContext()
        {
            RespondentRepository = ServiceLocator.Resolve<IRespondentSurveyExecutionRepository>() as RespondentMemoryRepository;
            ResponseRowRepository = ServiceLocator.Resolve<IResponseRowRepository>() as ResponseRowMemoryRepository;
            QuestionService = ServiceLocator.Resolve<IQuestionService>();
            SurveyRepository = ServiceLocator.Resolve<ISurveyRepository>() as SurveyMemoryRepository;
            SurveyAppService = ServiceLocator.Resolve<SurveyAppService>();
            PublishingService = ServiceLocator.Resolve<PublishingService>();
            PageService = ServiceLocator.Resolve<PageService>();
            RandomDataGenerator = ServiceLocator.Resolve<RandomDataGenerator>();
            ControlledRandom = ServiceLocator.Resolve<IThreadSafeRandom>() as ControlledRandomForTests;
            RespondentUrlService = ServiceLocator.Resolve<RespondentUrlService>();
            RequestContext = ServiceLocator.Resolve<RequestContextWrapper>();
            ImportExportSurveyService = ServiceLocator.Resolve<ImportExportSurveyAppService>();
        }

        public RequestContextWrapper RequestContext { get; set; }

        public ControlledRandomForTests ControlledRandom { get; private set; }

        public RandomDataGenerator RandomDataGenerator { get; private set; }
        public PageService PageService { get; private set; }
        public RespondentMemoryRepository RespondentRepository { get; private set; }
        public ResponseRowMemoryRepository ResponseRowRepository { get; private set; }
        public IQuestionService QuestionService { get; private set; }
        public SurveyAppService SurveyAppService { get; private set; }
        public SurveyMemoryRepository SurveyRepository { get; private set; }
        public PublishingService PublishingService { get; private set; }
        public RespondentUrlService RespondentUrlService { get; set; }
        public ImportExportSurveyAppService ImportExportSurveyService { get; private set; }
    }
}