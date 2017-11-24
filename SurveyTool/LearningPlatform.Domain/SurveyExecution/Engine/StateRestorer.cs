using System;
using System.Collections.Generic;
using LearningPlatform.Domain.SurveyExecution.Request;
using LearningPlatform.Domain.SurveyExecution.ResponseRows;

namespace LearningPlatform.Domain.SurveyExecution.Engine
{
    public class StateRestorer : IDisposable
    {
        private readonly RequestState _requestState;
        private readonly string[] _surveyPoints;
        private readonly List<string> _questionIdsToClean;
        private readonly string _loopPosition;
        private readonly string _redirectUrl;
        private readonly string _pageId;

        public StateRestorer(RequestState requestState)
        {
            _requestState = requestState;
            if (_requestState.LoopState != null)
            {
                _loopPosition = requestState.LoopState.Value;
            }
            _surveyPoints = requestState.GotoStack.Items.ToArray();
            _questionIdsToClean = new List<string>(requestState.QuestionAliasesToClean);
            _redirectUrl = requestState.RedirectUrl;
            _pageId = requestState.PageId;
        }

        public void Dispose()
        {
            _requestState.GotoStack.Items.Clear();
            foreach (string point in _surveyPoints)
            {
                _requestState.GotoStack.Items.Push(point);
            }

            _requestState.QuestionAliasesToClean.Clear();
            _requestState.QuestionAliasesToClean.AddRange(_questionIdsToClean);
            if (_loopPosition!=null)
            {
                _requestState.LoopState = LoopState.Create(_loopPosition);
            }
            _requestState.RedirectUrl = _redirectUrl;
            _requestState.PageId = _pageId;
        }
    }
}