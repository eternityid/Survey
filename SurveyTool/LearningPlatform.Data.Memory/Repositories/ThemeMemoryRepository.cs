using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyThemes;
using System;
using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Data.Memory.Repositories
{
    public class ThemeMemoryRepository : IThemeRepository
    {

        public Theme GetById(string id)
        {
            return new Theme {Id = "000000000000000000000001" };
        }

        public void Add(Theme theme)
        {

        }

        public void AddMany(IList<Theme> themes)
        {
            throw new NotImplementedException();
        }

        public void Update(Theme theme)
        {

        }

        public void Delete(string id)
        {

        }

        public IQueryable<Theme> GetAll()
        {
           return null;
        }

        public IList<Theme> GetByIds(IEnumerable<string> ids)
        {
            return new List<Theme>();
        }

        public Theme GetDefaultTheme()
        {
            return GetById("000000000000000000000001");
        }

        public List<Theme> GetByType(ThemeType type)
        {
            return null;
        }
        public List<Theme> GetSystemAndUserThemesByUserId(string userId)
        {
            return null;
        }

        public List<Theme> GetByUserId(string userId)
        {
            return null;
        }

        public List<Theme> GetAvailableThemesForSurvey(string userId, params string[] includedThemeIds)
        {
            return null;
        }
    }
}