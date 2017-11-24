using Autofac;
using LearningPlatform.Data.EntityFramework.Repositories;
using LearningPlatform.Domain.Helpers;
using LearningPlatform.Domain.SurveyLayout;
using System;
using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Data.MongoDbMigration.Converters
{
    public class LayoutConverter
    {
        private readonly Containers _containers;

        public LayoutConverter(Containers containers)
        {
            _containers = containers;
        }

        public Dictionary<string, string> IdMap { get; } = new Dictionary<string, string>();

        public void Convert()
        {
            var surveysContext = _containers.EntityFrameworkContainer.Resolve<SurveysContextProvider>().Get();
            var sqlLayoutRepository = _containers.EntityFrameworkContainer.Resolve<ILayoutRepository>();
            var mongoLayoutRepository = _containers.MongoDbContainer.Resolve<ILayoutRepository>();

            var layoutIds = surveysContext.Layouts.Select(l => l.Id).ToList();
            var totalLayouts = layoutIds.Count;
            var currentLayoutIndex = 1;

            foreach (var layoutId in layoutIds)
            {
                Console.WriteLine($"Converting Layout: {currentLayoutIndex}/{totalLayouts}");
                currentLayoutIndex++;

                var layout = sqlLayoutRepository.GetById(layoutId);
                var objectId = ObjectIdHelper.GetObjectIdFromLongString(layout.Id);
                IdMap[layout.Id] = objectId;
                layout.Id = objectId;
                mongoLayoutRepository.Add(layout);
            }
        }

    }
}
