using LearningPlatform.Domain.SurveyThemes;
using System.Collections.Generic;
using System.Linq;
namespace LearningPlatform.Domain.SurveyDesign.RepositoryContracts
{
    public interface IThemeRepository
    {
        Theme GetById(string id);
        void Add(Theme theme);
        void AddMany(IList<Theme> themes);
        void Update(Theme theme);
        void Delete(string id);
        IQueryable<Theme> GetAll();
        IList<Theme> GetByIds(IEnumerable<string> ids);
        Theme GetDefaultTheme();
        List<Theme> GetByType(ThemeType type);
        List<Theme> GetByUserId(string userId);
        List<Theme> GetSystemAndUserThemesByUserId(string userId);
        List<Theme> GetAvailableThemesForSurvey(string userId, params string[] includedThemeIds);
    }
}
