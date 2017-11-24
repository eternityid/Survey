(function () {
    'use strict';
    var apiUrl = '/* @echo API_URL *//api';
    var surveyTestUrl = '/* @echo SURVEY_TEST_URL *//survey/test';
    var surveyUrl = '/* @echo SURVEY_URL */';

    var authorityUrl = '/* @echo AUTHORITY_URL */';

    var azureStoragePath = '/* @echo AZURE_STORAGE_PATH */';
    var azureStorageContainer = '/* @echo CONTAINER_AZURE_STORAGE */';

    var hrToolConfig = {
        host: '/* @echo HRTOOL_URL */',
        showRecruitment: '/* @echo SHOW_HRTOOL_LINK */'.toLowerCase() === 'true'
    };

    /* @ifndef API_URL */
    apiUrl = 'https://localhost:44302/api';
    surveyTestUrl = 'https://localhost:44304/survey/test';
    surveyUrl = 'https://localhost:44304';
    /*@endif*/

    /* @ifndef AUTHORITY_URL */
    authorityUrl = 'https://localhost:44300/';
    /*@endif*/

    /* @ifndef AZURE_STORAGE_PATH */
    azureStoragePath = 'https://surveytoolstorages.blob.core.windows.net/';
    /*@endif*/

    /* @ifndef CONTAINER_AZURE_STORAGE */
    azureStorageContainer = 'development';
    /*@endif*/

    /* @ifndef HRTOOL_URL */
    hrToolConfig.host = 'http://localhost:10924';
    /*@endif*/

    /* @ifndef SHOW_HRTOOL_LINK */
    hrToolConfig.showRecruitment = false;
    /*@endif*/

    var resourceUrl = apiUrl.substring(0, apiUrl.lastIndexOf('api'));

    angular.module('svt')
        .constant('host', apiUrl)
        .constant('adminUserApiUrl', authorityUrl+'api')
        .constant('authorityUrl', authorityUrl)
        .constant('clientAppUrl', CLIENTAPP_BASEPATH)
        .constant('testHost', surveyTestUrl)
        .constant('httpStatusCode', {
            preConditionFail: 412,
            notModified: 304
        })
        .constant('baseHost', surveyUrl)
        .constant('hrToolConfig', hrToolConfig)
        .constant('uploadTempPath', resourceUrl + '/Content/UploadFiles/Temp')
        .constant('fileStatus', {
            create: 'create',
            update: 'update',
            remove: 'remove'
        })
        .constant('settingConst', {
            delayTime: 30000,
            surveyPictureBaseAzurePath: azureStoragePath + azureStorageContainer,
            surveyPictureBasePath: resourceUrl + '/Content/Surveys',
            picture: {
                maxFileSize: 500,
                maxWidthHeight: 1024,
                maxOption: 26,
                fileType: 'jpg,jpeg,png,bmp,gif'
            },
            question: {
                alias: { maxlength: 30 },
                numericQuestion: {
                    stepDefault: 1,
                    decimalPlaceDefault: 0,
                    decimalPlaceMaxValue: 10
                }
            },
            questionTypes: {
                OpenEndedShortTextQuestionDefinition: {
                    name: 'Short Text',
                    code: 0,
                    value: 'OpenEndedShortTextQuestionDefinition'
                },
                OpenEndedLongTextQuestionDefinition: {
                    name: 'Long Text',
                    code: 1,
                    value: 'OpenEndedLongTextQuestionDefinition'
                },
                SingleSelectionQuestionDefinition: {
                    name: 'Single Selection',
                    code: 2,
                    value: 'SingleSelectionQuestionDefinition'
                },
                MultipleSelectionQuestionDefinition: {
                    name: 'Multiple Selection',
                    code: 3,
                    value: 'MultipleSelectionQuestionDefinition'
                },
                InformationDefinition: {
                    name: 'Information',
                    code: 4,
                    value: 'InformationDefinition'
                },
                NumericQuestionDefinition: {
                    name: 'Numeric',
                    code: 5,
                    value: 'NumericQuestionDefinition'
                },
                NetPromoterScoreQuestionDefinition: {
                    name: 'Net Promoter Score \u00AE',
                    code: 6,
                    value: 'NetPromoterScoreQuestionDefinition'
                },
                ScaleQuestionDefinition: {
                    name: 'Scale',
                    code: 7,
                    value: 'ScaleQuestionDefinition'
                },
                GridQuestionDefinition: {
                    name: 'List',
                    code: 8,
                    value: 'GridQuestionDefinition'
                },
                SingleSelectionGridQuestionDefinition: {
                    name: 'Single Selection Grid',
                    code: 9,
                    value: 'SingleSelectionGridQuestionDefinition'
                },
                MultipleSelectionGridQuestionDefinition: {
                    name: 'Multiple Selection Grid',
                    code: 10,
                    value: 'MultipleSelectionGridQuestionDefinition'
                },
                RatingQuestionDefinition: {
                    name: 'Rating',
                    code: 11,
                    value: 'RatingQuestionDefinition'
                },
                SingleSelectionPictureQuestionDefinition: {
                    name: 'Picture Single Selection',
                    code: 12,
                    value: 'PictureSingleSelectionQuestionDefinition'
                },
                MultipleSelectionPictureQuestionDefinition: {
                    name: 'Picture Multiple Selection',
                    code: 13,
                    value: 'PictureMultipleSelectionQuestionDefinition'
                },
                ShortTextListQuestionDefinition: {
                    name: 'Short Text List',
                    code: 14,
                    value: 'ShortTextListQuestionDefinition'
                },
                LongTextListQuestionDefinition: {
                    name: 'Long Text List',
                    code: 15,
                    value: 'LongTextListQuestionDefinition'
                },
                ScaleGridQuestionDefinition: {
                    name: 'Scale Grid',
                    code: 16,
                    value: 'ScaleGridQuestionDefinition'
                },
                RatingGridQuestionDefinition: {
                    name: 'Rating Grid',
                    code: 17,
                    value: 'RatingGridQuestionDefinition'
                },
                DateQuestionDefinition: {
                    name: 'Date',
                    code: 18,
                    value: 'DateQuestionDefinition'
                }
            },
            optionsMaskType: {
                AllOptions: 0,
                OptionsShown: 1,
                OptionsNotShown: 2,
                OptionsSelected: 3,
                OptionsNotSelected: 4,
                Custom: 5
            },
            report: {
                elementType: {
                    chart: 'ReportChartElement',
                    table: 'ReportTableElement',
                    text: 'ReportTextElement'
                },
                chartQuestionGroups: {
                    selection: 0,
                    gridSelection: 1,
                    likert: 2
                },
                chartType: {
                    column: 'column',
                    bar: 'bar',
                    pie: 'pie',
                    line: 'line',
                    area: 'area',
                    stackedArea: 'stacked_area',
                    stackedColumn: 'stacked_column',
                    stackedBar: 'stacked_bar',
                    stackedPercentageColumn: 'stacked_percentage_column',
                    stackedPercentageBar: 'stacked_percentage_bar'
                },
                netPromotorScoreQuestionLabels: {
                    promoters: 'Promoters',
                    passives: 'Passives',
                    detractors: 'Detractors'
                },
                a4: {
                    height: 1093,
                    width: 794
                },
                spaceInA4: {
                    width: 680,
                    height: 981
                },
                defaultElementSize: { width: 600, height: 350 },
                defaultFreeTextSize: { width: 500, height: 150 },
                maxzIndexToReset: 10000,
                minElementSize: 20
            },
            result: {
                columnWidth: {
                    threeCols: 33,
                    twoCols: 50,
                    oneCol: 66,
                    fullWidth: 100
                },
                pie: {
                    minSize: 150,
                    labelDefaultWidth: 300,
                    defaultDistanceFromLabelsToPieEdge: 30,
                    truncate: {
                        minWordNumber: 10,
                        averageWordNumber: 15,
                        maxWordNumber: 30,
                        safeWordNumber: 100
                    }
                },
                area: {
                    truncate: {
                        defaultNumber: 20
                    }
                }
            },
            ckeditor: {
                toolbar: {
                    shortItems: ["basicstyles", "paragraph", "links", "styles", "insert", "document", "inserthelpergroup"],
                    optionShortItems: ["basicstyles", "links", "document", "inserthelpergroup"],
                    items: [
                        { name: "basicstyles", items: ["Bold", "Italic", "Underline"] },
                        { name: "paragraph", items: ["Blockquote"] },
                        { name: "links", items: ["Link"] },
                        { name: "styles", items: ["Format", "FontSize", "TextColor"] },
                        { name: "insert", items: ["FileInsertCustomizeButton"] },
                        { name: "document", items: ['Sourcedialog'] },
                        { name: "inserthelpergroup", items: ['InsertHelperGroup'] }
                    ],
                    type: {
                        short: 'short',
                        optionShort: 'option-short'
                    }
                },
                optionIdPrefix: 'svt-option-'
            },
            httpMethod: {
                preConditionFail: 412
            },
            editableLabelTypes: {
                questionName: {
                    id: 0
                },
                order: {
                    id: 1,
                    originalContent: 'No.'
                },
                answer: {
                    id: 2,
                    originalContent: 'Answer'
                },
                totalRespondents: {
                    id: 3,
                    originalContent: 'Total Respondents'
                },
                totalResponses: {
                    id: 4,
                    originalContent: 'Total Responses'
                },
                totalTopicRespondents: {
                    id: 5,
                    originalContent: 'Total Respondents'
                },
                totalTopicResponses: {
                    id: 6,
                    originalContent: 'Total Responses'
                },
                average: {
                    id: 7,
                    originalContent: 'Average'
                },
                min: {
                    id: 8,
                    originalContent: 'Min'
                },
                max: {
                    id: 9,
                    originalContent: 'Max'
                },
                optionHeading: {
                    id: 10,
                    originalContent: 'Option'
                },
                topicHeading: {
                    id: 11,
                    originalContent: 'Topic'
                },
                response: {
                    id: 12,
                    originalContent: 'Response'
                },
                percentage: {
                    id: 13,
                    originalContent: 'Percentage'
                },
                topic: {
                    id: 14
                },
                option: {
                    id: 15
                }
            }
        })
        .constant('carryOverQuestionConst', {
            simpleSelectionQuestionOption: 0,
            gridSelectionQuestionOption: 1,
            gridSelectionQuestionTopic: 2
        })
        .constant('accessRightsConst', {
            action: {
                full: 1,
                write: 2,
                noaccess: 3
            },
            accessRightsTypes: [
                { id: 1, name: 'Full' },
                { id: 2, name: 'Write' },
                { id: 3, name: 'No access' }
            ]
        })
        .constant('expressionBuilderConst', {
            logicalOperators: {
                and: {
                    value: 0,
                    name: 'AND'
                },
                or: {
                    value: 1,
                    name: 'OR'
                }
            },
            operators: {
                isEqual: {
                    value: 0,
                    name: 'Is Equal To'
                },
                isNotEqual: {
                    value: 1,
                    name: 'Is Not Equal To'
                },
                isSelected: {
                    value: 2,
                    name: 'Is Selected'
                },
                isNotSelected: {
                    value: 3,
                    name: 'Is Not Selected'
                },
                isShown: {
                    value: 4,
                    name: 'Is Shown'
                },
                isNotShown: {
                    value: 5,
                    name: 'Is Not Shown'
                },
                greaterThan: {
                    value: 6,
                    name: 'Is Greater Than'
                },
                greaterThanOrEqual: {
                    value: 7,
                    name: 'Is Greater Than Or Equal To'
                },
                lessThan: {
                    value: 8,
                    name: 'Is Less Than'
                },
                lessThanOrEqual: {
                    value: 9,
                    name: 'Is Less Than Or Equal To'
                },
                isTrue: {
                    value: 10,
                    name: 'Is True'
                },
                isFalse: {
                    value: 11,
                    name: 'Is False'
                },
                contains: {
                    value: 12,
                    name: 'Contains'
                },
                notContains: {
                    value: 13,
                    name: 'Not Contains'
                },
                custom: {
                    value: 14,
                    name: 'Custom'
                }
            }
        })
        .constant('dateFormatConfig', {
            date: 'MMM dd, yyyy',
            dateTime: 'MMM dd, yyyy hh:mm a'
        });
})();