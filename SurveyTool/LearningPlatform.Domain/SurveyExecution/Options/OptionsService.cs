using System;
using System.Collections.Generic;
using System.Linq;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using LearningPlatform.Domain.SurveyExecution.Request;
using LearningPlatform.Domain.SurveyExecution.Scripting;
using Microsoft.ClearScript;

namespace LearningPlatform.Domain.SurveyExecution.Options
{
    public class OptionsService
    {
        private readonly IScriptExecutor _scriptExecutor;
        private readonly IRequestContext _requestContext;
        private readonly OptionGroupService _optionGroupService;
        private readonly MapperService _mapper;

        public OptionsService(IScriptExecutor scriptExecutor, IRequestContext requestContext, OptionGroupService optionGroupService, MapperService mapper)
        {
            _scriptExecutor = scriptExecutor;
            _requestContext = requestContext;
            _optionGroupService = optionGroupService;
            _mapper = mapper;
        }

        public IList<Option> GetMaskedOptions(IHasOptions definition)
        {
            var expandedOptions = GetExpandedOptions(definition.GetOptions());
            var orderedList = _optionGroupService.HandleOrdering(definition, expandedOptions);
            var maskedList = MaskList(orderedList, definition.OptionsMask);
            var options = _mapper.Map<List<SurveyDesign.Questions.Options.Option>, List<Option>>(maskedList);
            _optionGroupService.AssignOptionGroups(options, maskedList, definition);
            return options;
        }


        private List<SurveyDesign.Questions.Options.Option> GetExpandedOptions(IEnumerable<SurveyDesign.Questions.Options.Option> options)
        {
            var expandedOptions = new List<SurveyDesign.Questions.Options.Option>();
            foreach (var option in options)
            {
                var listId = GetListId(option);
                if (listId!=null)
                {
					OptionList optionList = _requestContext.NodeService.GetOptionList(listId);
                    var carryOverOptions = GetExpandedOptions(MaskList(optionList.Options, option.OptionsMask));
                    //TODO not sure, need to ask Mr.Oyvind about this change
                    carryOverOptions.ToList().ForEach(o => o.GroupAlias = option.GroupAlias);
                    expandedOptions.AddRange(carryOverOptions);
                }
                else
                {
                    expandedOptions.Add(option);
                }
            }
            return expandedOptions;
        }

        private string GetListId(SurveyDesign.Questions.Options.Option option)
        {
            if (option.ReferenceListId!=null)
            {
                return option.ReferenceListId;
            }
            if (option.OptionsMask.QuestionId!=null)
            {
                var questionDefinitionWithOptions =
                    _requestContext.NodeService.GetQuestionDefinitionById(option.OptionsMask.QuestionId)
                        as QuestionWithOptionsDefinition;
                if (questionDefinitionWithOptions != null)
                {
                    return questionDefinitionWithOptions.OptionList.Id;
                }
            }
            return null;
        }

        private string GetMaskScript(OptionsMask optionsMask)
        {
            if (optionsMask.OptionsMaskType == OptionsMaskType.Custom)
            {
                return optionsMask.CustomOptionsMask;
            }
            if (!string.IsNullOrEmpty(optionsMask.QuestionId))
            {
                var alias =
                    _requestContext.NodeService.GetQuestionDefinitionById(optionsMask.QuestionId).Alias;

                if (optionsMask.OptionsMaskType == OptionsMaskType.OptionsSelected)
                {
                    return string.Format("questions.{0}.optionsSelected", alias);
                }
                if (optionsMask.OptionsMaskType == OptionsMaskType.OptionsNotSelected)
                {
                    return string.Format("questions.{0}.optionsNotSelected", alias);
                }
                if (optionsMask.OptionsMaskType == OptionsMaskType.OptionsShown)
                {
                    return string.Format("questions.{0}.optionsShown", alias);
                }
                if (optionsMask.OptionsMaskType == OptionsMaskType.OptionsNotShown)
                {
                    return string.Format("questions.{0}.optionsNotShown", alias);
                }
            }
            return "";
        }


        private List<SurveyDesign.Questions.Options.Option> MaskList(IEnumerable<SurveyDesign.Questions.Options.Option> orderedList, OptionsMask optionsMask)
        {
            var mask = EvaluateMask(optionsMask);
            return orderedList.Where(o => mask == null || mask.Contains(o.Alias)).ToList();
        }


        private List<string> EvaluateMask(OptionsMask optionsMask)
        {
            List<string> mask = null;
            var maskScript = GetMaskScript(optionsMask);
            if (!String.IsNullOrEmpty(maskScript))
            {
                var maskItems = _scriptExecutor.EvaluateCode<object>(maskScript);
                mask = ConvertMask(maskItems);
            }
            return mask;
        }

        private static List<string> ConvertMask(object maskItems)
        {
            var propertyBag = maskItems as PropertyBag;
            return propertyBag != null ? propertyBag.ToStringList() : StringListConverter.ToStringList(maskItems);
        }

    }
}