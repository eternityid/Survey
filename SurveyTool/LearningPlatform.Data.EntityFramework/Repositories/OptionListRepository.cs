using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace LearningPlatform.Data.EntityFramework.Repositories
{
    class OptionListRepository : IOptionListRepository
    {
        private readonly GenericRepository<OptionList> _genericRepository;
        private readonly SurveysContextProvider _contextProvider;

        public OptionListRepository(GenericRepository<OptionList> genericRepository, SurveysContextProvider contextProvider)
        {
            _genericRepository = genericRepository;
            _contextProvider = contextProvider;
        }

        private SurveysDb.SurveysContext Context => _contextProvider.Get();


        public OptionList GetById(string id)
        {
            return _genericRepository.GetById(p=>p.Id==id, includePath=>includePath.Options);
        }

        public List<OptionList> GetBySurveyId(string surveyId)
        {
            return _genericRepository.GetAll(p => p.SurveyId == surveyId, includePath => includePath.Options).ToList();
        }

        public void Add(OptionList optionList)
        {
            _genericRepository.Add(optionList);
        }

        public void AddMany(IList<OptionList> optionLists)
        {
            throw new NotImplementedException();
        }

        public void Update(OptionList optionList)
        {
            _genericRepository.Update(optionList);
        }

        public void Delete(string optionListId)
        {
            _genericRepository.Remove(optionListId);
        }

        public void DeleteMany(IList<OptionList> optionLists)
        {
            throw new NotImplementedException();
        }

        public void DeleteOptionGroup(string optionListId, string optionGroupId)
        {
            Context.OptionGroups.Remove(Context.OptionGroups.Find(optionGroupId));
        }

        public List<OptionList> Find(Expression<Func<OptionList, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        public List<OptionList> GetByIds(IList<string> optionListIds)
        {
            throw new NotImplementedException();
        }

        public void DeleteMany(IEnumerable<string> optionListIds)
        {
            throw new NotImplementedException();
        }
    }
}
