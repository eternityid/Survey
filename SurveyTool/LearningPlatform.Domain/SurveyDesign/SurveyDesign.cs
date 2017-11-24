using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Respondents;
using LearningPlatform.Domain.SurveyDesign.FlowLogic;
using LearningPlatform.Domain.SurveyDesign.LanguageStrings;
using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using LearningPlatform.Domain.SurveyDesign.Surveys;
using LearningPlatform.Domain.SurveyDesign.Validation;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace LearningPlatform.Domain.SurveyDesign
{
    public class SurveyDesign
    {
        private readonly bool _useDatabaseIds; //TODO: Consider to remove this field and always generate object ids
        private readonly LanguageStringFactory _languageStringFactory;
        private readonly LanguageService _languageService;
        private readonly Dictionary<string, Folder> _folders = new Dictionary<string, Folder>();
        private int _optionsListId;
        private int _questionId;
        private readonly Survey _survey;

        private long _optionId;
        private long _nodeId;
        private long _loopId;

        public delegate SurveyDesign Factory(string surveyId = null, bool useDatabaseIds = false);

        public SurveyDesign(string surveyId, bool useDatabaseIds, LanguageStringFactory languageStringFactory, LanguageService languageService)
        {
            _survey = new Survey
            {
                Status = SurveyStatus.New,
                Created = DateTime.Now,
                Modified = DateTime.Now,
                SurveySettings = new SurveySettings
                {
                    EnableBackButton = true,
                    ResumeRespondentWhereLeftOff = false,
                    KeyboardSupport = true,
                    DisplayProgressBar = true,
                    DisplayOneQuestionOnScreen = true,
                    Languages = new[] { "en" },
                    DefaultLanguage = "en",
                    RowVersion = Guid.NewGuid().ToByteArray()
                },
                AccessRights = new SurveyAccessRights()
            };
            if (surveyId != null) _survey.Id = surveyId;

            _useDatabaseIds = useDatabaseIds;
            _languageStringFactory = languageStringFactory;
            _languageService = languageService;
        }

        public string SurveyId => _survey.Id;

        public Survey Survey(string surveyModelName, string userId)
        {
            _survey.Id = ObjectId.GenerateNewId().ToString();
            _survey.SurveySettings.SurveyTitle = surveyModelName;
            _survey.UserId = userId;
            _survey.RowVersion = Guid.NewGuid().ToByteArray();
            return _survey;
        }

        public Survey Survey(Folder topFolder = null, Action<Survey> settings = null)
        {
            settings?.Invoke(_survey);
            if (topFolder != null)
            {
                _survey.TopFolder = topFolder;
            }
            return _survey;
        }

        public SingleSelectionQuestionDefinition SingleSelectionQuestion(string name, string title = "", string description = "", Action<SingleSelectionQuestionDefinition> settings = null, params Option[] options)
        {
            return SingleSelectionQuestion(name, ToArray(title), ToArray(description), settings, options);
        }

        public SingleSelectionQuestionDefinition SingleSelectionQuestion(string name, string[] title, string[] description, Action<SingleSelectionQuestionDefinition> settings = null, params Option[] options)
        {
            return CreateSingle(name, title, description, settings, options);
        }

        public ScaleQuestionDefinition ScaleQuestion(string name, string title = "", string description = "", Action<SingleSelectionQuestionDefinition> settings = null, params Option[] options)
        {
            return ScaleQuestion(name, ToArray(title), ToArray(description), settings, options);
        }

        public ScaleQuestionDefinition ScaleQuestion(string name, string[] title, string[] description, Action<SingleSelectionQuestionDefinition> settings = null, params Option[] options)
        {
            return CreateSingle<ScaleQuestionDefinition>(name, title, description, settings, options);
        }


        public NetPromoterScoreQuestionDefinition NetPromoterScoreQuestion(string name, string title = "", string description = "", Action<SingleSelectionQuestionDefinition> settings = null, params Option[] options)
        {
            return NetPromoterScoreQuestion(name, ToArray(title), ToArray(description), settings, options);
        }

        public NetPromoterScoreQuestionDefinition NetPromoterScoreQuestion(string name, string[] title, string[] description, Action<SingleSelectionQuestionDefinition> settings = null, params Option[] options)
        {
            return CreateSingle<NetPromoterScoreQuestionDefinition>(name, title, description, settings, options);
        }


        private T CreateSingle<T>(string name, string[] title, string[] description, Action<T> settings = null, params Option[] options) where T : SingleSelectionQuestionDefinition, new()
        {
            _optionPosition = 0;
            var singleQuestionDefinition = new T
            {
                Id = CreateQuestionId(),
                Alias = name,
                Title = CreateLanguageString(title),
                Description = CreateLanguageString(description),
                SurveyId = SurveyId,
                OptionList = CreateOptionList(options)
            };
            if (settings != null) settings(singleQuestionDefinition);
            return singleQuestionDefinition;
        }


        public MultipleSelectionQuestionDefinition MultipleSelectionQuestion(string name, string title, string description, Action<MultipleSelectionQuestionDefinition> settings = null, params Option[] options)
        {
            return MultipleSelectionQuestion(name, ToArray(title), ToArray(description), settings, options);
        }

        public MultipleSelectionQuestionDefinition MultipleSelectionQuestion(string name, string[] title, string[] description,
            Action<MultipleSelectionQuestionDefinition> settings = null, params Option[] options)
        {
            _optionPosition = 0;
            var multiQuestionDefinition = new MultipleSelectionQuestionDefinition
            {
                Id = CreateQuestionId(),
                Alias = name,
                Title = CreateLanguageString(title),
                Description = CreateLanguageString(description),
                SurveyId = SurveyId,
                Validations = new List<QuestionValidation>()
            };
            multiQuestionDefinition.OptionList = CreateOptionList(options);
            settings?.Invoke(multiQuestionDefinition);
            return multiQuestionDefinition;
        }

        public MatrixQuestionDefinition MatrixQuestion(string name, string title, string description, QuestionWithOptionsDefinition[] questionDefinitions, Action<MatrixQuestionDefinition> settings = null, params Option[] options)
        {
            return MatrixQuestion(name, ToArray(title), ToArray(description), questionDefinitions, settings, options);
        }

        public MatrixQuestionDefinition MatrixQuestion(string name, string[] title, string[] description, QuestionWithOptionsDefinition[] questionDefinitions, Action<MatrixQuestionDefinition> settings = null, params Option[] options)
        {
            _optionPosition = 0;
            var matrixQuestionDefinition = new MatrixQuestionDefinition
            {
                Id = CreateQuestionId(),
                Alias = name,
                Title = CreateLanguageString(title),
                Description = CreateLanguageString(description),
                SurveyId = SurveyId
            };
            matrixQuestionDefinition.OptionList = CreateOptionList(options);
            foreach (var subQuestion in questionDefinitions)
            {
                matrixQuestionDefinition.AddQuestionDefinition(subQuestion);
            }
            settings?.Invoke(matrixQuestionDefinition);
            return matrixQuestionDefinition;
        }

        public SingleSelectionGridQuestionDefinition SingleSelectionGridQuestion(string name, string title, string description, QuestionDefinition question, Action<GridQuestionDefinition> settings = null, params Option[] options)
        {
            return SingleSelectionGridQuestion(name, ToArray(title), ToArray(description), question, settings, options);
        }

        public SingleSelectionGridQuestionDefinition SingleSelectionGridQuestion(string name, string[] title,
            string[] description, QuestionDefinition question, Action<GridQuestionDefinition> settings = null, params Option[] options)
        {
            return CreateGrid<SingleSelectionGridQuestionDefinition>(name, title, description, question, settings, options);
        }

        public MultipleSelectionGridQuestionDefinition MultiSelectionGridQuestion(string name, string title, string description, QuestionDefinition question, Action<GridQuestionDefinition> settings = null, params Option[] options)
        {
            return MultiSelectionGridQuestion(name, ToArray(title), ToArray(description), question, settings, options);
        }

        public MultipleSelectionGridQuestionDefinition MultiSelectionGridQuestion(string name, string[] title,
            string[] description, QuestionDefinition question, Action<GridQuestionDefinition> settings = null, params Option[] options)
        {
            return CreateGrid<MultipleSelectionGridQuestionDefinition>(name, title, description, question, settings, options);
        }

        public ShortTextListQuestionDefinition ShortTextListQuestion(string name, string title, string description, QuestionDefinition question, Action<GridQuestionDefinition> settings = null, params Option[] options)
        {
            return ShortTextListQuestion(name, ToArray(title), ToArray(description), question, settings, options);
        }

        public ShortTextListQuestionDefinition ShortTextListQuestion(string name, string[] title,
            string[] description, QuestionDefinition question, Action<GridQuestionDefinition> settings = null, params Option[] options)
        {
            return CreateGrid<ShortTextListQuestionDefinition>(name, title, description, question, settings, options);
        }

        public LongTextListQuestionDefinition LongTextListQuestion(string name, string title, string description, QuestionDefinition question, Action<GridQuestionDefinition> settings = null, params Option[] options)
        {
            return LongTextListQuestion(name, ToArray(title), ToArray(description), question, settings, options);
        }

        public LongTextListQuestionDefinition LongTextListQuestion(string name, string[] title,
           string[] description, QuestionDefinition question, Action<GridQuestionDefinition> settings = null, params Option[] options)
        {
            return CreateGrid<LongTextListQuestionDefinition>(name, title, description, question, settings, options);
        }

        public ScaleGridQuestionDefinition ScaleGridQuestion(string name, string title, string description, QuestionDefinition question, Action<GridQuestionDefinition> settings = null, params Option[] options)
        {
            return ScaleGridQuestion(name, ToArray(title), ToArray(description), question, settings, options);
        }

        public ScaleGridQuestionDefinition ScaleGridQuestion(string name, string[] title,
            string[] description, QuestionDefinition question, Action<GridQuestionDefinition> settings = null, params Option[] options)
        {
            return CreateGrid<ScaleGridQuestionDefinition>(name, title, description, question, settings, options);
        }

        public RatingGridQuestionDefinition RatingGridQuestion(string name, string title, string description, QuestionDefinition question, Action<GridQuestionDefinition> settings = null, params Option[] options)
        {
            return RatingGridQuestion(name, ToArray(title), ToArray(description), question, settings, options);
        }

        public RatingGridQuestionDefinition RatingGridQuestion(string name, string[] title,
            string[] description, QuestionDefinition question, Action<GridQuestionDefinition> settings = null, params Option[] options)
        {
            return CreateGrid<RatingGridQuestionDefinition>(name, title, description, question, settings, options);
        }

        private T CreateGrid<T>(string name, string[] title, string[] description, QuestionDefinition question, Action<T> settings = null, params Option[] options) where T : GridQuestionDefinition, new()
        {
            _optionPosition = 0;
            var gridQuestionDefinition = new T
            {
                Id = CreateQuestionId(),
                Alias = name,
                Title = CreateLanguageString(title),
                Description = CreateLanguageString(description),
                SubQuestionDefinition = question,
                SurveyId = SurveyId,
                OptionList = CreateOptionList(options)
            };
            settings?.Invoke(gridQuestionDefinition);
            return gridQuestionDefinition;
        }

        private string CreateQuestionId()
        {
            return _useDatabaseIds ? null : (++_questionId).ToString();
        }

        public OpenEndedShortTextQuestionDefinition OpenEndedShortTextQuestion(string name, string title = "", string description = "", Action<OpenEndedShortTextQuestionDefinition> settings = null, params QuestionValidation[] validations)
        {
            return OpenEndedShortTextQuestion(name, ToArray(title), ToArray(description), settings, validations);
        }

        public OpenEndedShortTextQuestionDefinition OpenEndedShortTextQuestion(string name, string[] title, string[] description, Action<OpenEndedShortTextQuestionDefinition> settings = null, params QuestionValidation[] validations)
        {
            return CreateOpenEndedTextQuestionDefinition(name, title, description, settings, validations);
        }
        public OpenEndedLongTextQuestionDefinition OpenEndedLongTextQuestion(string name, string title = "", string description = "", Action<OpenEndedLongTextQuestionDefinition> settings = null, params QuestionValidation[] validations)
        {
            return OpenEndedLongTextQuestion(name, ToArray(title), ToArray(description), settings, validations);
        }

        public OpenEndedLongTextQuestionDefinition OpenEndedLongTextQuestion(string name, string[] title, string[] description, Action<OpenEndedLongTextQuestionDefinition> settings = null, params QuestionValidation[] validations)
        {
            return CreateOpenEndedTextQuestionDefinition(name, title, description, settings, validations);
        }

        private T CreateOpenEndedTextQuestionDefinition<T>(string name, string[] title,
            string[] description, Action<T> settings, QuestionValidation[] validations) where T : OpenEndedTextQuestionDefinition, new()
        {
            var openEndedTextQuestionDefinition = new T
            {
                Id = CreateQuestionId(),
                Alias = name,
                Title = CreateLanguageString(title),
                Description = CreateLanguageString(description),
                Validations = validations.ToList(),
                SurveyId = SurveyId
            };
            settings?.Invoke(openEndedTextQuestionDefinition);
            return openEndedTextQuestionDefinition;
        }

        public NumericQuestionDefinition NumericQuestion(string name, string title = "", string description = "")
        {
            return NumericQuestion(name, ToArray(title), ToArray(description));
        }

        public NumericQuestionDefinition NumericQuestion(string name, string[] title, string[] description)
        {
            return new NumericQuestionDefinition
            {
                Id = CreateQuestionId(),
                Alias = name,
                Title = CreateLanguageString(title),
                Description = CreateLanguageString(description),
                SurveyId = SurveyId
            };
        }

        public DateQuestionDefinition DateQuestion(string name, string title = "", string description = "")
        {
            return DateQuestion(name, ToArray(title), ToArray(description));
        }

        public DateQuestionDefinition DateQuestion(string name, string[] title, string[] description)
        {
            return new DateQuestionDefinition
            {
                Id = CreateQuestionId(),
                Alias = name,
                Title = CreateLanguageString(title),
                Description = CreateLanguageString(description),
                SurveyId = SurveyId
            };
        }

        private int _optionPosition;

        public Option Option(string code, string text = "", QuestionDefinition otherQuestionDefinition = null,
            string referenceListId = null, OptionsMask optionsMask = null, bool isFixedPosition = false, string groupAlias = null)
        {
            return Option(code, ToArray(text), otherQuestionDefinition, referenceListId, optionsMask, isFixedPosition, groupAlias);
        }

        public Option Option(string code, string[] text, QuestionDefinition otherQuestionDefinition = null,
            string referenceListId = null, OptionsMask optionsMask = null, bool isFixedPosition = false, string groupAlias = null)
        {
            return new Option
            {
                Id = _useDatabaseIds ? ObjectId.GenerateNewId().ToString() : (++_optionId).ToString(),
                Alias = code,
                Text = CreateLanguageString(text),
                OtherQuestionDefinition = otherQuestionDefinition,
                ReferenceListId = referenceListId,
                OptionsMask = optionsMask,
                GroupAlias = groupAlias,
                IsFixedPosition = isFixedPosition,
                Position = ++_optionPosition
            };
        }

        public Folder Loop(string alias, string optionMask, Option[] options, params Node[] nodes)
        {
            SetPositions(nodes);
            var loop = new Folder(alias)
            {
                Id = CreateNodeId(),
                SurveyId = SurveyId,
                Loop = new LoopDefinition
                {
                    Id = _useDatabaseIds ? 0 : ++_loopId,
                    OptionList = CreateOptionList(options),
                    OptionsMask = new OptionsMask
                    {
                        OptionsMaskType = OptionsMaskType.Custom,
                        CustomOptionsMask = optionMask
                    },
                }
            };

            if (nodes != null)
            {
                foreach (var node in nodes)
                {
                    loop.ChildNodes.Add(node);
                }
            }
            return loop;
        }

        private string CreateNodeId()
        {
            return _useDatabaseIds ? null : (++_nodeId).ToString();
        }

        public Condition Condition(string name, string expression, Folder trueFolder, Folder falseFolder = null)
        {
            return new Condition(name, expression, trueFolder, falseFolder)
            {
                Id = CreateNodeId(),
                SurveyId = SurveyId
            };
        }

        public PageDefinition Page(params QuestionDefinition[] questionDefinitions)
        {
            return Page(null, questionDefinitions);
        }

        public PageDefinition Page(Action<PageDefinition> settings, params QuestionDefinition[] questionDefinitions)
        {
            SetPositions(questionDefinitions);
            var pageDefinition = new PageDefinition(questionDefinitions)
            {
                Id = CreateNodeId(),
                Alias = "Page" + _nodeId,
                Title = CreateLanguageString("Page " + _nodeId),
                Description = CreateLanguageString(""),
                SurveyId = SurveyId,
            };
            if (!_useDatabaseIds)
            {
                foreach (var questionDefinition in questionDefinitions)
                {
                    questionDefinition.PageDefinition = pageDefinition;
                    questionDefinition.PageDefinitionId = pageDefinition.Id;
                }
            }
            settings?.Invoke(pageDefinition);
            return pageDefinition;
        }

        public InformationDefinition Information(string name, string title = "", string description = "")
        {
            return Information(name, ToArray(title), ToArray(description));
        }

        private string[] ToArray(string str)
        {
            if (str == null) return null;
            return new[] { str };
        }

        public InformationDefinition Information(string name, string[] title, string[] description)
        {
            return new InformationDefinition
            {
                Id = CreateQuestionId(),
                Alias = name,
                Title = CreateLanguageString(title),
                Description = CreateLanguageString(description),
                SurveyId = SurveyId
            };
        }

        public LanguageSelectionQuestionDefinition LanguageSelection(string name, string[] title, string[] description)
        {
            return new LanguageSelectionQuestionDefinition
            {
                Id = CreateQuestionId(),
                Alias = name,
                Title = CreateLanguageString(title),
                Description = CreateLanguageString(description),
                SurveyId = SurveyId
            };
        }

        public Folder Folder(string name, params Node[] nodes)
        {
            SetPositions(nodes);
            Folder folder = GetFolder(name);
            if (nodes != null)
            {
                foreach (var node in nodes)
                {
                    folder.ChildNodes.Add(node);
                }
            }
            return folder;
        }

        private Folder GetFolder(string name)
        {
            Folder folder;
            if (_folders.TryGetValue(name, out folder)) return folder;

            folder = new Folder(name)
            {
                Id = CreateNodeId(),
                SurveyId = SurveyId,
                Position = 1,
            };
            _folders[name] = folder;
            return folder;
        }

        private static void SetPositions(IEnumerable<IPosition> nodes)
        {
            if (nodes != null)
            {
                int position = 1;
                foreach (var node in nodes)
                {
                    node.Position = position++;
                }
            }
        }

        public GoToFolder GoToFolder(string folderName)
        {
            Folder folder = GetFolder(folderName);
            return new GoToFolder
            {
                Id = CreateNodeId(),
                GoToFolderNode = folder,
                SurveyId = SurveyId
            };
        }

        public LanguageString CreateLanguageString(string str)
        {
            return CreateLanguageString(ToArray(str));
        }

        public LanguageString CreateLanguageString(string[] strings)
        {
            if (strings == null) return null;
            var languageString = _languageStringFactory.Create();
            foreach (var s in strings)
            {
                string lang = "en";
                var str = s;
                if (s.Contains("::"))
                {
                    var index = s.IndexOf("::", StringComparison.Ordinal);
                    var specifiedLang = s.Substring(0, index);
                    try
                    {
                        var culture = new CultureInfo(specifiedLang, true);
                        lang = culture.Name;
                        str = s.Substring(index + 2);
                    }
                    catch (CultureNotFoundException) {/* If we cannot create a culture, then ignore it.*/  }
                }
                _languageService.SetString(languageString, lang, str);
            }
            languageString.SurveyId = SurveyId;
            return languageString;
        }

        public Script Script(string name, string scriptCode)
        {
            return new Script(scriptCode)
            {
                Id = CreateNodeId(),
                Alias = name,
                SurveyId = SurveyId
            };
        }

        public RequiredValidation RequiredValidation()
        {
            return new RequiredValidation();
        }

        public OptionList OptionList(string name, params Option[] options)
        {
            return new OptionList
            {
                Id = (_useDatabaseIds ? null : (++_optionsListId).ToString()),
                Name = name,
                Options = options.ToList(),
                SurveyId = SurveyId
            };
        }

        private OptionList CreateOptionList(Option[] options)
        {
            if (options == null || !options.Any()) return null;
            return OptionList(null, options);
        }

        public RatingQuestionDefinition RatingQuestion(string name, string title, string description, int steps, Action<RatingQuestionDefinition> settings = null)
        {
            return RatingQuestion(name, ToArray(title), ToArray(description), steps, settings);
        }

        public RatingQuestionDefinition RatingQuestion(string name, string[] title, string[] description, int steps, Action<RatingQuestionDefinition> settings = null)
        {
            var ratingQuestionDefinition = new RatingQuestionDefinition
            {
                Id = CreateQuestionId(),
                Alias = name,
                Title = CreateLanguageString(title),
                Description = CreateLanguageString(description),
                SurveyId = SurveyId,
                ShapeName = "glyphicon glyphicon-star"
            };
            var options = new List<Option>();
            for (var i = 1; i <= steps; i++)
            {
                var optionText = i + "";
                options.Add(Option(optionText, new[] { optionText }));
            }
            ratingQuestionDefinition.OptionList = CreateOptionList(options.ToArray());
            settings?.Invoke(ratingQuestionDefinition);
            return ratingQuestionDefinition;
        }

        public RegularExpressionValidation RegularExpressionValidation(string matchPattern, string errorMessage)
        {
            return new RegularExpressionValidation
            {
                MatchPattern = matchPattern,
                ErrorMessage = CreateLanguageString(errorMessage)
            };
        }

        public Node ThankYouPage()
        {
            return Page(p =>
            {
                p.Title = CreateLanguageString("Thank you page");
                p.OrderType = OrderType.InOrder;
                p.ResponseStatus = ResponseStatus.Completed.ToString();
                p.NavigationButtonSettings = NavigationButtonSettings.None;
                p.IsFixedPosition = true;
                p.NodeType = PageType.ThankYouPage.ToString();
                p.Alias = SurveyConstants.THANK_YOU_PAGE_NAME;
            }, Information("thankyou", "Thank you!", "You have completed the survey."));
        }
    }
}