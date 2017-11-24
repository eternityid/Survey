using System.Collections.Generic;
using System.Linq;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.FlowLogic;
using LearningPlatform.Domain.SurveyExecution.Options;
using LearningPlatform.Domain.SurveyExecution.Request;
using LearningPlatform.Domain.SurveyExecution.ResponseRows;

namespace LearningPlatform.Domain.SurveyExecution.Engine
{
    public class LoopService
    {
        private readonly IRequestContext _requestContext;
        private readonly OptionsService _optionsService;

        public LoopService(IRequestContext requestContext, OptionsService optionsService)
        {
            _requestContext = requestContext;
            _optionsService = optionsService;
        }

        public LoopState GetLoopState()
        {
            return _requestContext.State.LoopState;
        }

        public IList<string> GetMaskedAliases(LoopDefinition loopDefinition)
        {
            return GetMaskedOptions(loopDefinition).Select(p => p.Alias).ToList();
        }

        public IList<Option> GetMaskedOptions(LoopDefinition loopDefinition)
        {
            return _optionsService.GetMaskedOptions(loopDefinition);
        }

        public Folder GetFolderWithLoop(string alias)
        {
            return _requestContext.NodeService.GetFolderWithLoop(alias);
        }


        public Option GetLoopOption(string alias)
        {
            var loop = GetFolderWithLoop(alias).Loop;
            var loopState = GetLoopState();
            return GetMaskedOptions(loop).First(p => p.Alias == loopState.GetCurrentItem(alias).OptionAlias);
        }
    }
}