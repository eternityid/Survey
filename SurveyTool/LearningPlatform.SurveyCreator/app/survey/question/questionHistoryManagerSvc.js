(function () {
    angular.module('svt').service('questionHistoryManagerSvc', QuestionHistoryManagerSvc);

    QuestionHistoryManagerSvc.$inject = [
        'guidUtilSvc',
        'questionConst', 'serverValidationSvc', 'questionAdvanceSettingSvc'
    ];

    function QuestionHistoryManagerSvc(
        guidUtilSvc,
        questionConst, serverValidationSvc, questionAdvanceSettingSvc) {
        var QUESTION_HISTORIES = {};
        var QUESTION_TYPES = questionConst.questionTypes;

        var service = {
            getQuestionHistories: getQuestionHistories,
            setQuestionHistories: setQuestionHistories,
            clearHistories: clearHistories,
            updateQuestionHistory: updateQuestionHistory,
            setupQuestionAfterChangingType: setupQuestionAfterChangingType
        };

        return service;

        function getQuestionHistories() {
            return QUESTION_HISTORIES;
        }

        function setQuestionHistories(questionHistories) {
            angular.copy(questionHistories, QUESTION_HISTORIES);
        }

        function clearHistories() {
            angular.copy({}, QUESTION_HISTORIES);
        }

        function updateQuestionHistory(question) {
            switch (question.$type) {
                case QUESTION_TYPES.longText:
                    updateLongTextContent();
                    break;
                case QUESTION_TYPES.singleSelection:
                case QUESTION_TYPES.multipleSelection:
                    updateSimpleSelectionContent();
                    break;
                case QUESTION_TYPES.rating:
                    updateRatingContent();
                    break;
                case QUESTION_TYPES.scale:
                    updateScaleContent();
                    break;
                case QUESTION_TYPES.netPromoterScore:
                    updateNetPromoterScoreContent();
                    break;
                case QUESTION_TYPES.pictureSingleSelection:
                case QUESTION_TYPES.pictureMultipleSelection:
                    updatePictureSelectionContent();
                    break;
                case QUESTION_TYPES.singleSelectionGrid:
                case QUESTION_TYPES.multipleSelectionGrid:
                    updateSelectionGridContent();
                    break;
                case QUESTION_TYPES.shortTextList:
                case QUESTION_TYPES.longTextList:
                    updateTextListContent();
                    break;
                case QUESTION_TYPES.ratingGrid:
                    updateRatingGridContent();
                    break;
                case QUESTION_TYPES.scaleGrid:
                    updateScaleGridContent();
                    break;
            }

            function updateLongTextContent() {
                if (!QUESTION_HISTORIES.longText) {
                    QUESTION_HISTORIES.longText = {};
                }
                QUESTION_HISTORIES.longText.rows = question.rows;
                QUESTION_HISTORIES.longText.cols = question.cols;
            }

            function updateSimpleSelectionContent() {
                if (!QUESTION_HISTORIES.simpleSelection) {
                    QUESTION_HISTORIES.simpleSelection = {};
                }
                QUESTION_HISTORIES.simpleSelection.optionList = question.optionList;
                QUESTION_HISTORIES.simpleSelection.orderType = question.orderType;
                QUESTION_HISTORIES.simpleSelection.displayOrientation = question.displayOrientation;
                QUESTION_HISTORIES.simpleSelection.optionsMask = question.optionsMask;
            }

            function updateRatingContent() {
                if (!QUESTION_HISTORIES.rating) {
                    QUESTION_HISTORIES.rating = {};
                }
                QUESTION_HISTORIES.rating.optionList = question.optionList;
                QUESTION_HISTORIES.rating.shapeName = question.shapeName;
            }

            function updateScaleContent() {
                if (!QUESTION_HISTORIES.scale) {
                    QUESTION_HISTORIES.scale = {};
                }
                QUESTION_HISTORIES.scale.optionList = question.optionList;
                QUESTION_HISTORIES.scale.likertLeftText = question.likertLeftText;
                QUESTION_HISTORIES.scale.likertCenterText = question.likertCenterText;
                QUESTION_HISTORIES.scale.likertRightText = question.likertRightText;
                QUESTION_HISTORIES.scale.renderOptionByButton = question.renderOptionByButton;
            }

            function updateNetPromoterScoreContent() {
                if (!QUESTION_HISTORIES.netPromoterScore) {
                    QUESTION_HISTORIES.netPromoterScore = {};
                }
                QUESTION_HISTORIES.netPromoterScore.optionList = question.optionList;
                QUESTION_HISTORIES.netPromoterScore.likertLeftText = question.likertLeftText;
                QUESTION_HISTORIES.netPromoterScore.likertRightText = question.likertRightText;
                QUESTION_HISTORIES.netPromoterScore.renderOptionByButton = question.renderOptionByButton;
            }

            function updatePictureSelectionContent() {
                if (!QUESTION_HISTORIES.pictureSelection) {
                    QUESTION_HISTORIES.pictureSelection = {};
                }

                QUESTION_HISTORIES.pictureSelection.optionList = question.optionList;
                QUESTION_HISTORIES.pictureSelection.isPictureShowLabel = question.isPictureShowLabel;
                QUESTION_HISTORIES.pictureSelection.isScalePictureToFitContainer = question.isScalePictureToFitContainer;
                QUESTION_HISTORIES.pictureSelection.maxPicturesInGrid = question.maxPicturesInGrid;
                QUESTION_HISTORIES.pictureSelection.orderType = question.orderType;
            }

            function updateSelectionGridContent() {
                if (!QUESTION_HISTORIES.selectionGrid) {
                    QUESTION_HISTORIES.selectionGrid = {};
                }
                QUESTION_HISTORIES.selectionGrid.optionList = question.optionList;
                QUESTION_HISTORIES.selectionGrid.subQuestion = question.subQuestionDefinition;
                QUESTION_HISTORIES.selectionGrid.transposed = question.transposed;
            }

            function updateTextListContent() {
                if (!QUESTION_HISTORIES.textList) {
                    QUESTION_HISTORIES.textList = {};
                }
                QUESTION_HISTORIES.textList.optionList = question.optionList;
                if (question.$type === QUESTION_TYPES.shortTextList) {
                    QUESTION_HISTORIES.textList.subShortTextQuestion = question.subQuestionDefinition;
                } else {
                    QUESTION_HISTORIES.textList.subLongTextQuestion = question.subQuestionDefinition;
                }
            }

            function updateRatingGridContent() {
                if (!QUESTION_HISTORIES.ratingGrid) {
                    QUESTION_HISTORIES.ratingGrid = {};
                }
                QUESTION_HISTORIES.ratingGrid.optionList = question.optionList;
                QUESTION_HISTORIES.ratingGrid.subQuestion = question.subQuestionDefinition;
            }

            function updateScaleGridContent() {
                if (!QUESTION_HISTORIES.scaleGrid) {
                    QUESTION_HISTORIES.scaleGrid = {};
                }
                QUESTION_HISTORIES.scaleGrid.optionList = question.optionList;
                QUESTION_HISTORIES.scaleGrid.subQuestion = question.subQuestionDefinition;
            }
        }

        function setupQuestionAfterChangingType(newQuestionType, oldQuestion) {
            var newQuestion = buildEmptyQuestion(newQuestionType, oldQuestion);

            switch (newQuestionType) {
                case QUESTION_TYPES.shortText:
                case QUESTION_TYPES.longText:
                    setupTextQuestion();
                    break;
                case QUESTION_TYPES.rating:
                    setupRatingQuestion();
                    break;
                case QUESTION_TYPES.scale:
                    setupScaleQuestion();
                    break;
                case QUESTION_TYPES.netPromoterScore:
                    setupNetPromoterScoreQuestion();
                    break;
                case QUESTION_TYPES.singleSelection:
                case QUESTION_TYPES.multipleSelection:
                    setupSimpleSelectionQuestion();
                    break;
                case QUESTION_TYPES.pictureSingleSelection:
                case QUESTION_TYPES.pictureMultipleSelection:
                    setupPictureSelectionQuestion();
                    break;
                case QUESTION_TYPES.shortTextList:
                case QUESTION_TYPES.longTextList:
                    setupTextListQuestion();
                    break;
                case QUESTION_TYPES.singleSelectionGrid:
                case QUESTION_TYPES.multipleSelectionGrid:
                    setupSelectionGridQuestion();
                    break;
                case QUESTION_TYPES.ratingGrid:
                    setupRatingGridQuestion();
                    break;
                case QUESTION_TYPES.scaleGrid:
                    setupScaleGridQuestion();
                    break;
            }

            return newQuestion;

            function setupTextQuestion() {
                if (newQuestionType === QUESTION_TYPES.longText && QUESTION_HISTORIES.longText) {
                    newQuestion.rows = QUESTION_HISTORIES.longText.rows;
                    newQuestion.cols = QUESTION_HISTORIES.longText.cols;
                }
            }

            function setupRatingQuestion() {
                if (QUESTION_HISTORIES.rating) {
                    newQuestion.optionList = QUESTION_HISTORIES.rating.optionList;
                    newQuestion.shapeName = QUESTION_HISTORIES.rating.shapeName;
                }
            }

            function setupScaleQuestion() {
                if (QUESTION_HISTORIES.scale) {
                    newQuestion.optionList = QUESTION_HISTORIES.scale.optionList;
                    newQuestion.likertLeftText = QUESTION_HISTORIES.scale.likertLeftText;
                    newQuestion.likertCenterText = QUESTION_HISTORIES.scale.likertCenterText;
                    newQuestion.likertRightText = QUESTION_HISTORIES.scale.likertRightText;
                    newQuestion.renderOptionByButton = QUESTION_HISTORIES.scale.renderOptionByButton;
                } else {
                    newQuestion.renderOptionByButton =true;
                }
            }

            function setupNetPromoterScoreQuestion() {
                if (QUESTION_HISTORIES.netPromoterScore) {
                    newQuestion.optionList = QUESTION_HISTORIES.netPromoterScore.optionList;
                    newQuestion.likertLeftText = QUESTION_HISTORIES.netPromoterScore.likertLeftText;
                    newQuestion.likertRightText = QUESTION_HISTORIES.netPromoterScore.likertRightText;
                    newQuestion.renderOptionByButton = QUESTION_HISTORIES.netPromoterScore.renderOptionByButton;
                }
            }

            function setupSimpleSelectionQuestion() {
                if (QUESTION_HISTORIES.simpleSelection) {
                    newQuestion.optionList = QUESTION_HISTORIES.simpleSelection.optionList;
                    newQuestion.orderType = QUESTION_HISTORIES.simpleSelection.orderType;
                    newQuestion.displayOrientation = QUESTION_HISTORIES.simpleSelection.displayOrientation;
                    newQuestion.optionsMask = QUESTION_HISTORIES.simpleSelection.optionsMask;
                    if (newQuestion.$type === QUESTION_TYPES.multipleSelection) {
                        //TODO need to refactor here
                        var displayOrientationOptions = questionAdvanceSettingSvc.getDisplayOrientations();
                        if (parseInt(newQuestion.displayOrientation) + 1 > displayOrientationOptions.length) {
                            newQuestion.displayOrientation = displayOrientationOptions[0].code;
                        }
                    }
                }
            }

            function setupPictureSelectionQuestion() {
                if (QUESTION_HISTORIES.pictureSelection) {
                    newQuestion.optionList = QUESTION_HISTORIES.pictureSelection.optionList;
                    newQuestion.isPictureShowLabel = QUESTION_HISTORIES.pictureSelection.isPictureShowLabel;
                    newQuestion.isScalePictureToFitContainer = QUESTION_HISTORIES.pictureSelection.isScalePictureToFitContainer;
                    newQuestion.maxPicturesInGrid = QUESTION_HISTORIES.pictureSelection.maxPicturesInGrid;
                    newQuestion.orderType = QUESTION_HISTORIES.pictureSelection.orderType;
                }
            }

            function setupTextListQuestion() {
                if (QUESTION_HISTORIES.textList) {
                    newQuestion.optionList = QUESTION_HISTORIES.textList.optionList;
                    newQuestion.subQuestionDefinition =
                        newQuestion.$type === QUESTION_TYPES.shortTextList ?
                        QUESTION_HISTORIES.textList.subShortTextQuestion :
                        QUESTION_HISTORIES.textList.subLongTextQuestion;
                }
            }

            function setupSelectionGridQuestion() {
                if (QUESTION_HISTORIES.selectionGrid) {
                    newQuestion.optionList = QUESTION_HISTORIES.selectionGrid.optionList;
                    newQuestion.subQuestionDefinition = QUESTION_HISTORIES.selectionGrid.subQuestion;
                    newQuestion.subQuestionDefinition.$type = newQuestion.$type === QUESTION_TYPES.singleSelectionGrid ?
                        QUESTION_TYPES.singleSelection :
                        QUESTION_TYPES.multipleSelection;
                    newQuestion.transposed = QUESTION_HISTORIES.selectionGrid.transposed;
                }
            }

            function setupRatingGridQuestion() {
                if (QUESTION_HISTORIES.ratingGrid) {
                    newQuestion.optionList = QUESTION_HISTORIES.ratingGrid.optionList;
                    newQuestion.subQuestionDefinition = QUESTION_HISTORIES.ratingGrid.subQuestion;
                }
            }

            function setupScaleGridQuestion() {
                if (QUESTION_HISTORIES.scaleGrid) {
                    newQuestion.optionList = QUESTION_HISTORIES.scaleGrid.optionList;
                    newQuestion.subQuestionDefinition = QUESTION_HISTORIES.scaleGrid.subQuestion;
                }
            }
        }

        function buildEmptyQuestion(newQuestionType, oldQuestion) {
            return {
                $type: newQuestionType, // Added to make $type the first item.
                id: oldQuestion.id,
                optionList: null,
                seed: 0,
                isInGrid: false,
                questionMaskExpression: oldQuestion.questionMaskExpression,
                parentQuestionId: null,
                pageDefinitionId: oldQuestion.pageDefinitionId,
                alias: oldQuestion.alias,
                title: oldQuestion.title,
                description: oldQuestion.description,
                surveyId: oldQuestion.surveyId,
                validations: oldQuestion.validations,
                isFixedPosition: oldQuestion.isFixedPosition,
                isAlwaysHidden: oldQuestion.isAlwaysHidden,
                renderOptionByButton: oldQuestion.renderOptionByButton,
                guid: guidUtilSvc.createGuid(), // guid for previewing question
                advancedSettings: oldQuestion.advancedSettings,
                rowVersion: oldQuestion.rowVersion,
                positionInSurvey: oldQuestion.positionInSurvey,
                pageId: oldQuestion.pageId,
                version: oldQuestion.version
            };
        }
    }
})();