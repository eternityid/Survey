(function() {
    angular.module('svt').service('arrayUtilSvc', arrayUtilSvc);

    function arrayUtilSvc() {
        var service = {
            getPositionSpecification: getPositionSpecification,
            isValidArray: isValidArray,
            isArrayHasElement: isArrayHasElement,
            isElementHasSubElement: isElementHasSubElement,
            hasValueIn: hasValueIn,
            getItem: getItem,
            appendSuffixToPrimitiveValue: appendSuffixToPrimitiveValue,
            pushPrimitiveUniqueElement: pushPrimitiveUniqueElement,
            indexOfWithAttr: indexOfWithAttr,
            togglePrimitiveElement: togglePrimitiveElement,
            removeDuplicatedPrimitiveElements: removeDuplicatedPrimitiveElements
        };
        return service;

        function getPositionSpecification(ids, position) {
            if (ids.length === 0 || position === -1) return null;
            var hasPreviousElement, hasNextElement;

            if (position === 0) {
                hasPreviousElement = false;
                hasNextElement = position === ids.length - 1 ? false : true;
            } else if (position === ids.length - 1) {
                hasPreviousElement = true;
                hasNextElement = false;
            } else {
                hasPreviousElement = hasNextElement = true;
            }

            return {
                hasPreviousElement: hasPreviousElement,
                hasNextElement: hasNextElement
            };
        }

        function isValidArray(object) {
            if (typeof object !== 'object' || object === null || object.length === undefined) return false;
            return true;
        }

        function isArrayHasElement(object) {
            return isValidArray(object) && object.length > 0;
        }

        function isElementHasSubElement(array) {
            return array.some(function(element) {
                return isArrayHasElement(element) === true;
            });
        }

        function hasValueIn(values, value) {
            return values.some(function(val) { return val === value; });
        }

        function getItem(items, callback) {
            if (!items) return null;
            var item;
            for (var i = 0; i < items.length; i++) {
                item = callback(items[i]);
                if (item) return item;
            }
            return null;
        }

        function appendSuffixToPrimitiveValue(values, suffix) {
            return values.map(function(value) {
                return value + suffix;
            });
        }

        function pushPrimitiveUniqueElement(array, element) {
            if (array.indexOf(element) < 0) array.push(element);
        }

        function indexOfWithAttr(array, attr, value) {
            for (var i = 0; i < array.length; i += 1) {
                if (array[i][attr] === value) {
                    return i;
                }
            }
            return -1;
        }

        function togglePrimitiveElement(array, element) {
            var index = array.indexOf(element);
            if (index >= 0) {
                array.splice(index, 1);
            } else {
                array.push(element);
            }
        }

        function removeDuplicatedPrimitiveElements(array) {
            return array.filter(function (element, index) {
                return array.indexOf(element) === index;
            });
        }
    }
})();