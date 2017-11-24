using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Helpers;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using LearningPlatform.Domain.SurveyDesign.Validation;
using MongoDB.Bson;
using System.Collections.Generic;

namespace LearningPlatform.Domain.SampleData
{
    public class ComplexSurveyDefinitionSample
    {
        private readonly SurveyDesign.SurveyDesign.Factory _surveyDesignFactory;

        public ComplexSurveyDefinitionSample(SurveyDesign.SurveyDesign.Factory surveyDesignFactory)
        {
            _surveyDesignFactory = surveyDesignFactory;
        }

        public Survey CreateSurvey()
        {
            string surveyId = ObjectIdHelper.GetObjectIdFromLongString("2");
            var create = _surveyDesignFactory.Invoke(surveyId: surveyId, useDatabaseIds: true);

            var optionsList = create.OptionList("Cars",
                create.Option("1", text: "BMW"),
                create.Option("2", text: "Mercedes"),
                create.Option("3", text: "Toyota"));

            optionsList.Id = ObjectId.GenerateNewId().ToString();

            var survey = create.Survey(
                create.Folder("topFolder",
                    create.Page(
                        create.SingleSelectionQuestion("show", "Show?", "", null,
                            create.Option("yes", "Yes, please"),
                            create.Option("no", "No, thank you"))
                    ),
                    create.Page(
                        create.MultipleSelectionQuestion("q1", "q1", "q1", q =>
                        {
                            q.QuestionMask = "questions.show.answer==='yes'";
                        },
                            create.Option("1", "1"),
                            create.Option("2", "2"),
                            create.Option("3", "3")),
                        create.MultipleSelectionQuestion("q2", "q2", "q2", q =>
                        {
                            q.QuestionMask = "true";
                            q.DisplayOrientation = DisplayOrientation.Vertical;
                        },
                            create.Option("1", "1"),
                            create.Option("2", "2"),
                            create.Option("3", "3")),
                        create.NetPromoterScoreQuestion("Likert", "Net Promoter Score®", "On a scale from 0-10, how likely are you to recommend Orient Software to a friend or colleague?", q =>
                        {
                            q.DisplayOrientation = DisplayOrientation.Horizontal;
                            q.LikertLeftText = create.CreateLanguageString("Not at all likely");
                            q.LikertCenterText = create.CreateLanguageString("Neutral");
                            q.LikertRightText = create.CreateLanguageString("Extremely likely");
                        },
                            create.Option("0", "0"),
                            create.Option("1", "1"),
                            create.Option("2", "2"),
                            create.Option("3", "3"),
                            create.Option("4", "4"),
                            create.Option("5", "5"),
                            create.Option("6", "6"),
                            create.Option("7", "7"),
                            create.Option("8", "8"),
                            create.Option("9", "9"),
                            create.Option("10", "10"))),
                    create.Page(
                        create.MatrixQuestion("grid1", (string)null, null,
                            new QuestionWithOptionsDefinition[]
                            {
                                create.MultipleSelectionQuestion("multi1", "", "multi1"),
                                create.SingleSelectionQuestion("single1", "", "single1"),
                                create.SingleSelectionGridQuestion("SingleList", "", "singleList",
                                    create.SingleSelectionQuestion("s1", "", "s1", q => q.OrderType = OrderType.InOrder,
                                        create.Option("1", text: "1"),
                                        create.Option("2", text: "2"),
                                        create.Option("3", text: "3")))
                            },
                            q => q.OrderType = OrderType.InOrder,
                            create.Option("1", text: "Apple"),
                            create.Option("2", text: "Orange"),
                            create.Option("3", text: "Pear")),
                        create.SingleSelectionGridQuestion("cars", "Rate the following cars", "1 is bad, 4 is great",
                            create.SingleSelectionQuestion("", "", "",
                                q => q.OrderType = OrderType.InOrder,
                                create.Option("1", text: "1"),
                                create.Option("2", text: "2"),
                                create.Option("3", text: "3"),
                                create.Option("4", text: "4")),
                            q => q.OrderType = OrderType.InOrder,
                            create.Option("bmw", text: "BMW"),
                            create.Option("mercedes", text: "Mercedes"),
                            create.Option("ford", text: "Ford"))
                        ),
                    create.Condition("condition", "questions.age.answer===5",
                        create.Folder("trueFolder",
                            create.Page(
                                create.OpenEndedShortTextQuestion("question1",
                                    "Heading1  {{questions.question2.answer['1']}}",
                                    "Text1. {{questions.question1.answer}}", null,
                                    create.RequiredValidation()),
                                create.MultipleSelectionQuestion("question2",
                                    "Heading2 {{questions.question2.mask = ['1', '3']}}",
                                    "Text2", q =>
                                    {
                                        q.Validations = new List<QuestionValidation> { create.RequiredValidation() };
                                        q.OrderType = OrderType.Flipped;
                                    },
                                    create.Option("1", text: "Apple"),
                                    create.Option("2", text: "Microsoft"),
                                    create.Option("3", text: "IBM"))))),
                    create.Page(
                        create.NumericQuestion("age", "Your Age", "Please enter your age"),
                        create.SingleSelectionQuestion("question4", "Gender", "Please state your gender",
                            q => q.OrderType = OrderType.InOrder,
                            create.Option("1", text: "Male"),
                            create.Option("2", text: "Female"),
                            create.Option("3", "Other",
                                create.OpenEndedShortTextQuestion("genderOther", "", "", null,
                                    new QuestionValidation[] { create.RequiredValidation() }))),
                        create.SingleSelectionGridQuestion("multiList", "", "",
                            create.MultipleSelectionQuestion("multiInList", "", "",
                                question => question.OrderType = OrderType.InOrder,
                                create.Option("1", text: "Option 1"),
                                create.Option("2", text: "Option 2")),
                            q => q.OrderType = OrderType.InOrder,
                            create.Option("1", text: "Q1"),
                            create.Option("2", text: "Q2"))),
                    create.Script("redirect script",
                        "if(questions.age.answer===20 && isForward()) redirect('http://www.google.com')"),
                    create.Page(p => p.OrderType = OrderType.Random,
                        create.Information("infoTest", "Test", "Testing"),
                        create.MultipleSelectionQuestion("carsYouLike", "Which cars do you like?", "", null,
                            create.Option("", referenceListId: optionsList.Id))),
                    create.Page(p => p.OrderType = OrderType.Random,
                        create.SingleSelectionQuestion("favouriteCar", "Which car is your favourite", "", p =>
                        {
                            p.OrderType = OrderType.Random;
                        },
                            create.Option("", referenceListId: optionsList.Id,
                                optionsMask: new OptionsMask
                                {
                                    OptionsMaskType = OptionsMaskType.Custom,
                                    CustomOptionsMask = "questions.carsYouLike.answer"
                                }),
                            create.Option("99Other", text: "Other",
                                otherQuestionDefinition: create.OpenEndedShortTextQuestion("carsOther", "", "",
                                    null, new QuestionValidation[] { create.RequiredValidation() }), isFixedPosition: true))),
                    create.ThankYouPage()));
            survey.SurveySettings.SurveyTitle = "Advanced Survey";
            survey.LayoutId = ObjectIdHelper.GetObjectIdFromLongString("1");
            survey.ThemeId = ObjectIdHelper.GetObjectIdFromLongString("1");
            survey.UserId = "f6e021af-a6a0-4039-83f4-152595b4671a";

            return survey;
        }
    }
}
