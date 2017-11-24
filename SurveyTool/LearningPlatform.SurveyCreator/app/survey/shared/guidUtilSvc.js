(function () {
    angular
        .module('svt')
        .service('guidUtilSvc', guidUtilSvc);

    guidUtilSvc.$inject = [];

    function guidUtilSvc() {
        var service = {
            createGuid: createGuid
        };

        return service;

        function createGuid() {
            var guidPieces = ['guid'];

            for (var i = 0; i < 8; i++) {
                guidPieces.push(buildGuidPiece());
            }

            return guidPieces.join('-');

            function buildGuidPiece() {
                return Math.floor((1 + Math.random()) * 0x10000)
                  .toString(16)
                  .substring(1);
            }
        }
    }
})();