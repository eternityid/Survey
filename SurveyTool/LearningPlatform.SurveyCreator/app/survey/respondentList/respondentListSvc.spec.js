(function() {
    'use strict';
    describe('Testing respondentListSvc function', function () {
        var svc,
            stringUtilSvc,
            numberUtilSvc,
            dateUtilSvc;
        beforeEach(function() {
            module('svt');
            module(function($provide) {
                stringUtilSvc = jasmine.createSpyObj('stringUtilSvc', ['isEmpty']);
                stringUtilSvc.isEmpty.and.callFake(function (value) {
                    return value === '';
                });
                $provide.value('stringUtilSvc', stringUtilSvc);

                numberUtilSvc = jasmine.createSpyObj('numberUtilSvc', [
                    'isInteger', 'compareNumbers']);
                numberUtilSvc.isInteger.and.callFake(function (value) {
                    return Number.isInteger(value);
                });
                numberUtilSvc.compareNumbers.and.callFake(function (left, right) {
                    if (left === right) return 0;
                    return left < right ? -1 : 1;
                });
                $provide.value('numberUtilSvc', numberUtilSvc);

                dateUtilSvc = jasmine.createSpyObj('dateUtilSvc', ['isDateString', 'compareDateTime']);
                dateUtilSvc.isDateString.and.callFake(function (dateString, format) {
                    return moment(dateString, format, true).isValid();
                });
                $provide.value('dateUtilSvc', dateUtilSvc);
            });
            inject(function ($injector) {
                svc = $injector.get('respondentListSvc');
            });
        });

        describe('Testing getStatusDisplay function', function() {
            var status;

            it('should return not taken status', function() {
                status = 'NotTaken';

                var result = svc.getStatusDisplay(status);

                expect(result).toEqual('Not taken');
            });

            it('should return in progress status', function () {
                status = 'InProgress';

                var result = svc.getStatusDisplay(status);

                expect(result).toEqual('In progress');
            });

            it('should return completed status', function () {
                status = 'Completed';

                var result = svc.getStatusDisplay(status);

                expect(result).toEqual('Completed');
            });
        });

        describe('Testing validateNumberSentFieldWhenTyping function', function () {
            it('should handle keydown event', function () {
                svc.validateNumberSentFieldWhenTyping();
            });
        });

        describe('Testing validateSearch function', function () {
            var searchModel = {},
                validation;
            beforeEach(function () {
                spyOn(toastr, 'error');
            });

            describe('Validate number sent', function () {
                it('should show error message when number sent is empty', function () {
                    searchModel.numberSentOperator = 'GREATERTHAN';
                    searchModel.numberSent = '';

                    validation = svc.validateSearch(searchModel);

                    expect(toastr.error).toHaveBeenCalledWith('Number sent is required.');
                    expect(validation).toEqual(false);
                });

                it('should show error message when number sent is not a number', function () {
                    searchModel.numberSentOperator = 'LESSTHAN';
                    searchModel.numberSent = 'dummy';

                    validation = svc.validateSearch(searchModel);

                    expect(toastr.error).toHaveBeenCalledWith('Number sent must be a number. Please enter again.');
                    expect(validation).toEqual(false);
                });

                it('should validate number sent range', function () {
                    searchModel.numberSentOperator = 'BETWEEN';
                    searchModel.numberSent = 2;
                    searchModel.numberSentTo = '';

                    validation = svc.validateSearch(searchModel);

                    expect(toastr.error).toHaveBeenCalledWith('Number Sent To is required.');
                    expect(validation).toEqual(false);

                    searchModel.numberSentTo = 'dummy';
                    validation = svc.validateSearch(searchModel);

                    expect(toastr.error).toHaveBeenCalledWith('Number Sent To must be a number. Please enter again.');
                    expect(validation).toEqual(false);

                    searchModel.numberSentTo = 1;
                    validation = svc.validateSearch(searchModel);

                    expect(toastr.error).toHaveBeenCalledWith('The Range of selected Number Sent is invalid. Please enter again.');
                    expect(validation).toEqual(false);
                });
            });

            describe('Validate last time sent', function () {
                it('should show error message when last time sent is empty', function () {
                    searchModel.numberSentOperator = '';
                    searchModel.lastTimeSentOperator = 'GREATERTHAN';
                    searchModel.lastTimeSent = '';

                    validation = svc.validateSearch(searchModel);

                    expect(toastr.error).toHaveBeenCalledWith('Last sent date is required.');
                    expect(validation).toEqual(false);
                });

                it('should validate last time sent format', function () {
                    searchModel.numberSentOperator = 'LESSTHAN';
                    searchModel.numberSent = 3;
                    searchModel.lastTimeSentOperator = 'EQUALS';
                    searchModel.lastTimeSent = 'dummy';

                    validation = svc.validateSearch(searchModel);

                    expect(toastr.error).toHaveBeenCalledWith('Last sent date is not a date. Please enter again.');
                    expect(validation).toEqual(false);
                });

                it('should validate last time sent range', function () {
                    searchModel.numberSentOperator = 'BETWEEN';
                    searchModel.numberSent = 1;
                    searchModel.numberSentTo = 5;
                    searchModel.lastTimeSentOperator = 'BETWEEN';
                    searchModel.lastTimeSent = '10/10/2016';

                    searchModel.lastTimeSentTo = '';
                    validation = svc.validateSearch(searchModel);

                    expect(toastr.error).toHaveBeenCalledWith('Last Sent Limit To Date is required.');
                    expect(validation).toEqual(false);

                    searchModel.lastTimeSentTo = 'dummy';
                    validation = svc.validateSearch(searchModel);

                    expect(toastr.error).toHaveBeenCalledWith('Last Sent Limit To Date is not a date. Please enter again.');
                    expect(validation).toEqual(false);

                    searchModel.lastTimeSentTo = '09/08/2016';
                    dateUtilSvc.compareDateTime.and.returnValue(1);
                    validation = svc.validateSearch(searchModel);

                    expect(toastr.error).toHaveBeenCalledWith('The Range of selected Last Sent Dates is invalid. Please enter again.');
                    expect(validation).toEqual(false);
                });
            });

            describe('Validate completed time sent', function () {
                it('should check invalid completed date', function () {
                    searchModel.numberSentOperator = '';
                    searchModel.lastTimeSentOperator = 'GREATERTHAN';
                    searchModel.lastTimeSent = '01/10/2016';
                    searchModel.completedTimeSentOperator = "LESSTHAN";

                    searchModel.completedTimeSent = '';
                    validation = svc.validateSearch(searchModel);

                    expect(toastr.error).toHaveBeenCalledWith('Completed date is required.');
                    expect(validation).toEqual(false);

                    searchModel.completedTimeSent = 'dummy';
                    validation = svc.validateSearch(searchModel);

                    expect(toastr.error).toHaveBeenCalledWith('Completed date is not a date. Please enter again.');
                    expect(validation).toEqual(false);
                });

                it('should validate last time sent range', function () {
                    searchModel.numberSentOperator = '';
                    searchModel.lastTimeSentOperator = 'BETWEEN';
                    searchModel.lastTimeSent = '10/10/2016';
                    searchModel.lastTimeSentTo = '10/15/2016';
                    searchModel.completedTimeSentOperator = 'BETWEEN';
                    searchModel.completedTimeSent = '08/09/2016';

                    dateUtilSvc.compareDateTime.and.returnValues(-1, -1, -1, 1);
                    searchModel.completedTimeSentTo = '';
                    validation = svc.validateSearch(searchModel);

                    expect(toastr.error).toHaveBeenCalledWith('Completed Time Limit To Date is required.');
                    expect(validation).toEqual(false);

                    searchModel.completedTimeSentTo = 'dummy';
                    validation = svc.validateSearch(searchModel);

                    expect(toastr.error).toHaveBeenCalledWith('Completed Time To Date is not a date. Please enter again.');
                    expect(validation).toEqual(false);

                    searchModel.completedTimeSentTo = '08/07/2016';
                    validation = svc.validateSearch(searchModel);

                    expect(toastr.error).toHaveBeenCalledWith('The Range of selected Completed Dates is invalid. Please enter again.');
                    expect(validation).toEqual(false);
                });
            });

            it('should return true with valid data', function () {
                searchModel.numberSentOperator = '';
                searchModel.lastTimeSentOperator = '';
                searchModel.completedTimeSentOperator = "";

                validation = svc.validateSearch(searchModel);

                expect(validation).toEqual(true);

                searchModel.completedTimeSentOperator = 'LESSTHAN';
                searchModel.completedTimeSent = '02/18/2016';
                validation = svc.validateSearch(searchModel);

                expect(validation).toEqual(true);

                searchModel.completedTimeSentOperator = 'BETWEEN';
                searchModel.completedTimeSentTo = '03/18/2016';
                dateUtilSvc.compareDateTime.and.returnValues(-1);
                validation = svc.validateSearch(searchModel);

                expect(validation).toEqual(true);
            });
        });

        describe('Testing validateShowingEmailEditor function', function () {
            var respondents;
            it('should show error message when having no respondent', function () {
                respondents = [];
                spyOn(toastr, 'warning');

                var validation = svc.validateShowingEmailEditor(respondents);

                expect(toastr.warning).toHaveBeenCalledWith('There is no respondent(s) to send. Please search/filter again.');
                expect(validation).toBeFalsy();
            });

            it('should return true with valid respondent data', function() {
                respondents = { data: [{ id: 0 }] };

                var validation = svc.validateShowingEmailEditor(respondents);

                expect(validation).toEqual(true);
            });
        });

        describe('Testing populateRespondents function', function () {
            it('should return respondents list', function () {
                var respondents = [],
                    response = [{ id: 1 }, { id: 2 }],
                    surveyId = 1,
                    selectedList = [],
                    isMockResponse = false;

                var result = svc.populateRespondents(respondents, response, surveyId, selectedList, isMockResponse);

                expect(result.length).toBeGreaterThan(0);
                expect(result[0].respondentDetailPath.indexOf('/response')).toBeGreaterThan(0);

                isMockResponse = true;
                result = svc.populateRespondents(respondents, response, surveyId, selectedList, isMockResponse);

                expect(result[2].respondentDetailPath.indexOf('/test')).toBeGreaterThan(0);
            });
        });

        describe('Testing buildQuestionDictionary function', function () {
            var result, surveyLatestVersion = {};
            it('should return question dictionary', function () {
                surveyLatestVersion = {
                    survey: {
                        topFolder: {
                            childNodes: [
                                {
                                    $type: 'PageDefinition',
                                    questionDefinitions: [
                                        { $type: 'NumericQuestionDefinition', title: { items: [{ text: 'numeric' }] } }, {
                                            $type: 'SingleSelectionQuestionDefinition',
                                            title: { items: [{ text: 'single' }] },
                                            optionList: { options: [{ text: { items: [{ text: 'option 1' }] } }] }
                                        }, {
                                            $type: 'SingleSelectionGridQuestionDefinition',
                                            title: { items: [{ text: 'single grid' }] },
                                            optionList: { options: [{ text: { items: [{ text: 'topic 1' }] } }] },
                                            subQuestionDefinition: {
                                                title: { items: [{ text: 'sub single grid' }] },
                                                optionList: { options: [{ text: { items: [{ text: 'option 1' }] } }] }
                                            }
                                        }, {
                                            $type: 'ShortTextListQuestionDefinition',
                                            title: { items: [{ text: 'short text list' }] },
                                            optionList: { options: [{ text: { items: [{ text: 'topic 1' }] } }] },
                                            subQuestionDefinition: {
                                                title: { items: [{ text: 'sub short text' }] }
                                            }
                                        }, {
                                            $type: 'not supported'
                                        }
                                    ]
                                },
                                { nodeType: 'ThankYouPage' }
                            ]
                        }
                    }
                };

                result = svc.buildQuestionDictionary(surveyLatestVersion);

                expect(result).not.toEqual(undefined);
            });
        });
    });
})();