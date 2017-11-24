using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using System;

namespace LearningPlatform.Domain.SurveyDesign.Services.Question
{
    public class MoveQuestionService
    {
        private readonly INodeRepository _nodeRepository;
        public MoveQuestionService(INodeRepository nodeRepository)
        {
            _nodeRepository = nodeRepository;
        }

        public void MoveQuestionInPage(PageDefinition page,string questionId, int newIndexPosition)
        {
            page.QuestionIds.Remove(questionId);
            page.QuestionIds.Insert(newIndexPosition, questionId);
            page.Version = Guid.NewGuid().ToString();
            _nodeRepository.Update(page);
        }

        public void MoveQuestionToOtherPage(PageDefinition sourcePage, PageDefinition destinationPage, string questionId, int newIndexPosition)
        {
            sourcePage.QuestionIds.Remove(questionId);
            sourcePage.Version = Guid.NewGuid().ToString();
            _nodeRepository.Update(sourcePage);

            destinationPage.QuestionIds.Insert(newIndexPosition, questionId);
            destinationPage.Version = Guid.NewGuid().ToString();
            _nodeRepository.Update(destinationPage);
        }
    }
}
