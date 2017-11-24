using System;
using Autofac;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyExecution.RepositoryContracts;

namespace LearningPlatform.Domain.SurveyExecution.Engine.RandomDataGenerator
{
    public class RandomDataGeneratorService
    {
        private readonly ILifetimeScope _lifetimeScope;
        private readonly IDataMemoryAccessModule _dataMemoryAccessModule;
        private readonly IBulkCopyResponses _bulkCopyResponses;
        private readonly IThreadSafeRandom _random;

        public RandomDataGeneratorService(
            ILifetimeScope lifetimeScope,
            IDataMemoryAccessModule dataMemoryAccessModule,
            IBulkCopyResponses bulkCopyResponses, IThreadSafeRandom random)
        {
            _lifetimeScope = lifetimeScope;
            _dataMemoryAccessModule = dataMemoryAccessModule;
            _bulkCopyResponses = bulkCopyResponses;
            _random = random;
        }

        public void Generate(string surveyId, RandomDataGeneratorSettings settings, bool isTesting = true)
        {
            using (var container = _lifetimeScope.BeginLifetimeScope(
                builder =>
                {
                    builder.RegisterModule(_dataMemoryAccessModule);
                    builder.RegisterModule<DomainMemoryAccessModule>();
                }))
            {
                var randomDataGenerator = container.Resolve<RandomDataGenerator>();

                randomDataGenerator.Generate(surveyId, settings.Iterations, isTesting);
                var respondentRepository = container.Resolve<IRespondentSurveyExecutionRepository>();
                var responseRowRepository = container.Resolve<IResponseRowRepository>();

                var respondents = respondentRepository.GetAll(surveyId);
                if (settings.RandomizeDateTimes)
                {
                    foreach (var respondent in respondents)
                    {
                        var completed = _random.NextRandomDateTime(settings.FromDateTime,
                            settings.ToDateTime.AddDays(1));
                        respondent.Started =
                            completed.Subtract(
                                TimeSpan.FromSeconds(_random.Next(settings.MinDuration, settings.MaxDuration)));
                        respondent.LastModified = completed;
                        respondent.Completed = completed;
                    }
                }
                var responseRows = responseRowRepository.GetAll(surveyId);
                _bulkCopyResponses.AddBulkResponses(respondents, responseRows, surveyId, isTesting);
            }

        }
    }

}