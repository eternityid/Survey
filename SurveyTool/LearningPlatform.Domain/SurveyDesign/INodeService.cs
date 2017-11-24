using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using LearningPlatform.Domain.SurveyExecution;

namespace LearningPlatform.Domain.SurveyDesign
{
    public interface INodeService
    {
        Folder GetParentFolder(Node node);
        PageDefinition GetPageDefinition(string id);
        string GetPageIdContainQuestionId(string id);
        QuestionDefinition GetQuestionDefinitionByAlias(string alias);
        QuestionDefinition GetQuestionDefinitionById(string id);
        Folder GetFolderWithLoop(string alias);
        Node GetNode(string id);
        Folder TopFolder { get; }
        OptionList GetOptionList(string id);
        Option GetOption(string optionId);
        Option GetOptionByAlias(string alias);
        ProgressState ProgressState { get; }
    }
}