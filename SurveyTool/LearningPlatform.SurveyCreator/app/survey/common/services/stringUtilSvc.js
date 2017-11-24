(function () {
    'use strict';

    angular
        .module('svt')
        .service('stringUtilSvc', stringUtilSvc);

    function stringUtilSvc() {
        var service = {
            truncateByWordAmount: truncateByWordAmount,
            truncateByCharAmount: truncateByCharAmount,
            isEmpty: isEmpty,
            isEmptyFromHtml: isEmptyFromHtml,
            haveAnyHtmlTagFrom: haveAnyHtmlTagFrom,
            isNotEmpty: isNotEmpty,
            removeRedundantSpaces: removeRedundantSpaces,
            capitalizeEachWord: capitalizeEachWord,
            getPlainText: getPlainText,
            getNumberInString: getNumberInString,
            convertStringToBool: convertStringToBool,
            containsSpecialCharacters: containsSpecialCharacters,
            isEquals: isEquals,
            removeInvalidFileNameCharacters: removeInvalidFileNameCharacters,
            countWordsInString: countWordsInString,
            formatByArray: formatByArray,
            addHTMLParagraphTagWrapper: addHTMLParagraphTagWrapper,
            removeHTMLParagraphTag: removeHTMLParagraphTag,
            removeHTMLBreakTag: removeHTMLBreakTag
        };

        return service;

        function truncateByWordAmount(sourceValue, numberOfWords, appendValue) {
            if (!sourceValue) return sourceValue;
            var words = 0;
            var result = '';
            for (var index = 0; index < sourceValue.length; index++) {

                result += sourceValue[index];
                if (sourceValue[index] !== " " && sourceValue[index + 1] === " ")
                    words++;
                if (words >= numberOfWords) break;
            }

            var title = removeRedundantSpaces(sourceValue);
            var titleArray = String(title).split(" ");

            return result + (titleArray.length > numberOfWords ? appendValue : '');
        }

        function truncateByCharAmount(sourceValue, numberOfChars, appendValue) {
            if (!sourceValue) return '';
            var result = sourceValue.substr(0, numberOfChars);
            return result + (result.length < sourceValue.length && sourceValue.length > 0 ? appendValue : '');
        }

        function isEmpty(value) {
            return value === null || value === undefined || 0 === String(value).trim().length;
        }

        function isNotEmpty(value) {
            return !isEmpty(value);
        }

        function isEmptyFromHtml(value) {
            function htmlToPlaintext(text) {
                return angular.isString(text) ? text.replace(/<[^>]+>/gm, '').replace(/&nbsp;/gi, ' ') : '';
            }

            return isEmpty(htmlToPlaintext(value));
        }

        function haveAnyHtmlTagFrom(source, htmlTags) {
            for (var htmlTagIndex  in htmlTags) {
                var htmlTag = htmlTags[htmlTagIndex];
                var htmlTagList = angular.element(source).find(htmlTag);
                var filteredHtmlTagList = filterFollowHtmlTag(htmlTagList, htmlTag);
                if (filteredHtmlTagList.length) return true;
            }
            return false;

            function filterFollowHtmlTag(htmlTagList, htmlTag) {
                switch (htmlTag) {
                    case 'img':
                        return htmlTagList.filter(function (index) {
                            return $(this).attr('src') !== undefined;
                        });
                    case 'video':
                        return htmlTagList.filter(function (index) {
                            return $('source', this).attr('src') !== undefined;
                        });
                    default:
                        break;
                }
                return [];
            }
        }

        function removeRedundantSpaces(sourceValue) {
            return sourceValue.replace(/\s+/g, " ").trim();
        }

        function capitalizeEachWord(value, separator) {
            var letters = value.split(separator);
            letters = letters.map(function (letter) {
                return letter.charAt(0).toUpperCase() + letter.slice(1);
            });
            return letters.join(' ');
        }

        function getPlainText(sourceValue) {
            var tempValue = sourceValue;
            if (!tempValue) return '';

            if (!angular.isString(tempValue)) tempValue = tempValue.toString();
            return tempValue.replace(/<[^>]+>/gm, '').replace(/&nbsp;/g, ' ').replace(/(?:\r\n|\r|\n)/g, ' ');
        }

        function getNumberInString(value) {
            var replacedValue = value.replace(/[^0-9\.]/g, '');
            return replacedValue ? Number(replacedValue) : null;
        }

        function convertStringToBool(value) {
            if (!value) return null;
            if (typeof value !== 'string') return null;
            if (value.toLowerCase() === 'true' || value.toLowerCase() === '1' || value.toLowerCase() === 'on') return true;
            return false;
        }

        function containsSpecialCharacters(inputString) {
            return !/^[a-zA-Z$\d_][a-zA-Z\d_]*$/.test(inputString);
        }

        function isEquals(str1, str2) {
            str1 = String(str1);
            str2 = String(str2);
            if (isEmpty(str1) && isEmpty(str2)) return true;
            return !isEmpty(str1) && !isEmpty(str2) && str1.toLowerCase().trim() === str2.toLowerCase().trim();
        }

        function removeInvalidFileNameCharacters(value) {
            return value ? value.replace(/[^a-zA-Z0-9 \-\_]/g, "").trim() : value;
        }

        function countWordsInString(inputString) {
            return inputString.trim().split(/\s+/).length;
        }

        function formatByArray(template, values) {
            if (!values) return template;
            var returnValue = template;
            values.forEach(function (value, index) {
                returnValue = returnValue.replace(
                    new RegExp("\\{" + index + "\\}", "g"), value);
            });
            return returnValue;
        }

        function addHTMLParagraphTagWrapper(value) {
            return '<p>' + value + '</p>';
        }

        function removeHTMLParagraphTag(value) {
            return value.replace(/<p+>/igm, "").replace(/<\/p+>/igm, "");
        }

        function removeHTMLBreakTag(value) {
            return value.replace(/<br \/>/igm, "");
        }
    }
})();