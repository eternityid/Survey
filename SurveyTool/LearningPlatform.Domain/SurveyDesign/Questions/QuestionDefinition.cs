using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign.Expressions;
using LearningPlatform.Domain.SurveyDesign.LanguageStrings;
using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.Validation;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyDesign.Questions
{
    public abstract class QuestionDefinition : IPosition, IVersionable
    {
        protected QuestionDefinition()
        {
            Validations = new List<QuestionValidation>();
        }

        public string Id { get; set; }
        public string PageDefinitionId { get; set; }
        public string Alias { get; set; }
        public LanguageString Title { get; set; }
        public LanguageString Description { get; set; }
        public string SurveyId { get; set; }
        public string LibraryId { get; set; }

        [JsonIgnore, Obsolete]
        public int Position { get; set; }

        public string QuestionMask { get; set; }
        public Expression QuestionMaskExpression { get; set; }


        [JsonIgnore]
        public PageDefinition PageDefinition { get; set; }
        public List<QuestionValidation> Validations { get; set; }

        public bool IsFixedPosition { get; set; }
        public bool IsAlwaysHidden { get; set; }
        public byte[] RowVersion { get; set; }
        public short? RandomDataSelectionProbability { get; set; }

        public string Version { get; set; }

        [JsonIgnore]
        public abstract string Type { get; }
    }
}