using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyThemes;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Data.MongoDb.Repositories
{
    internal class ThemeRepository : RepositoryBase, IThemeRepository
    {
        public ThemeRepository(IRequestObjectProvider<MongoDbContext> mongoDbContextProvider) : base(mongoDbContextProvider)
        {
        }

        private IMongoCollection<Theme> ThemeCollection => DbContext.ThemeCollection;

        public Theme GetById(string id)
        {
            return ThemeCollection.Find(f => f.Id == id).FirstOrDefault();
        }

        public void Add(Theme theme)
        {
            ThemeCollection.InsertOne(theme);
        }

        public void AddMany(IList<Theme> themes)
        {
            if (themes != null && themes.Any())
            {
                ThemeCollection.InsertMany(themes);
            }
        }

        public void Update(Theme theme)
        {
            ThemeCollection.ReplaceOne(p => p.Id == theme.Id, theme, new UpdateOptions { IsUpsert = true });
        }

        public void Delete(string id)
        {
            ThemeCollection.DeleteOne(p => p.Id == id);
        }

        public IQueryable<Theme> GetAll()
        {
            throw new System.NotImplementedException();
        }

        public IList<Theme> GetByIds(IEnumerable<string> ids)
        {
            return ThemeCollection.FindSync(p => ids.Contains(p.Id)).ToList();
        }

        public Theme GetDefaultTheme()
        {
            return ThemeCollection.Find(p => p.IsDefault).FirstOrDefault();
        }

        public List<Theme> GetByType(ThemeType type)
        {
            return ThemeCollection.FindSync(p => p.Type == type).ToList();
        }

        public List<Theme> GetByUserId(string userId)
        {
            return ThemeCollection.FindSync(p => p.UserId == userId).ToList();
        }

        public List<Theme> GetSystemAndUserThemesByUserId(string userId)
        {
            throw new System.NotImplementedException();
        }

        public List<Theme> GetAvailableThemesForSurvey(string userId, string currentThemeId)
        {
            return ThemeCollection.FindSync(p =>
              (p.Type == ThemeType.System || (p.Type == ThemeType.User && p.UserId == userId) || p.Id == currentThemeId) &&
              p.IsPageOverride.Value != true).ToList();
        }

        public List<Theme> GetAvailableThemesForSurvey(string userId, params string[] includedThemeIds)
        {
            var sort = Builders<Theme>.Sort.Ascending("Type").Ascending("Name");
            var options = new FindOptions<Theme>
            {
                Sort = sort
            };

            return ThemeCollection.FindSync(t =>
                (t.Type == ThemeType.System ||
                (t.Type == ThemeType.User && t.UserId == userId) ||
                includedThemeIds.Contains(t.Id)) && t.IsPageOverride.Value != true, options).ToList();
        }
    }
}
