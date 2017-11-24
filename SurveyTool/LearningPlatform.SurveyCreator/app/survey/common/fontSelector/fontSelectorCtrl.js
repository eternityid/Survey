(function() {
    angular
        .module('svt')
        .controller('fontSelectorCtrl', fontSelectorCtrl);

    fontSelectorCtrl.$inject = ['fontSelectorSvc', '$scope'];

    function fontSelectorCtrl(fontSelectorSvc, $scope) {
        var vm = this;
        vm.model = {};
        vm.init = init;
        vm.selectFont = selectFont;

        vm.init();
        function init() {
            vm.model.availableFonts = fontSelectorSvc.getAvailableFonts();
            vm.ngModel = $scope.ngModel;

            setupOnChangeFont();

            function setupOnChangeFont() {
                $scope.$watch('vm.ngModel.font', function() {
                    vm.model.displayedFontName = fontSelectorSvc.getDisplayFontName(vm.ngModel.font);
                });
            }
        }

        function selectFont(font) {
            vm.ngModel.font = font.stack;
            $scope.ngModel.font = vm.ngModel.font;
            $scope.onFontChange();
        }
    }
})();