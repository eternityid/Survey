(function() {
    angular.module('svt').factory('surveyListSvc', surveyListSvc);
    surveyListSvc.$inject = ['$timeout', 'surveySvc', 'stringUtilSvc', 'dateUtilSvc'];

    function surveyListSvc($timeout, surveySvc, stringUtilSvc, dateUtilSvc) {
        var surveyStatus = surveySvc.surveyStatus;
        var service = {
            getDefaultPaging: getDefaultPaging,
            getDefaultSurveys: getDefaultSurveys,
            getSearchForm: getSearchForm,
            getCountForm: getCountForm,
            getDefaultSearchModel: getDefaultSearchModel,
            buildSearchSurveysModel: buildSearchSurveysModel,
            getSearchStatusForCheckBoxList: getSearchStatusForCheckBoxList,
            getStatusForSearchModel: getStatusForSearchModel,
            getDefaultForSearchStatusModel: getDefaultForSearchStatusModel,
            validateSearchData: validateSearchData
        };
        return service;

        function getDefaultPaging() {
            return {
                $type: "LearningPlatform.Models.Paging, LearningPlatform.Api",
                start: 0,
                limit: 10,
                hashNext: false
            };
        }

        function getDefaultSurveys() {
            return { data: [] };
        }

        function getSearchForm(surveySearchModel , paging) {
            return {
                $type: "LearningPlatform.Models.SurveySearchForm, LearningPlatform.Api",
                searchModel: surveySearchModel,
                paging: paging
            };
        }

        function getCountForm(searchString) {
            return {
                $type: "LearningPlatform.Models.SurveyCountForm, LearningPlatform.Api",
                searchString: searchString,
                count: 0
            };
        }

        function getDefaultSearchModel() {
            return {
                searchString: '',
                createdDate: {
                    'conditionOperator': '',
                    'datetimeFrom': '',
                    'datetimeTo': ''
                },
                modifiedDate: {
                    'conditionOperator': '',
                    'datetimeFrom': '',
                    'datetimeTo': ''
                },
                status: initialStatusForSearchModel(),
                showDeletedSurveys: false,
                paging: getDefaultPaging()
            };
        }

        function buildSearchSurveysModel(searchModel) {
            return {
                createdDateOperator: searchModel.createdDate.conditionOperator,
                createdDate: searchModel.createdDate.datetimeFrom,
                createdDateTo: searchModel.createdDate.datetimeTo,
                modifiedDateOperator: searchModel.modifiedDate.conditionOperator,
                modifiedDate: searchModel.modifiedDate.datetimeFrom,
                modifiedDateTo: searchModel.modifiedDate.datetimeTo,
                searchString: searchModel.searchString,
                status: searchModel.status,
                showDeletedSurveys: searchModel.showDeletedSurveys
            };
        }

        function getStatusForSearchModel(searchStatusModel) {
            var result = initialStatusForSearchModel();
            $(searchStatusModel).each(function(index, value) {
                var selectedValue = value.id;
                switch (selectedValue) {
                case surveyStatus.NEW:
                    result.New = true;
                    break;
                case surveyStatus.OPEN:
                    result.Open = true;
                    break;
                case surveyStatus.CLOSED:
                    result.Closed = true;
                    break;
                case surveyStatus.TEMPORARILY_CLOSED:
                    result.TemprorarilyClosed = true;
                    break;
                }
            });
            return result;
        }

        function getSearchStatusForCheckBoxList() {
            return [{ id: surveyStatus.NEW, label: surveySvc.getStatusDisplay(surveyStatus.NEW)},
                    { id: surveyStatus.OPEN, label: surveySvc.getStatusDisplay(surveyStatus.OPEN)},
                    { id: surveyStatus.TEMPORARILY_CLOSED, label: surveySvc.getStatusDisplay(surveyStatus.TEMPORARILY_CLOSED) },
                    { id: surveyStatus.CLOSED, label: surveySvc.getStatusDisplay(surveyStatus.CLOSED) }];
        }

        function initialStatusForSearchModel() {
            return {
                New: true,
                Open: true,
                Closed: true,
                TemprorarilyClosed: true
            };
        }

        function getDefaultForSearchStatusModel() {
            return [{ id: surveyStatus.NEW },
                { id: surveyStatus.OPEN },
                { id: surveyStatus.CLOSED },
                { id: surveyStatus.TEMPORARILY_CLOSED }
            ];
        }

        function validateSearchData(searchData) {
            var dateFormat = "MM/DD/YYYY";
            if (searchData.createdDateOperator !== '') {
                if (stringUtilSvc.isEmpty(searchData.createdDate)) {
                    toastr.error('Created date is required.');
                    return false;
                }
                if (!dateUtilSvc.isDateString(searchData.createdDate, dateFormat)) {
                    toastr.error('Created date is not a date. Please enter again.');
                    return false;
                }
                if (searchData.createdDateOperator === 'BETWEEN') {
                    if (stringUtilSvc.isEmpty(searchData.createdDateTo)) {
                        toastr.error('Created Time Limit To Date is required.');
                        return false;
                    }

                    if (!dateUtilSvc.isDateString(searchData.createdDateTo, dateFormat)) {
                        toastr.error('Created Time To Date is not a date. Please enter again.');
                        return false;
                    }

                    if (dateUtilSvc.compareDateTime(searchData.createdDate, searchData.createdDateTo, dateFormat) === 1) {
                        toastr.error('The Range of selected Created Dates is invalid. Please enter again.');
                        return false;
                    }

                }
            }
            if (searchData.modifiedDateOperator !== '') {
                if (stringUtilSvc.isEmpty(searchData.modifiedDate)) {
                    toastr.error('Modified date is required.');
                    return false;
                }
                if (!dateUtilSvc.isDateString(searchData.modifiedDate, dateFormat)) {
                    toastr.error('Modified date is not a date. Please enter again.');
                    return false;
                }
                if (searchData.modifiedDateOperator === 'BETWEEN') {
                    if (stringUtilSvc.isEmpty(searchData.modifiedDateTo)) {
                        toastr.error('Modified Time Limit To Date is required.');
                        return false;
                    }

                    if (!dateUtilSvc.isDateString(searchData.modifiedDateTo, dateFormat)) {
                        toastr.error('Modified Time To Date is not a date. Please enter again.');
                        return false;
                    }

                    if (dateUtilSvc.compareDateTime(searchData.modifiedDate, searchData.modifiedDateTo, dateFormat) === 1) {
                        toastr.error('The Range of selected Modified Dates is invalid. Please enter again.');
                        return false;
                    }
                }
            }
            return true;
        }
    }
})();