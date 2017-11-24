using Autofac;

namespace LearningPlatform.Specs
{
    public class ServiceLocator
    {
        public static IComponentContext Value { get; set; }

        public static T Resolve<T>()
        {
            return Value.Resolve<T>();
        }
    }
}