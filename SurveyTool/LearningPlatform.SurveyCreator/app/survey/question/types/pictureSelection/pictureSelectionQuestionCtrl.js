(function() {
    angular.module('svt').controller('pictureSelectionQuestionCtrl', PictureSelectionQuestionCtrl);

    PictureSelectionQuestionCtrl.$inject = [
        '$scope', '$timeout', 'surveyEditorSvc', 'settingConst'
    ];

    function PictureSelectionQuestionCtrl($scope, $timeout, surveyEditorSvc, settingConst) {

        var heightForPictureInFit = 450;

        var vm = this,
            pictureContainerSize = {
                width: 150,
                height: 150
            };
        vm.model = {
            pictureContainerStyles: {},
            numberOfColsByCss: ''
        };

        vm.init = init;

        init();

        function init() {
            vm.model.question = angular.copy($scope.question);

            resetNumberOfColsByCss();
            var uploadPath = surveyEditorSvc.getPicturePath() + vm.model.question.id + '/';
            parsePicturesProperties();

            parsePictureContainerStyles();
            angular.element(document).ready(function () {
                if (vm.model.question.isScalePictureToFitContainer) {
                    vm.model.pictureContainerStyles.height = heightForPictureInFit;
                }
            });

            return;

            function resetNumberOfColsByCss() {
                var columnCount = vm.model.question.maxPicturesInGrid;
                if (columnCount === 6) {
                    heightForPictureInFit = heightForPictureInFit / 3;
                    vm.model.numberOfColsByCss = "col-xs-12 col-sm-4 col-md-3 col-lg-2";
                }
                else if (columnCount === 4) {
                    heightForPictureInFit = heightForPictureInFit / 2;
                    vm.model.numberOfColsByCss = "col-xs-12 col-sm-6 col-md-4 col-lg-3";
                }
                else if (columnCount === 3) {
                    heightForPictureInFit = heightForPictureInFit / 2;
                    vm.model.numberOfColsByCss = "col-xs-12 col-sm-6 col-md-4 col-lg-4";
                }
                else if (columnCount === 2) {
                    heightForPictureInFit = heightForPictureInFit / 2;
                    vm.model.numberOfColsByCss = "col-xs-12 col-sm-6";
                } else {
                    heightForPictureInFit = heightForPictureInFit / 2;
                    vm.model.numberOfColsByCss = "col-xs-12";
                }
            }

            function parsePicturesProperties() {
                vm.model.question.optionList.options.forEach(function (o) {
                    var image = new Image();
                    var imagePath = (o.pictureName.indexOf('/') > 0 ? settingConst.surveyPictureBaseAzurePath + '/' + o.pictureName : uploadPath + o.pictureName);
                    image.src = o.imagePath = imagePath;

                    $timeout(function () {
                        if (vm.model.question.isScalePictureToFitContainer) {
                            o.width = '';
                            o.height = '';
                            return;
                        }

                        var scaleWidth = image.width >= image.height;
                        if (scaleWidth) {
                            o.width = pictureContainerSize.width;
                            o.height = '';
                        } else {
                            o.width = '';
                            o.height = pictureContainerSize.height;
                        }
                    }, 200);
                });
            }

            function parsePictureContainerStyles() {
                vm.model.pictureContainerStyles = {
                    border: '1px solid antiquewhite',
                    overflowY: 'hidden'
                };
                if (!vm.model.question.isScalePictureToFitContainer) {
                    vm.model.pictureContainerStyles.width = pictureContainerSize.width + 'px';
                    vm.model.pictureContainerStyles.height = pictureContainerSize.height + 'px';
                }
            }
        }
    }
})();