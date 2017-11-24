using System;
using System.Collections.Generic;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.FlowLogic;
using LearningPlatform.Domain.SurveyDesign.Pages;

namespace LearningPlatform.Domain.SurveyExecution
{
    public class ProgressState
    {
        private readonly Dictionary<string, float> _costs = new Dictionary<string, float>();
        private readonly Dictionary<string, float> _progress = new Dictionary<string, float>();

        public float SurveyCost { get; private set; }

        private class CurrentState
        {
            public CurrentState()
            {
                Weight = 1;
            }
            public float Total { get; set; }
            public float Weight { get; set; }
        }


        public ProgressState(Survey survey)
        {
            Calculate(survey);
        }

        public float GetCost(string id)
        {
            return _costs[id];
        }

        public float GetProgress(string id)
        {
            float progress;
            _progress.TryGetValue(id, out progress);
            return progress;
        }

        public void Calculate(Survey survey)
        {
            PreCalculate(survey);
            var state = new CurrentState();
            CalculateFolder(survey.TopFolder, state);
            SurveyCost = state.Total;
        }

        private void PreCalculate(Survey survey)
        {
            // We need to calculate initially all folders to get right totals for GoToFolder
            var state = new CurrentState();
            CalculateFolder(survey.TopFolder, state);
        }


        private float CalculateFolder(Folder folder, CurrentState state)
        {
            float folderCost=0;
            foreach (Node child in folder.ChildNodes)
            {
                var page = child as PageDefinition;
                if (page != null)
                {
                    folderCost += CalculatePage(page, state);
                    continue;
                }
                if (HandleSpecialNodes(state, child, ref folderCost)) continue;

                var childFolder = child as Folder;
                if (childFolder != null)
                {
                    folderCost += CalculateFolder(childFolder, state);
                }

            }

            var loop = folder.Loop;
            if (loop == null)
            {
                _progress[folder.Id] = state.Total;
                _costs[folder.Id] = folderCost;
                return folderCost;
            }

            return CalculateLoop(folderCost, folder, state);
        }

        private float CalculateLoop(float folderCost, Folder folder, CurrentState state)
        {
            var loop = folder.Loop;
            //TODO: For weight: Also add support for a fixed number of iterations instead of option count (some loops will have many options but filter them).
            var weight = loop.OptionList.Options.Count;
            var loopCost = folderCost*weight;
            _progress[folder.Id] = state.Total;
            _costs[folder.Id] = loopCost;
            var additionalCost = folderCost * (weight - 1); //We have already added one iteration to the total in the CalculateFolder method.
            state.Total += additionalCost;
            return loopCost;
        }


        private bool HandleSpecialNodes(CurrentState state, Node child, ref float folderCost)
        {
            var condition = child as Condition;
            if (condition != null)
            {
                folderCost += CalculateCondition(condition, state);
                return true;
            }
            var goToFolder = child as GoToFolder;
            if (goToFolder != null)
            {
                folderCost += CalculateGoToFolder(goToFolder, state);
                return true;
            }
            return false;
        }

        private float CalculateCondition(Condition condition, CurrentState state)
        {
            
            float trueFolderCost=0, falseFolderCost=0;

            var trueTempState = new CurrentState { Total = state.Total };
            var falseTempState = new CurrentState { Total = state.Total };

            if (condition.TrueFolder!=null &&
                condition.FalseFolder!=null &&
                _costs.TryGetValue(condition.TrueFolder.Id, out trueFolderCost) &&
                _costs.TryGetValue(condition.FalseFolder.Id, out falseFolderCost))
            {
                if (trueFolderCost < falseFolderCost)
                {
                    trueTempState.Weight = falseFolderCost / trueFolderCost;
                }
                else if (trueFolderCost > falseFolderCost)
                {
                    falseTempState.Weight = trueFolderCost / falseFolderCost;
                }
            }

            var trueFolder = condition.TrueFolder;
            if (trueFolder != null) trueFolderCost = CalculateFolder(trueFolder, trueTempState);

            var falseFolder = condition.FalseFolder;
            if (falseFolder != null) falseFolderCost = CalculateFolder(falseFolder, falseTempState);

            var conditionCost = Math.Max(trueFolderCost, falseFolderCost);
            _progress[condition.Id] = state.Total;
            _costs[condition.Id] = conditionCost;
            state.Total += conditionCost;
            return conditionCost;
        }

        private float CalculatePage(PageDefinition pageDefinition, CurrentState state)
        {
            _progress[pageDefinition.Id] = state.Total;
            float pageCost = pageDefinition.QuestionDefinitions.Count;
            if(pageDefinition.NavigationButtonSettings==NavigationButtonSettings.None)
            {
                //Thank you page should have no cost
                pageCost = 0;
            }
            pageCost = pageCost*state.Weight;
            state.Total += pageCost;
            _costs[pageDefinition.Id] = pageCost;
            return pageCost;
        }


        private float CalculateGoToFolder(GoToFolder goToFolder, CurrentState state)
        {
            float cost;
            if (_costs.TryGetValue(goToFolder.GoToFolderNode.Id, out cost))
            {
                _progress[goToFolder.Id] = state.Total;
                _costs[goToFolder.Id] = cost;
                state.Total += cost;
            }
            return cost;
        }
    }
}