(function () {
    angular.module('svt')
        .constant('reportConst', {
            paging: {
                level0: 0,
                level1: 10,
                level2: 50,
                level3: 100,
                level4: 200,
                level5: 'all'
            },
            keyCode: {
                letterP: 80
            },
            chartTitle: {
                size: {
                    view: '16px',
                    print: '26px'
                },
                margin: 30
            }
        });
})();