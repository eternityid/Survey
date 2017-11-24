(function() {
    angular.module('svt').service('domUtilSvc', DomUtilSvc);
    DomUtilSvc.$inject = ['$timeout', '$window'];

    function DomUtilSvc($timeout, $window) {
        var service = {
            focusElement: focusElement,
            selectElementContent: selectElementContent,
            filterKeyWhenTypingDate: filterKeyWhenTypingDate,
            middleElementInScreenById: middleElementInScreenById,
            setFileListIntoDom: setFileListIntoDom
        };

        return service;

        function focusElement(elementId) {
            document.getElementById(elementId).focus();
        }

        function selectElementContent(elementId) {
            var el = document.getElementById(elementId);
            if (el) {
                el.focus();
                // Need to use $timeout to support ie/firefox
                $timeout(function () {
                    var range = document.createRange();
                    range.selectNodeContents(el);
                    var selection = window.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(range);
                }, 0);
            }
        }

        function filterKeyWhenTypingDate(textbox) {
            textbox.keypress(function (e) {
                var charCode = e.which ? e.which : event.keyCode;
                return (charCode > 31 && (charCode < 47 || charCode > 57) ? false : true);
            });
        }

        function middleElementInScreenById(id) {
            var divElement = angular.element(document).find('#' + id);
            if (!divElement || divElement.length === 0) return;

            var maxDivHeight = divElement.innerHeight() > $window.innerHeight ? $window.innerHeight : divElement.innerHeight();
            var scrollableContainers = "html, body";
            angular.element(scrollableContainers).animate({
                scrollTop: divElement.offset().top - ($window.innerHeight / 2) + (maxDivHeight / 2)
            }, 'slow');
        }

        function setFileListIntoDom(elementId, fileList) {
            var el = document.getElementById(elementId);
            if (el) {
                el.files = fileList;
            }
        }
    }
})();