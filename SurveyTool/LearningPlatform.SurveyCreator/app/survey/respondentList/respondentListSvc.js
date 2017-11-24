(function () {
    angular.module('svt').service('respondentListSvc', respondentListSvc);
    respondentListSvc.$inject = ['stringUtilSvc', 'numberUtilSvc', 'dateUtilSvc', 'questionConst'];

    function respondentListSvc(stringUtilSvc, numberUtilSvc, dateUtilSvc, questionConst) {
        var service = {
            getStatusDisplay: getStatusDisplay,
            validateNumberSentFieldWhenTyping: validateNumberSentFieldWhenTyping,
            validateSearch: validateSearch,
            validateShowingEmailEditor: validateShowingEmailEditor,
            populateRespondents: populateRespondents,
            getDefaultSearchModel: getDefaultSearchModel,
            getDefaultPaging: getDefaultPaging,
            buildQuestionDictionary: buildQuestionDictionary
        };
        return service;

        function getStatusDisplay(status) {
            if (status === 'NotTaken') return 'Not taken';
            if (status === 'InProgress') return 'In progress';
            if (status === 'Completed') return 'Completed';
            return '';
        }

        function validateNumberSentFieldWhenTyping() {
            var input = angular.element(document.querySelector('#respondent-number-sent'));
            input.keypress(function (e) {
                var charCode = e.which ? e.which : event.keyCode;
                return (charCode > 31 && (charCode < 48 || charCode > 57) ? false : true);
            });
        }

        function validateSearch(searchModel) {
            var dateFormat = "MM/DD/YYYY";
            if (searchModel.numberSentOperator) {
                var numberSent = searchModel.numberSent;
                if (stringUtilSvc.isEmpty(numberSent)) {
                    toastr.error('Number sent is required.');
                    return false;
                }
                if (!numberUtilSvc.isInteger(numberSent)) {
                    toastr.error('Number sent must be a number. Please enter again.');
                    return false;
                }

                if (searchModel.numberSentOperator === 'BETWEEN') {
                    var numberSentTo = searchModel.numberSentTo;
                    if (stringUtilSvc.isEmpty(numberSentTo)) {
                        toastr.error('Number Sent To is required.');
                        return false;
                    }
                    if (!numberUtilSvc.isInteger(numberSentTo)) {
                        toastr.error('Number Sent To must be a number. Please enter again.');
                        return false;
                    }

                    if (numberUtilSvc.compareNumbers(numberSent, numberSentTo) === 1) {
                        toastr.error('The Range of selected Number Sent is invalid. Please enter again.');
                        return false;
                    }
                }
            }
            if (searchModel.lastTimeSentOperator) {
                if (stringUtilSvc.isEmpty(searchModel.lastTimeSent)) {
                    toastr.error('Last sent date is required.');
                    return false;
                }
                if (!dateUtilSvc.isDateString(searchModel.lastTimeSent, dateFormat)) {
                    toastr.error('Last sent date is not a date. Please enter again.');
                    return false;
                }

                if (searchModel.lastTimeSentOperator === 'BETWEEN') {
                    if (stringUtilSvc.isEmpty(searchModel.lastTimeSentTo)) {
                        toastr.error('Last Sent Limit To Date is required.');
                        return false;
                    }

                    if (!dateUtilSvc.isDateString(searchModel.lastTimeSentTo, dateFormat)) {
                        toastr.error('Last Sent Limit To Date is not a date. Please enter again.');
                        return false;
                    }

                    if (dateUtilSvc.compareDateTime(searchModel.lastTimeSent, searchModel.lastTimeSentTo, dateFormat) === 1) {
                        toastr.error('The Range of selected Last Sent Dates is invalid. Please enter again.');
                        return false;
                    }
                }
            }
            if (searchModel.completedTimeSentOperator) {
                if (stringUtilSvc.isEmpty(searchModel.completedTimeSent)) {
                    toastr.error('Completed date is required.');
                    return false;
                }
                if (!dateUtilSvc.isDateString(searchModel.completedTimeSent, dateFormat)) {
                    toastr.error('Completed date is not a date. Please enter again.');
                    return false;
                }

                if (searchModel.completedTimeSentOperator === 'BETWEEN') {
                    if (stringUtilSvc.isEmpty(searchModel.completedTimeSentTo)) {
                        toastr.error('Completed Time Limit To Date is required.');
                        return false;
                    }

                    if (!dateUtilSvc.isDateString(searchModel.completedTimeSentTo, dateFormat)) {
                        toastr.error('Completed Time To Date is not a date. Please enter again.');
                        return false;
                    }

                    if (dateUtilSvc.compareDateTime(searchModel.completedTimeSent, searchModel.completedTimeSentTo, dateFormat) === 1) {
                        toastr.error('The Range of selected Completed Dates is invalid. Please enter again.');
                        return false;
                    }

                }
            }
            return true;
        }

        function validateShowingEmailEditor(respondents) {
            if (respondents.length < 1) {
                toastr.warning('There is no respondent(s) to send. Please search/filter again.');
                return false;
            }
            return true;
        }

        function populateRespondents(respondents, response, surveyId, selectedList, isMockResponse) {
            for (var index = 0; index < response.length; index++) {
                var respondent = response[index];
                var respondentDetailPath = '#/surveys/' + surveyId + '/respondents/' + respondent.id + (isMockResponse ? '/test' : '/response');

                respondents.push({
                    id: respondent.id,
                    email: respondent.emailAddress,
                    numberSent: respondent.numberSent,
                    dateLastSent: respondent.lastTimeSent,
                    completedDateString: respondent.completed,
                    status: respondent.responseStatus,
                    customColumns: respondent.customColumns,
                    statusDisplay: getStatusDisplay(respondent.responseStatus),
                    respondentDetailPath: respondentDetailPath,
                    isSelected: selectedList.indexOf(respondent.id) >= 0
                });
            }
            return respondents;
        }

        function getDefaultSearchModel() {
            return {
                surveyId: 0,
                email: '',
                status: '',
                numberSent: {
                    'conditionOperator': '',
                    'numberFrom': '',
                    'numberTo': ''
                },
                lastTimeSent: {
                    'conditionOperator': '',
                    'datetimeFrom': '',
                    'datetimeTo': ''
                },
                completedTimeSent: {
                    'conditionOperator': '',
                    'datetimeFrom': '',
                    'datetimeTo': ''
                },
                customColumns: '',
                paging: getDefaultPaging()
            };
        }

        function getDefaultPaging() {
            return {
                start: 0,
                limit: 10,
                hashNext: false
            };
        }

        function buildQuestionDictionary(surveyLatestVersion) {
            var questionDictionary = {};

            var pages = surveyLatestVersion.survey.topFolder.childNodes.filter(function (node) {
                return node.$type === 'PageDefinition' && node.nodeType !== 'ThankYouPage';
            });

            pages.forEach(function (page) {
                page.questionDefinitions.forEach(function (question) {
                    extractQuestionData(question);
                });
            });

            exposeCarryOverOptions(questionDictionary);
            return questionDictionary;

            function extractQuestionData(question) {
                switch (question.$type) {
                    case questionConst.questionTypes.numeric:
                    case questionConst.questionTypes.shortText:
                    case questionConst.questionTypes.longText:
                    case questionConst.questionTypes.date:
                        assignSingleQuestionToDictionary(question);
                        break;
                    case questionConst.questionTypes.singleSelection:
                    case questionConst.questionTypes.multipleSelection:
                    case questionConst.questionTypes.rating:
                    case questionConst.questionTypes.scale:
                    case questionConst.questionTypes.netPromoterScore:
                    case questionConst.questionTypes.pictureSingleSelection:
                    case questionConst.questionTypes.pictureMultipleSelection:
                        assignSelectionQuestionToDictionary(question);
                        break;
                    case questionConst.questionTypes.singleSelectionGrid:
                    case questionConst.questionTypes.multipleSelectionGrid:
                    case questionConst.questionTypes.ratingGrid:
                    case questionConst.questionTypes.scaleGrid:
                        assignGridSelectionQuestionToDictionary(question);
                        break;
                    case questionConst.questionTypes.shortTextList:
                    case questionConst.questionTypes.longTextList:
                        assignGridSingleQuestionToDictionary(question);
                        break;
                    default:
                        break;
                }

                function assignSingleQuestionToDictionary(currentQuestion) {
                    questionDictionary[currentQuestion.alias] = extractSingleQuestion(currentQuestion);
                    questionDictionary[currentQuestion.alias].id = currentQuestion.id;
                    questionDictionary[currentQuestion.alias].position = Object.keys(questionDictionary).length + 1;
                }

                function assignSelectionQuestionToDictionary(currentQuestion) {
                    questionDictionary[currentQuestion.alias] = extractSelectionQuestion(currentQuestion);
                    questionDictionary[currentQuestion.alias].id = currentQuestion.id;
                    questionDictionary[currentQuestion.alias].position = Object.keys(questionDictionary).length + 1;
                }

                function assignGridSelectionQuestionToDictionary(currentQuestion) {
                    var extractedSubQuestion = extractSelectionQuestion(currentQuestion.subQuestionDefinition);
                    currentQuestion.optionList.options.forEach(function (topic) {
                        var subQuestion = angular.copy(extractedSubQuestion);
                        subQuestion.title = currentQuestion.title.items[0].text + '_' + topic.text.items[0].text;
                        questionDictionary[currentQuestion.alias + '_' + topic.alias] = subQuestion;
                        questionDictionary[currentQuestion.alias + '_' + topic.alias].id = currentQuestion.id;
                        questionDictionary[currentQuestion.alias + '_' + topic.alias].position = Object.keys(questionDictionary).length + 1;
                    });
                }

                function assignGridSingleQuestionToDictionary(currentQuestion) {
                    var extractedSubQuestion = extractSingleQuestion(currentQuestion.subQuestionDefinition);
                    currentQuestion.optionList.options.forEach(function (topic) {
                        var subQuestion = angular.copy(extractedSubQuestion);
                        subQuestion.title = currentQuestion.title.items[0].text + '_' + topic.text.items[0].text;
                        questionDictionary[currentQuestion.alias + '_' + topic.alias] = subQuestion;
                        questionDictionary[currentQuestion.alias + '_' + topic.alias].id = currentQuestion.id;
                        questionDictionary[currentQuestion.alias + '_' + topic.alias].position = Object.keys(questionDictionary).length + 1;
                    });
                }

                function extractSingleQuestion(currentQuestion) {
                    return {
                        $type: currentQuestion.$type,
                        title: currentQuestion.title.items[0].text
                    };
                }

                function extractSelectionQuestion(currentQuestion) {
                    var data = {
                        $type: currentQuestion.$type,
                        title: currentQuestion.title.items[0].text,
                        options: {}
                    };

                    currentQuestion.optionList.options.forEach(function (o) {
                        data.options[o.alias] = {
                            title: o.text.items[0].text
                        };
                        if (o.optionsMask && o.optionsMask.questionId) {
                            data.options[o.alias].carryOverFromQuestionId = o.optionsMask.questionId;
                        }
                        if (o.otherQuestionDefinition) {
                            data.options[o.alias].otherQuestionAlias = o.otherQuestionDefinition.alias;
                        }
                    });

                    return data;
                }
            }

            function exposeCarryOverOptions(questionsDictionary) {
                var isReplaced = false;
                Object.keys(questionsDictionary).forEach(function (questionAlias) {
                    var question = questionsDictionary[questionAlias];
                    if (!question.options) return;
                    var optionAliases = Object.keys(question.options);
                    optionAliases.forEach(function (optionAlias) {
                        var option = question.options[optionAlias];
                        if (option.hasOwnProperty('carryOverFromQuestionId') &&
                            option.carryOverFromQuestionId !== null) {
                            var carryOverOptions = getOptionsByQuestionId(questionsDictionary,
                                option.carryOverFromQuestionId);
                            delete question.options[optionAlias];
                            if (carryOverOptions) {
                                angular.extend(question.options, carryOverOptions);
                            }
                            isReplaced = true;
                        }
                    });
                });

                if (isReplaced) {
                    exposeCarryOverOptions(questionsDictionary);
                }
            }

            function getOptionsByQuestionId(questionsDictionary, questionId) {
                var questionAlias = Object.keys(questionsDictionary).find(function (key) {
                    var question = questionsDictionary[key];
                    return question.id === questionId;
                });
                return questionAlias !== undefined ?
                    questionsDictionary[questionAlias].options : null;
            }
        }
    }
})();