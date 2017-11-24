using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace LearningPlatform.Domain.SurveyDesign.RepositoryContracts
{
    public interface IOptionListRepository
    {
        OptionList GetById(string id);
        List<OptionList> GetBySurveyId(string surveyId);
        void Add(OptionList optionList);
        void AddMany(IList<OptionList> optionLists);
        void Update(OptionList optionList);
        void Delete(string optionListId);
        void DeleteMany(IEnumerable<string> optionListIds);
        void DeleteMany(IList<OptionList> optionLists);
        void DeleteOptionGroup(string optionListId, string optionGroupId);
        List<OptionList> Find(Expression<Func<OptionList, bool>> predicate);
        List<OptionList> GetByIds(IList<string> optionListIds);
    }
}
