(function () {
    'use strict';
    describe('Testing surveyListSvc service', function () {
        var spinnerUtilSvc, dateUtilSvc, timeout, surveySvc, stringUtilSvc;

        beforeEach(function () {
            module('svt');
            module(function ($provide) {
                spinnerUtilSvc = jasmine.createSpyObj('spinnerUtilSvc', ['showSpinner', 'hideSpinner']);
                stringUtilSvc = jasmine.createSpyObj('stringUtilSvc', ['isEmpty']);
                $provide.value('spinnerUtilSvc', spinnerUtilSvc);

                dateUtilSvc = jasmine.createSpyObj('dateUtilSvc', ['isDateString', 'compareDateTime']);
                $provide.value('dateUtilSvc', dateUtilSvc);
            });
        });

        describe('Testing getDefaultPaging function', function () {
            it('should return default paging', inject(function (surveyListSvc) {
                var result = surveyListSvc.getDefaultPaging();

                expect(result.$type).toEqual('LearningPlatform.Models.Paging, LearningPlatform.Api');
            }));
        });

        describe('Testing getSearchForm function', function () {
            it('should return search form', inject(function (surveyListSvc) {
                var searchString = '',
                    paging = {},
                    result = surveyListSvc.getSearchForm(searchString, paging);

                expect(result.$type).toEqual('LearningPlatform.Models.SurveySearchForm, LearningPlatform.Api');
            }));
        });

        describe('Testing getCountForm function', function () {
            it('should return count form', inject(function (surveyListSvc) {
                var searchString = '',
                    result = surveyListSvc.getCountForm(searchString);

                expect(result.$type).toEqual('LearningPlatform.Models.SurveyCountForm, LearningPlatform.Api');
            }));
        });

        describe('Testing validateSearchData function', function () {
            it('should return false when createdDateOperator is not null', inject(function (surveyListSvc) {
                var result,
                searchData = {
                    createdDateOperator: {},
                    createdDate: null
                };
                result = surveyListSvc.validateSearchData(searchData);
                expect(result).toEqual(false);
            }));

            it('should return false when create date is not date', inject(function (surveyListSvc) {
                var result,
                searchData = {
                    createdDateOperator: {},
                    createdDate: {},
                    dateFormat: {}
                },
                    dateUtilSvc = {};
                result = surveyListSvc.validateSearchData(searchData);
                expect(result).toEqual(false);
            }));

            it('should return false when Create Time Limit is null', inject(function (surveyListSvc) {
                var result,
                searchData = {
                    createdDate: '1/1/2001',
                    createdDateOperator: 'BETWEEN',
                    createdDateTo: null
                };
                dateUtilSvc.isDateString.and.returnValue(true);
                stringUtilSvc.isEmpty.and.returnValue(true);
                result = surveyListSvc.validateSearchData(searchData);
                expect(result).toEqual(false);
            }));

            it('should return true when Create Time Limit is not null', inject(function (surveyListSvc) {
                var result,
                searchData = {
                    createdDate: '1/1/2001',
                    createdDateOperator: 'BETWEEN',
                    createdDateTo: '1/1/2001'
                };
                dateUtilSvc.isDateString.and.returnValue(true);
                stringUtilSvc.isEmpty.and.returnValue(false);
                dateUtilSvc.compareDateTime.and.returnValue(true);
                result = surveyListSvc.validateSearchData(searchData);
                expect(result).toEqual(false);
            }));

            it('should return false when modifiedDateOperator is not null', inject(function (surveyListSvc) {
                var result,
                searchData = {
                    createdDateOperator: '',
                    modifiedDateOperator: 'dummy',
                    modifiedDate: '1/1/2001'
                };
                stringUtilSvc.isEmpty.and.returnValue(true);
                result = surveyListSvc.validateSearchData(searchData);
                expect(result).toEqual(false);
            }));
        });
    });
})();