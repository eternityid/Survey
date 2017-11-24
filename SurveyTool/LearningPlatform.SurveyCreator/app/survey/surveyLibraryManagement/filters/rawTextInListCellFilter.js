(function () {
    angular
       .module('svt').filter('rawTextInListCellFilter', RawTextInListCellFilter);

    RawTextInListCellFilter.$inject = ['stringUtilSvc', 'domUtilSvc'];

    function RawTextInListCellFilter(stringUtilSvc, domUtilSvc) {
        return function (htmlText) {
            if (!htmlText) return htmlText;
            var keepImg = true,
                imgWidth = '25px',
                imgHeight = '25px';
            if (keepImg) {
                var div = document.createElement('div');
                var guid = (new Date()).getTime();
                div.innerHTML = htmlText;

                var imgTags = Array.prototype.slice.call(div.getElementsByTagName('img'));
                if (imgTags.length === 0) return stringUtilSvc.getPlainText(htmlText);

                var imgOuterHtmls = [];
                imgTags.forEach(function(img) {
                    if (img.src) {
                        img.style.width = imgWidth;
                        img.style.height = imgHeight;
                    }
                    var span = document.createElement('span');
                    span.innerText = guid;
                    imgOuterHtmls.push(img.outerHTML);
                    img.parentNode.insertBefore(span, img);
                    img.parentNode.removeChild(img);
                });
                var rawText = stringUtilSvc.getPlainText(div.outerHTML);
                imgOuterHtmls.forEach(function (imgOuterHtml) {
                    rawText = rawText.replace(guid, imgOuterHtml);
                });
                return rawText;
            } else {
                return stringUtilSvc.getPlainText(htmlText);
            }
        };
    }
})();