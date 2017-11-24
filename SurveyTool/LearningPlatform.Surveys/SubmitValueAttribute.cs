using System.Reflection;
using System.Web.Mvc;

namespace LearningPlatform
{
    public class SubmitValueAttribute : ActionNameSelectorAttribute
    {
        private readonly string _name;

        public SubmitValueAttribute(string name)
        {
            _name = name;
        }

        public override bool IsValidName(ControllerContext controllerContext, string actionName, MethodInfo methodInfo)
        {
            return controllerContext.Controller.ValueProvider.GetValue(_name) != null;
        }
    }
}