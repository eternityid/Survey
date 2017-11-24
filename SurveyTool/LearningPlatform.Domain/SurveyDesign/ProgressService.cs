using LearningPlatform.Domain.SurveyExecution.Engine;
using LearningPlatform.Domain.SurveyExecution.Request;
using LearningPlatform.Domain.SurveyExecution.ResponseRows;

namespace LearningPlatform.Domain.SurveyDesign
{
    public class ProgressService
    {
        private readonly IRequestContext _requestContext;
        private readonly LoopService _loopService;

        public ProgressService(IRequestContext requestContext, LoopService loopService)
        {
            _requestContext = requestContext;
            _loopService = loopService;
        }

        public int GetProgress(string pageDefinitionId)
        {

            var progressState = _requestContext.NodeService.ProgressState;
            float relativeCost = 0;

            foreach (LoopStateItem loopItem in _loopService.GetLoopState().Items)
            {
                var folder = _loopService.GetFolderWithLoop(loopItem.LoopAlias);
                var aliases = _loopService.GetMaskedAliases(folder.Loop);

                var loopCost = progressState.GetCost(folder.Id);
                relativeCost += (float) aliases.IndexOf(loopItem.OptionAlias)/aliases.Count*loopCost;
            }

            if (progressState.SurveyCost <= 0) return 100;
            return (int) ((progressState.GetProgress(pageDefinitionId)+relativeCost)/progressState.SurveyCost*100);
        }
    }
}