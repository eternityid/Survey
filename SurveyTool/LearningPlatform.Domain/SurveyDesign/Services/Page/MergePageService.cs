using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using System;
using System.Linq;

namespace LearningPlatform.Domain.SurveyDesign.Services.Page
{
    public class MergePageService
    {
        private readonly INodeRepository _nodeRepository;
        private readonly IQuestionDefinitionRepository _questionDefinitionRepository;

        public MergePageService(INodeRepository nodeRepository, IQuestionDefinitionRepository questionDefinitionRepository)
        {
            _nodeRepository = nodeRepository;
            _questionDefinitionRepository = questionDefinitionRepository;
        }

        public void Merge(Folder folder, PageDefinition firstPage, PageDefinition secondPage)
        {
            MergeConditionalDisplays(firstPage, secondPage);
            MergeSkipCommands(firstPage, secondPage);
            MergeQuestions(firstPage, secondPage);
            firstPage.Version = Guid.NewGuid().ToString();
            _nodeRepository.Update(firstPage);

            _nodeRepository.Delete(secondPage);

            folder.ChildIds.Remove(secondPage.Id);
            folder.Version = Guid.NewGuid().ToString();
            _nodeRepository.Update(folder);
        }

        private void MergeConditionalDisplays(PageDefinition firstPage, PageDefinition secondPage)
        {
            foreach (var question in secondPage.QuestionDefinitions)
            {
                if (question.QuestionMaskExpression?.ExpressionItems == null)
                {
                    continue;
                }
                if (question.QuestionMaskExpression.ExpressionItems.Any(p => firstPage.QuestionIds.Contains(p.QuestionId)))
                {
                    question.QuestionMaskExpression = null;
                    _questionDefinitionRepository.Update(question);
                }
            }
        }

        private void MergeSkipCommands(PageDefinition firstPage, PageDefinition secondPage)
        {
            firstPage.SkipCommands.RemoveAll(p => secondPage.QuestionIds.Contains(p.SkipToQuestionId));
            firstPage.SkipCommands = firstPage.SkipCommands.Concat(secondPage.SkipCommands).ToList();
            foreach (var skipCommand in firstPage.SkipCommands)
            {
                skipCommand.PageDefinitionId = firstPage.Id;
            }
        }

        private void MergeQuestions(PageDefinition firstPage, PageDefinition secondPage)
        {
            firstPage.QuestionDefinitions =
                firstPage.QuestionDefinitions.Concat(secondPage.QuestionDefinitions).ToList();
            firstPage.QuestionIds = firstPage.QuestionDefinitions.Select(p => p.Id).ToList();
        }
    }
}
