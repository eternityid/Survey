using System.Collections.Generic;
using LearningPlatform.Domain.SurveyDesign.Pages;

namespace LearningPlatform.Domain.SurveyExecution.Engine
{
    public interface IPageExecutor
    {
        PageDefinition GotoFirstPage();
        PageDefinition GotoLastPage();
        PageDefinition MoveToNextPage(string pageId);
        PageDefinition MoveToPreviousPage(string pageId);
        PageDefinition PeekNext(string pageId);
        PageDefinition PeekPrevious(string pageId);
        ICollection<string> GetQuestionsBetweenPages(string fromPageId, string toPageId);

    }
}