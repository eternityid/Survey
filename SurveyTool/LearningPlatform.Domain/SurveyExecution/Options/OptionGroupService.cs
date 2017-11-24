using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign.LanguageStrings;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using LearningPlatform.Domain.SurveyExecution.Request;

namespace LearningPlatform.Domain.SurveyExecution.Options
{
    public class OptionGroupService
    {
        private readonly IRequestContext _requestContext;
        private readonly LanguageService _languageService;
        private readonly MapperService _mapper;

        public OptionGroupService(IRequestContext requestContext, LanguageService languageService, MapperService mapper)
        {
            _requestContext = requestContext;
            _languageService = languageService;
            _mapper = mapper;
        }

        public IList<SurveyDesign.Questions.Options.Option> HandleOrdering(IHasOptions definition, List<SurveyDesign.Questions.Options.Option> options)
        {
            var seed = GetSeed(definition.Seed);
            var groupOrder = GetOrderTypes(definition);
            Dictionary<string, List<SurveyDesign.Questions.Options.Option>> groupOptions = GetGroupOptions(options);
            if (groupOptions.Count > 0)
            {
                var orderedGroupOptions = new Dictionary<string, IList<SurveyDesign.Questions.Options.Option>>();

                var topLevelOptions = GetOrderedList(definition.OrderType, GetTopLevelItems(definition, options), seed).ToList();
                foreach (var groupOption in groupOptions)
                {
                    var orderType = definition.OrderType;
                    OrderType groupOrderType;
                    if (groupOrder.TryGetValue(groupOption.Key, out groupOrderType)) orderType = groupOrderType;
                    orderedGroupOptions[groupOption.Key] = GetOrderedList(orderType, groupOption.Value, seed);
                }

                var indices = new SortedDictionary<int, string>(new DescComparer<int>());
                for (int i = 0; i < topLevelOptions.Count; i++)
                {
                    var option = topLevelOptions[i];
                    if (option.GroupAlias != null) indices.Add(i, option.GroupAlias);
                }

                foreach (var index in indices)
                {
                    topLevelOptions.RemoveAt(index.Key);
                    topLevelOptions.InsertRange(index.Key, orderedGroupOptions[index.Value]);
                }
                return topLevelOptions;
            }

            return GetOrderedList(definition.OrderType, options, seed);
        }

        private IList<SurveyDesign.Questions.Options.Option> GetOrderedList(OrderType orderType, List<SurveyDesign.Questions.Options.Option> options, int seed)
        {
            if (orderType == OrderType.Alphabetical)
            {
                var language = _requestContext.Respondent.Language;
                var stringComparer = StringComparer.Create(new CultureInfo(language), false);
                return options.OrderBy(p => _languageService.GetString(p.Text, language), stringComparer).ToList();
            }
            return new OrderedList<SurveyDesign.Questions.Options.Option>(orderType, options, seed);
        }

        private int GetSeed(int seed)
        {
            long respondentId = _requestContext.Respondent.Id;
            return (int)(respondentId + seed);
        }

        class DescComparer<T> : IComparer<T>
        {
            public int Compare(T x, T y)
            {
                return Comparer<T>.Default.Compare(y, x);
            }
        }

        public void AssignOptionGroups(List<Option> options, List<SurveyDesign.Questions.Options.Option> optionDefinitions, IHasOptions definition)
        {
            if (definition.OptionList == null || definition.OptionList.OptionGroups == null) return;

            Dictionary<string, OptionGroup> optionGroups = MapOptionGroups(definition.OptionList.OptionGroups);

            for (int i = 0; i < optionDefinitions.Count; i++)
            {
                var option = options[i];
                var optionDef = optionDefinitions[i];
                if (optionDef.GroupAlias != null)
                {
                    OptionGroup optionGroup;
                    if (optionGroups.TryGetValue(optionDef.GroupAlias, out optionGroup))
                    {
                        option.OptionGroup = optionGroup;
                    }
                }
            }
        }

        private Dictionary<string, OptionGroup> MapOptionGroups(IList<SurveyDesign.Questions.Options.OptionGroup> optionGroups)
        {
            var ret = new Dictionary<string, OptionGroup>();
            foreach (var group in optionGroups)
            {
                if (string.IsNullOrEmpty(group.Alias)) continue;

                ret[group.Alias] = new OptionGroup
                {
                    Heading = _mapper.Map<LanguageString, EvaluationString>(group.Heading),
                    HideHeading = group.HideHeading,
                    Alias = group.Alias
                };
            }
            return ret;
        }


        private static Dictionary<string, OrderType> GetOrderTypes(IHasOptions definition)
        {
            var groupOrder = new Dictionary<string, OrderType>();
            if (definition.OptionList != null && definition.OptionList.OptionGroups != null)
            {
                foreach (var group in definition.OptionList.OptionGroups)
                {
                    if (@group.OrderType.HasValue)
                    {
                        groupOrder[@group.Alias] = @group.OrderType.Value;
                    }
                }
            }
            return groupOrder;
        }

        private static Dictionary<string, List<SurveyDesign.Questions.Options.Option>> GetGroupOptions(List<SurveyDesign.Questions.Options.Option> options)
        {
            var groupOptions = new Dictionary<string, List<SurveyDesign.Questions.Options.Option>>();
            string currentGroup = null;
            List<SurveyDesign.Questions.Options.Option> currentGroupOptions = null;
            foreach (var option in options)
            {
                if (option.GroupAlias != currentGroup)
                {
                    if (currentGroupOptions == null || !groupOptions.ContainsKey(option.GroupAlias))
                    {
                        currentGroup = option.GroupAlias;
                        currentGroupOptions = new List<SurveyDesign.Questions.Options.Option>();
                        groupOptions[currentGroup] = currentGroupOptions;
                    }
                    else
                    {
                        groupOptions[option.GroupAlias].AddRange(currentGroupOptions);
                    }
                }
                if (currentGroup != null && currentGroup == option.GroupAlias)
                {
                    currentGroupOptions.Add(option);
                }
            }
            return groupOptions;
        }



        private List<SurveyDesign.Questions.Options.Option> GetTopLevelItems(IHasOptions definition, List<SurveyDesign.Questions.Options.Option> options)
        {
            var optionGroups = definition.OptionList.OptionGroups.ToDictionary(t => t.Alias);

            var topLevel = new List<SurveyDesign.Questions.Options.Option>();
            string currentGroup = null;
            foreach (var option in options)
            {
                if (option.GroupAlias != currentGroup)
                {
                    currentGroup = option.GroupAlias;
                    if (currentGroup != null)
                    {
                        var optionGroup = optionGroups[currentGroup];
                        var languageString = optionGroup.Heading;
                        topLevel.Add(new SurveyDesign.Questions.Options.Option { GroupAlias = currentGroup, Text = languageString});
                    }
                }
                if (currentGroup == null)
                {
                    topLevel.Add(option);
                }
            }
            return topLevel;
        }
    }
}