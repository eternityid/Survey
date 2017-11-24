using AutoMapper;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Resources;
using LearningPlatform.Domain.SurveyDesign.LanguageStrings;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.Validation;
using LearningPlatform.Domain.SurveyExecution;
using LearningPlatform.Domain.SurveyExecution.Questions;
using LearningPlatform.Domain.SurveyExecution.Validators;
using Option = LearningPlatform.Domain.SurveyDesign.Questions.Options.Option;

namespace LearningPlatform.Domain.Mappings
{
    public class DomainAutoMapperProfile : Profile
    {
        public DomainAutoMapperProfile()
        {
            // QuestionDefinition and sub classes
            CreateMap<QuestionDefinition, Question>()
                .ForMember(d => d.DescriptionEvaulationString, opt => opt.MapFrom(s => s.Description))
                .ForMember(d => d.TitleEvaluationString, opt => opt.MapFrom(s => s.Title))
                .ForMember(d => d.Validators, opt => opt.MapFrom(s => s.Validations))
                .ForMember(d => d.Type, opt => opt.MapFrom(s => s.Type));
            CreateMap<DateQuestionDefinition, DateQuestion>()
                .IncludeBase<QuestionDefinition, Question>();
            CreateMap<NumericQuestionDefinition, NumericQuestion>()
                .IncludeBase<QuestionDefinition, Question>();
            CreateMap<OpenEndedTextQuestionDefinition, OpenEndedTextQuestion>()
                .IncludeBase<QuestionDefinition, Question>();
            CreateMap<InformationDefinition, Information>()
                .IncludeBase<QuestionDefinition, Question>();
            CreateMap<LanguageSelectionQuestionDefinition, LanguageSelectionQuestion>()
                .IncludeBase<QuestionDefinition, Question>()
                .AfterMap(AfterLanguageSelectionQuestionMap);

            CreateMap<OpenEndedShortTextQuestionDefinition, OpenEndedShortTextQuestion>()
                .IncludeBase<OpenEndedTextQuestionDefinition, OpenEndedTextQuestion>();
            CreateMap<OpenEndedLongTextQuestionDefinition, OpenEndedLongTextQuestion>()
                .IncludeBase<OpenEndedTextQuestionDefinition, OpenEndedTextQuestion>();

            // QuestionWithOptionsDefinition and sub classes
            CreateMap<QuestionWithOptionsDefinition, QuestionWithOptions>()
                .IncludeBase<QuestionDefinition, Question>();
            CreateMap<RatingQuestionDefinition, RatingQuestion>()
                .IncludeBase<QuestionWithOptionsDefinition, QuestionWithOptions>()
                .AfterMap(AfterQuestionWithOptionsMap);
            CreateMap<MatrixQuestionDefinition, MatrixQuestion>()
                .IncludeBase<QuestionWithOptionsDefinition, QuestionWithOptions>()
                .ForMember(d => d.Questions, opt => opt.MapFrom(s => s.QuestionDefinitions))
                .AfterMap(AfterQuestionWithOptionsMap);

            //SingleSelectionQuestionDefinition and sub classes
            CreateMap<SingleSelectionQuestionDefinition, SingleSelectionQuestion>()
                .IncludeBase<QuestionWithOptionsDefinition, QuestionWithOptions>()
                .AfterMap(AfterQuestionWithOptionsMap);
            CreateMap<ScaleQuestionDefinition, ScaleQuestion>()
                .IncludeBase<SingleSelectionQuestionDefinition, SingleSelectionQuestion>();
            CreateMap<NetPromoterScoreQuestionDefinition, NetPromoterScoreQuestion>()
                .IncludeBase<SingleSelectionQuestionDefinition, SingleSelectionQuestion>();
            CreateMap<PictureSingleSelectionQuestionDefinition, PictureSingleSelectionQuestion>()
                .IncludeBase<SingleSelectionQuestionDefinition, SingleSelectionQuestion>()
                .ForMember(qe => qe.PictureFolderId, q => q.MapFrom(s => s.Id));

            //MultipleSelectionQuestionDefinition and sub classes
            CreateMap<MultipleSelectionQuestionDefinition, MultipleSelectionQuestion>()
                .IncludeBase<QuestionWithOptionsDefinition, QuestionWithOptions>()
                .AfterMap(AfterQuestionWithOptionsMap);
            CreateMap<PictureMultipleSelectionQuestionDefinition, PictureMultipleSelectionQuestion>()
                .IncludeBase<MultipleSelectionQuestionDefinition, MultipleSelectionQuestion>()
                .ForMember(qe => qe.PictureFolderId, q => q.MapFrom(s => s.Id));

            //GridQuestionDefinition and sub classes
            CreateMap<GridQuestionDefinition, GridQuestion>()
                .IncludeBase<QuestionWithOptionsDefinition, QuestionWithOptions>();
            CreateMap<SingleSelectionGridQuestionDefinition, SingleSelectionGridQuestion>()
                .IncludeBase<GridQuestionDefinition, GridQuestion>()
                .AfterMap(AfterGridQuestionMap);
            CreateMap<MultipleSelectionGridQuestionDefinition, MultipleSelectionGridQuestion>()
                .IncludeBase<GridQuestionDefinition, GridQuestion>()
                .AfterMap(AfterGridQuestionMap);
            CreateMap<ScaleGridQuestionDefinition, ScaleGridQuestion>()
                .IncludeBase<GridQuestionDefinition, GridQuestion>()
                .AfterMap(AfterGridQuestionMap);
            CreateMap<RatingGridQuestionDefinition, RatingGridQuestion>()
                .IncludeBase<GridQuestionDefinition, GridQuestion>()
                .AfterMap(AfterGridQuestionMap);
            CreateMap<ShortTextListQuestionDefinition, ShortTextListQuestion>()
                .IncludeBase<GridQuestionDefinition, GridQuestion>()
                .AfterMap(AfterGridQuestionMap);
            CreateMap<LongTextListQuestionDefinition, LongTextListQuestion>()
                .IncludeBase<GridQuestionDefinition, GridQuestion>()
                .AfterMap(AfterGridQuestionMap);

            // QuestionValidation and sub classes
            CreateMap<QuestionValidation, QuestionValidator>();
            CreateMap<RegularExpressionValidation, RegularExpressionValidator>().ConstructUsingServiceLocator()
                .IncludeBase<QuestionValidation, QuestionValidator>();
            CreateMap<RequiredValidation, RequiredValidator>().ConstructUsingServiceLocator()
                .IncludeBase<QuestionValidation, QuestionValidator>();
            CreateMap<LengthValidation, LengthValidator>().ConstructUsingServiceLocator()
                .IncludeBase<QuestionValidation, QuestionValidator>();
            CreateMap<WordsAmountValidation, WordsAmountValidator>().ConstructUsingServiceLocator()
                .IncludeBase<QuestionValidation, QuestionValidator>();
            CreateMap<SelectionValidation, SelectionValidator>().ConstructUsingServiceLocator()
                .IncludeBase<QuestionValidation, QuestionValidator>();
            CreateMap<RangeNumberValidation, RangeNumberValidator>().ConstructUsingServiceLocator()
                .IncludeBase<QuestionValidation, QuestionValidator>();
            CreateMap<DecimalPlacesNumberValidation, DecimalPlacesNumberValidator>().ConstructUsingServiceLocator()
                .IncludeBase<QuestionValidation, QuestionValidator>();

            // Other mappings
            CreateMap<Option, SurveyExecution.Options.Option>()
                .ForMember(d => d.TextEvaluationString, opt => opt.MapFrom(s => s.Text))
                .ForMember(d => d.OtherQuestion, opt => opt.MapFrom(s => s.OtherQuestionDefinition));
            CreateMap<LanguageString, EvaluationString>().ConstructUsing(CreateEvaluationString);
            CreateMap<ResourceString, EvaluationString>().ConstructUsing(CreateEvaluationString);
        }

        private void AfterQuestionWithOptionsMap(QuestionWithOptionsDefinition definition, QuestionWithOptions question, ResolutionContext resolutionContext)
        {
            Resolve<QuestionMapperService>(resolutionContext).MapQuestion(question, definition);
        }

        private void AfterGridQuestionMap(GridQuestionDefinition definition, GridQuestion gridQuestion, ResolutionContext resolutionContext)
        {
            Resolve<QuestionMapperService>(resolutionContext).MapGridQuestion(gridQuestion, definition);
        }

        private void AfterLanguageSelectionQuestionMap(LanguageSelectionQuestionDefinition definition, LanguageSelectionQuestion question, ResolutionContext resolutionContext)
        {
            Resolve<QuestionMapperService>(resolutionContext).MapLanguageSelectionQuestion(question, definition);
        }

        private EvaluationString CreateEvaluationString(ILanguageString value, ResolutionContext resolutionContext)
        {
            return Resolve<LanguageService>(resolutionContext).CreateEvaluationString(value);
        }

        private static T Resolve<T>(ResolutionContext resolutionContext)
        {
            return (T)resolutionContext.Options.ServiceCtor(typeof(T));
        }

    }
}