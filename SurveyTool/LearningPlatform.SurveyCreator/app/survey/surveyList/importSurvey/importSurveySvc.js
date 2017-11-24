(function() {
    angular.module('svt').service('importSurveySvc', importSurveySvc);
    importSurveySvc.$inject = ['stringUtilSvc'];

    function importSurveySvc(stringUtilSvc) {
        var service = {
            getPlaceHolders: getPlaceHolders,
            validate: validate
        };
        return service;

        function getPlaceHolders() {
            return {
                surveyTitle: {
                    value: 'Survey title',
                    valid: true
                }
            };
        }

        function validate(surveyViewModel, placeHolder) {
            placeHolder.surveyTitle.valid = true;

            if (stringUtilSvc.isEmpty(surveyViewModel.title)) {
                placeHolder.surveyTitle.value = 'Survey title is required';
                placeHolder.surveyTitle.valid = false;
                return placeHolder.surveyTitle.valid;
            }

            if (!surveyViewModel.file) {
                toastr.error('Please choose a file.');
                return false;
            }

            return true;
        }

    }
})();