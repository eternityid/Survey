(function () {
    'use strict';

    angular
        .module('svt')
        .controller('respondentDetailDialogCtrl', respondentDetailDialogCtrl);

    respondentDetailDialogCtrl.$inject = [
        '$scope', '$filter', '$modalInstance', 'respondentListSvc',
        'errorHandlingSvc', 'respondentDetailDialogDataSvc', 'modalData', 'questionConst', 'keyCode'
    ];

    function respondentDetailDialogCtrl($scope, $filter, $modalInstance, respondentListSvc,
        errorHandlingSvc, respondentDetailDialogDataSvc, modalData, questionConst, keyCode) {
        $scope.closeMe = closeMe;
        $scope.getAnswerAsTitle = getAnswerAsTitle;

        init();

        function init() {
            $scope.respondentDetail = { //TODO: why do we need to use $scope instead of view model here?
                respondent: {}
            };
            respondentDetailDialogDataSvc.getRespondentDetail(modalData.surveyId, modalData.respondentId, modalData.isTestMode).$promise.then(function (result) {
                $scope.respondentDetail.link = modalData.surveyIsPublished ?
                    result.link : 'Survey link just appear after survey had been published';
                $scope.respondentDetail.respondent = result.respondent;
                var responseStatus = result.respondent.responseStatus;
                $scope.respondentDetail.respondent.responseStatus = respondentListSvc.getStatusDisplay(responseStatus);
                $scope.respondentDetail.respondent.detailCustomColumns = [];
                if (result.respondent.customColumns) {
                    var detailCustomColumns = JSON.parse(result.respondent.customColumns);
                    for (var key in detailCustomColumns) {
                        $scope.respondentDetail.respondent.detailCustomColumns.push({
                            key: key,
                            value: detailCustomColumns[key]
                        });
                    }
                }
                if (responseStatus !== 'NotTaken') {
                    $scope.answer = angular.fromJson(result.result);
                    $scope.questionDictionary = modalData.questionDictionary;
                    buildDisplayedQuestionAnswers();
                }

                getModalBody(angular.element(document.querySelector(".modal")));
                $(window).resize(function () {
                    return getModalBody(angular.element(document.querySelector(".modal")));
                });

                $(document).keyup(function (keyEvent) {
                    if (keyEvent.which === keyCode.escape) {
                        angular.element(document.querySelector('body').css('overflow', 'scroll'));
                    }
                });
                angular.element(document.querySelector('body')).css('overflow', 'hidden');

            }, function (error) {
                errorHandlingSvc.manifestError('Getting respondent was not successful.', error);
            });
        }

        function getModalBody(modal) {
            var body, header, headerHeight, contentHeight, modalHeight, marginBottom;
            marginBottom = 200;
            header = angular.element(document.querySelector(".modal-header", modal));
            body = angular.element(document.querySelector(".modal-body", modal));
            modalHeight = parseInt(modal.css("height"));
            headerHeight = parseInt(header.css("height")) + parseInt(header.css("padding-top")) + marginBottom;
            contentHeight = modalHeight - headerHeight;
            body.css("max-height", "" + contentHeight + "px");
        }

        function buildDisplayedQuestionAnswers() {
            $scope.respondentDetail.questionAnswers = [];
            Object.keys($scope.questionDictionary).forEach(function (key) {
                var displayedQuestion = angular.copy($scope.questionDictionary[key]);
                displayedQuestion.answer = getAnswerAsTitle(key);
                $scope.respondentDetail.questionAnswers.push(displayedQuestion);
            });
            $scope.respondentDetail.questionAnswers.sort(function (question1, question2) {
                return question1.position - question2.position;
            });
        }

        function closeMe() {
            $modalInstance.dismiss('cancel');
            angular.element(document.querySelector('body')).css('overflow', 'scroll');
        }

        function getAnswerAsTitle(questionAlias) {
            var question = $scope.questionDictionary[questionAlias];
            var answerAsAliases = getAnswerAsAlias(question, questionAlias);
            if (!answerAsAliases) return null;

            switch (question.$type) {
                case questionConst.questionTypes.numeric:
                case questionConst.questionTypes.shortText:
                case questionConst.questionTypes.longText:
                    return answerAsAliases;
                case questionConst.questionTypes.date:
                    return $filter('dateFormatFilter')(answerAsAliases);
                case questionConst.questionTypes.singleSelection:
                    return getOtherTextOrOptionTitle(question, answerAsAliases);
                case questionConst.questionTypes.rating:
                case questionConst.questionTypes.scale:
                case questionConst.questionTypes.netPromoterScore:
                case questionConst.questionTypes.pictureSingleSelection:
                    return question.options[answerAsAliases].title;
                case questionConst.questionTypes.multipleSelection:
                case questionConst.questionTypes.pictureMultipleSelection:
                    var answerTitles = [];
                    answerAsAliases.forEach(function (item) {
                        answerTitles.push(getOtherTextOrOptionTitle(question, item));
                    });

                    return answerTitles.join(', ');
                default:
                    return null;
            }
        }

        function getAnswerAsAlias(question, questionAlias) {
            if (question.$type === questionConst.questionTypes.multipleSelection ||
                question.$type === questionConst.questionTypes.pictureMultipleSelection) return $scope.answer[questionAlias + ':multi'];
            if (question.$type === questionConst.questionTypes.numeric) return $scope.answer[questionAlias + ':number'];
            if (question.$type === questionConst.questionTypes.date) return $scope.answer[questionAlias + ':date'];
            return $scope.answer[questionAlias];
        }

        function getOtherTextOrOptionTitle(question, answerAsAliases) {
            var answerText = '';
            if (question.options[answerAsAliases].hasOwnProperty('otherQuestionAlias')) {
                answerText = $scope.answer[question.options[answerAsAliases].otherQuestionAlias];
                if (answerText === null || !answerText.length) {
                    answerText = question.options[answerAsAliases].title;
                }
            }
            else {
                answerText = question.options[answerAsAliases].title;
            }
            return answerText;
        }
    }
})();