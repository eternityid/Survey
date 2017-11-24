using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyThemes;
using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Data.EntityFramework.Repositories
{
    internal class ThemeSqlRepository : IThemeRepository
    {
        private readonly GenericRepository<Theme> _genericRepository;

        public ThemeSqlRepository(GenericRepository<Theme> genericRepository)
        {
            _genericRepository = genericRepository;
        }

        private SurveysDb.SurveysContext Context => _genericRepository.Context;

        public void Add(Theme theme)
        {
            _genericRepository.Add(theme);
        }

        public void AddMany(IList<Theme> themes)
        {
            _genericRepository.AddMany(themes);
        }

        public void Delete(string id)
        {
            _genericRepository.Remove(GetById(id));
        }

        public void Update(Theme theme)
        {
            _genericRepository.Update(theme);
        }

        public Theme GetById(string id)
        {
            return Context.Themes.FirstOrDefault(t => t.Id == id);
        }

        public IQueryable<Theme> GetAll()
        {
            return Context.Themes.OrderByDescending(t => t.Name);
        }

        public IList<Theme> GetByIds(IEnumerable<string> ids)
        {
            return Context.Themes.Where(p => ids.Contains(p.Id)).ToList();
        }

        public Theme GetDefaultTheme()
        {
            //TODO: Consider index use (and where clause)
            Theme theme = Context.Themes
                .FirstOrDefault(t => t.IsDefault);
            return theme;
        }

        public List<Theme> GetByType(ThemeType type)
        {
            return Context.Themes.Where(p => p.Type == type).ToList();
        }


        public List<Theme> GetSystemAndUserThemesByUserId(string userId)
        {
            return Context.Themes.Where(p => (p.Type == ThemeType.System) || (p.Type == ThemeType.User && p.UserId == userId)).ToList();
        }

        public List<Theme> GetByUserId(string userId)
        {
            //TODO: Consider index use (and where clause)
            return Context.Themes.Where(p => p.UserId != null && p.UserId == userId).ToList();
        }

        public List<Theme> GetAvailableThemesForSurvey(string userId, params string[] includedThemeIds)
        {
            return Context.Themes.Where(x =>
                (x.Type == ThemeType.System ||
                 (x.Type == ThemeType.User && x.UserId == userId) ||
                 includedThemeIds.Contains(x.Id)) && x.IsPageOverride.Value != true).ToList();
        }
    }
}