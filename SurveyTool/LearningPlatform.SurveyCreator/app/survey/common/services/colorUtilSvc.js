(function () {
    angular.module('svt').service('colorUtilSvc', ColorUtilSvc);

    function ColorUtilSvc() {
        var service = {
            isValidColor: isValidColor
        };
        return service;

        function isValidColor(colorValue) {
            if (!colorValue) return false;

            var image = document.createElement("img");
            image.style.color = "rgb(0, 0, 0)";
            image.style.color = colorValue;
            if (image.style.color !== "rgb(0, 0, 0)") {
                return true;
            }

            image.style.color = "rgb(255, 255, 255)";
            image.style.color = colorValue;
            return image.style.color !== "rgb(255, 255, 255)";
        }
    }
})();