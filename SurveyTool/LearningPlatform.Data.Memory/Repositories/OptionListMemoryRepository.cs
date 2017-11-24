using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace LearningPlatform.Data.Memory.Repositories
{
    public class OptionListMemoryRepository: IOptionListRepository
    {
        public OptionList GetById(string id)
        {
            throw new NotImplementedException();
        }

        public List<OptionList> GetBySurveyId(string surveyId)
        {
            throw new NotImplementedException();
        }

        public void Add(OptionList optionList)
        {
            throw new NotImplementedException();
        }

        public void AddMany(IList<OptionList> optionLists)
        {
            throw new NotImplementedException();
        }

        public void Update(OptionList optionList)
        {
            //Don't need to do anything
        }

        public void Delete(string optionListId)
        {
            throw new NotImplementedException();
        }

        public void DeleteMany(IEnumerable<string> optionListIds)
        {
            throw new NotImplementedException();
        }

        public void DeleteMany(IList<OptionList> optionLists)
        {
            throw new NotImplementedException();
        }

        public void DeleteOptionGroup(string optionListId, string optionGroupId)
        {
            throw new NotImplementedException();
        }

        public List<OptionList> Find(Expression<Func<OptionList, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        public List<OptionList> GetByIds(IList<string> optionListIds)
        {
            throw new NotImplementedException();
        }
    }
}
