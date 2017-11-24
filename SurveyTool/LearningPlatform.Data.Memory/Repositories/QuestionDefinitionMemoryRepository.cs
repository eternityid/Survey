using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using System;
using System.Collections.Generic;

namespace LearningPlatform.Data.Memory.Repositories
{
    public class QuestionDefinitionMemoryRepository: IQuestionDefinitionRepository
    {
        public List<QuestionDefinition> GetBySurveyId(string surveyId)
        {
            throw new NotImplementedException();
        }

        public List<QuestionDefinition> GetAllQuestionsInPage(string surveyId, string pageId)
        {
            throw new NotImplementedException();
        }

        public QuestionDefinition GetById(string questionId)
        {
            throw new NotImplementedException();
        }

        public ICollection<QuestionAlias> GetQuestionAliases(string surveyId, string questionAlias)
        {
            throw new NotImplementedException();
        }

        public QuestionDefinition Add(QuestionDefinition questionDefinition)
        {
            throw new NotImplementedException();
        }

        public void AddMany(IList<QuestionDefinition> question)
        {
            throw new NotImplementedException();
        }

        public void Update(QuestionDefinition questionDefinition)
        {
            //Don't need to do anything
        }

        public void Delete(string questionId)
        {
            throw new NotImplementedException();
        }

        public List<QuestionDefinition> GetByIds(IList<string> questionIds)
        {
            throw new NotImplementedException();
        }

        public void DeleteMany(IList<QuestionDefinition> questions)
        {
            throw new NotImplementedException();
        }
    }
}
