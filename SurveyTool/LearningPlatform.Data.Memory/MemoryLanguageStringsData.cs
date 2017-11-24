using System.Linq;
using Autofac;
using LearningPlatform.Data.Memory.Repositories;
using LearningPlatform.Domain.Constants;
using LearningPlatform.Domain.Resources;

namespace LearningPlatform.Data.Memory
{
    public class MemoryLanguageStringsData
    {
        private readonly IResourceStringRepository _repository;
        private readonly IComponentContext _componentContext;

        public MemoryLanguageStringsData(IResourceStringRepository repository, IComponentContext componentContext)
        {
            _repository = repository;
            _componentContext = componentContext;
        }

        public void InsertData()
        {
            string language = "en";

            AddOrUpdate(ValidationConstants.QuestionRequired,
                new[] { new ResourceStringItem { Text = @"Question ""{0}"" is required", Language = "en" } });
            AddOrUpdate(ValidationConstants.InvitationOnly,
                new[] { new ResourceStringItem { Text = @"This survey is not available.", Language = "en" } });
            AddOrUpdate(ValidationConstants.SurveyNotOpen,
                new[] { new ResourceStringItem { Text = @"This survey is not opened.", Language = "en" } });
            AddOrUpdate(ValidationConstants.DeletedSurvey,
               new[] { new ResourceStringItem { Text = @"The survey no longer exists.", Language = "en" } });
            AddOrUpdate(ValidationConstants.ExclusiveViolation,
                new[] { new ResourceStringItem { Text = @"Question ""{0}"" is invalid. Please select only one option when option ""{1}"" is selected.", Language = "en" } });

            AddOrUpdate("NextButton", new[] { new ResourceStringItem { Text = @"Next", Language = "en" } });
            AddOrUpdate("PreviousButton", new[] { new ResourceStringItem { Text = @"Previous", Language = "en" } });
            AddOrUpdate("FinishButton", new[] { new ResourceStringItem { Text = @"Finish", Language = "en" } });

            InsertSelectionValidatorData(language);
            InsertLengthValidatorData(language);
            InsertWordsAmountValidatorData(language);
            InsertRangeNumberValidatorData(language);
        }

        private void InsertRangeNumberValidatorData(string language)
        {
            AddOrUpdate(ValidationConstants.QuestionNumberMinMax,
                new[] { new ResourceStringItem { Language = language, Text = @"Question ""{0}"" is invalid. Please input at least {1} and no more than {2} value." } });
        }

        private void InsertSelectionValidatorData(string language)
        {
            AddOrUpdate(ValidationConstants.QuestionSelectionMinMax,
                new[] { new ResourceStringItem { Language = language, Text = @"Question ""{0}"" is invalid. Please select at least {1} and no more than {2} options." } } );

            AddOrUpdate(ValidationConstants.QuestionSelectionMin,
                new[] { new ResourceStringItem { Language = language, Text = @"Question ""{0}"" is invalid. Please select at least {1} options." } } );

            AddOrUpdate(ValidationConstants.QuestionSelectionMax,
                new[] { new ResourceStringItem { Language = language, Text = @"Question ""{0}"" is invalid. Please select no more than {1} options." } });
        }
        private void InsertLengthValidatorData(string language)
        {
            AddOrUpdate(ValidationConstants.QuestionLengthMinMax,
                new[] { new ResourceStringItem { Language = language, Text = @"Question ""{0}"" is invalid. Please enter at least {1} characters and no more than {2} characters in your answer." } });

            AddOrUpdate(ValidationConstants.QuestionLengthMin,
                new[] { new ResourceStringItem { Language = language, Text = @"Question ""{0}"" is invalid. Please enter at least {1} characters in your answer." } });

            AddOrUpdate(ValidationConstants.QuestionLengthMax,
                new[] { new ResourceStringItem { Language = language, Text = @"Question ""{0}"" is invalid. Please enter no more than {1} characters in your answer." } });
        }

        private void InsertWordsAmountValidatorData(string language)
        {
            AddOrUpdate(
                ValidationConstants.QuestionWordsAmountMinMax,
                new[] { new ResourceStringItem { Language = language, Text = @"Question ""{0}"" is invalid. Please enter at least {1} words  and no more than {2} words  in your answer." } });

            AddOrUpdate(
                ValidationConstants.QuestionWordsAmountMin,
                new[] { new ResourceStringItem { Language = language, Text = @"Question ""{0}"" is invalid. Please enter at least {1} words in your answer." } });

            AddOrUpdate(
                ValidationConstants.QuestionWordsAmountMax,
                new[] { new ResourceStringItem { Language = language, Text = @"Question ""{0}"" is invalid. Please enter no more than {1} words  in your answer." } });
        }

        private void AddOrUpdate(string resourceName, ResourceStringItem[] resourceStringItems)
        {
            var ret = _componentContext.Resolve<ResourceString>();
            ret.Name = resourceName;
            ret.Items = resourceStringItems.ToList();
            ((ResourceStringMemoryRepository)_repository).Add(ret);
        }
    }
}