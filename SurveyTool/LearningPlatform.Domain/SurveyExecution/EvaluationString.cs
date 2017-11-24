using LearningPlatform.Domain.SurveyExecution.Scripting;

namespace LearningPlatform.Domain.SurveyExecution
{
    public class EvaluationString
    {
        private readonly IScriptExecutor _scriptExecutor;

        public EvaluationString(IScriptExecutor scriptExecutor)
        {
            _scriptExecutor = scriptExecutor;
        }

        public string Value { get; set; }

        private string _value;

        public override string ToString()
        {
            if (_value != null) return _value;
            //TODO: Inject instead
            _value = _scriptExecutor.EvaluateString(Value);
            return _value;
        }
    }
}