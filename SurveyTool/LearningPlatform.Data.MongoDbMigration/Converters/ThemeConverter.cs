using Autofac;
using LearningPlatform.Domain.Helpers;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using System;
using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Data.MongoDbMigration.Converters
{
    public class ThemeConverter
    {
        private readonly Containers _containers;

        public ThemeConverter(Containers containers)
        {
            _containers = containers;
        }

        public Dictionary<string, string> IdMap { get; } = new Dictionary<string, string>();


        public void Convert()
        {
            var sqlThemeRepository = _containers.EntityFrameworkContainer.Resolve<IThemeRepository>();
            var mongoThemeRepository = _containers.MongoDbContainer.Resolve<IThemeRepository>();


            var themes = sqlThemeRepository.GetAll();
            var totalThemes = themes.Count();
            var currentThemeIndex = 1;

            foreach (var theme in themes)
            {
                Console.WriteLine($"Converting Theme: {currentThemeIndex}/{totalThemes}");
                currentThemeIndex++;

                var objectId = ObjectIdHelper.GetObjectIdFromLongString(theme.Id);
                IdMap[theme.Id] = objectId;
                theme.Id = objectId;
                mongoThemeRepository.Add(theme);
            }
        }
    }
}