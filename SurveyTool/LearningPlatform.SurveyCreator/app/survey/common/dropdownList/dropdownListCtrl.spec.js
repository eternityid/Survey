(function () {
    describe('Testing dropdownListCtrl controller', function () {
        var ctrl,
            $scope,
            $timeout,
            stringUtilSvc;

        beforeEach(function () {
            module('svt');
            inject(function ($rootScope, $controller, $injector) {
                $scope = $rootScope.$new();
                $scope.items = [];

                $timeout = $injector.get('$timeout');
                stringUtilSvc = $injector.get('stringUtilSvc');

                ctrl = $controller('dropdownListCtrl', {
                    $scope: $scope,
                    $timeout: $timeout,
                    stringUtilSvc: stringUtilSvc
                });
            });
        });

        describe('Testing onItemChanged function', function () {
            var item = { dummy: 'dummy' };

            it('should change scope selected item', function () {
                $scope.onItemChanged = jasmine.createSpy();
                $scope.selectedItem = { dummy: 'dummy1' };

                ctrl.onItemChanged(item);
                $timeout.flush();

                expect($scope.selectedItem.dummy).toEqual('dummy');
                expect($scope.onItemChanged).toHaveBeenCalled();
            });
        });

        describe('Testing getItemTitle function', function () {
            var item = { title: '<strong>Column name</strong>' },
                result;

            beforeEach(function () {
                $scope.columnName = 'title';
            });

            it('should return column name when column alias does not exist', function () {
                $scope.aliasColumnName = undefined;

                result = ctrl.getItemTitle(item);

                expect(result).toEqual('Column name');
            });

            it('should return column name when column name and alias are same', function () {
                $scope.aliasColumnName = 'alias';
                item.alias = 'Column name';

                result = ctrl.getItemTitle(item);

                expect(result).toEqual('Column name');
            });

            it('should return column name and alias when column name and alias are not same', function () {
                $scope.aliasColumnName = 'alias';
                item.alias = 'Column alias';

                result = ctrl.getItemTitle(item);

                expect(result).toEqual('Column name (Column alias)');
            });
        });
    });
})();