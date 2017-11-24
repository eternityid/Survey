using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace LearningPlatform.Data.MongoDb.Repositories
{
    public class OptionListRepository : RepositoryBase, IOptionListRepository
    {
        public OptionListRepository(IRequestObjectProvider<MongoDbContext> mongoDbContextProvider) : base(mongoDbContextProvider)
        {
        }

        private IMongoCollection<OptionList> OptionListCollection => DbContext.OptionListCollection;

        public OptionList GetById(string id)
        {
            return OptionListCollection.FindSync(o => o.Id == id).FirstOrDefault();
        }

        public List<OptionList> GetBySurveyId(string surveyId)
        {
            return OptionListCollection.FindSync(o => o.SurveyId == surveyId).ToList();
        }

        public void Add(OptionList optionList)
        {
            OptionListCollection.InsertOne(optionList);
        }

        public void AddMany(IList<OptionList> optionLists)
        {
            if (optionLists != null && optionLists.Any())
            {
                OptionListCollection.InsertMany(optionLists);
            }
        }

        public void Update(OptionList optionList)
        {
            OptionListCollection.ReplaceOne(s => s.Id == optionList.Id,
            optionList, new UpdateOptions { IsUpsert = true });
        }

        public void Delete(string optionListId)
        {
            OptionListCollection.DeleteOne(d => d.Id == optionListId);
        }

        public void DeleteMany(IEnumerable<string> optionListIds)
        {
            OptionListCollection.DeleteMany(d => optionListIds.Contains(d.Id));
        }

        public void DeleteMany(IList<OptionList> optionLists)
        {
            var optionListIds = optionLists.Select(p => p.Id);
            OptionListCollection.DeleteMany(p => optionListIds.Contains(p.Id));
        }

        public void DeleteOptionGroup(string optionListId, string optionGroupId)
        {
            throw new NotImplementedException();
        }

        public List<OptionList> Find(Expression<Func<OptionList, bool>> predicate)
        {
            return OptionListCollection.FindSync(predicate).ToList();
        }

        public List<OptionList> GetByIds(IList<string> optionListIds)
        {
            return OptionListCollection.FindSync(p => optionListIds.Contains(p.Id)).ToList();
        }
    }
}
