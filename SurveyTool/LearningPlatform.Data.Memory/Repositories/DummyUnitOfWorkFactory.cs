using LearningPlatform.Domain.Common;

namespace LearningPlatform.Data.Memory.Repositories
{
    public class DummyUnitOfWorkFactory : IUnitOfWorkFactory
    {
        private readonly SurveyMemoryContext _surveyMemoryContext;

        public DummyUnitOfWorkFactory(SurveyMemoryContext surveyMemoryContext)
        {
            _surveyMemoryContext = surveyMemoryContext;
        }

        public IUnitOfWork Create()
        {
            return new DummyUnitOfWork(_surveyMemoryContext).Begin();
        }
    }
}