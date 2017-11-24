(function() {
    angular.module('svt').service('fontSelectorSvc', fontSelectorSvc);

    function fontSelectorSvc() {
        var DEFAULT_WEBSAFE_FONTS = [
                {
                    name: 'Arial',
                    stack: 'Arial, Helvetica Neue, Helvetica, sans-serif'
                },
                {
                    name: 'Brush Script MT',
                    stack: 'Brush Script MT, cursive'
                },
                {
                    name: 'Consolas',
                    stack: 'Consolas, monaco, monospace'
                },
                {
                    name: 'Courier New',
                    stack: 'Courier New, Courier, Lucida Sans Typewriter, Lucida Typewriter, monospace'
                },
                {
                    name: 'Georgia',
                    stack: 'Georgia, Times, Times New Roman, serif'
                },
                {
                    name: 'Helvetica',
                    stack: 'Helvetica Neue, Helvetica, Arial, sans-serif'
                },
                {
                    name: 'Impact',
                    stack: 'Impact, Haettenschweiler, Franklin Gothic Bold, Charcoal, Helvetica Inserat, Bitstream Vera Sans Bold, Arial Black, sans serif'
                },
                {
                    name: 'Lucida Sans Typewriter',
                    stack: 'Lucida Sans Typewriter, Lucida Console, monaco, Bitstream Vera Sans Mono, monospace'
                },
                {
                    name: 'Palatino',
                    stack: 'Palatino, Palatino Linotype, Palatino LT STD, Book Antiqua, Georgia, serif'
                },
                {
                    name: 'Tahoma',
                    stack: 'Tahoma, Verdana, Segoe, sans-serif'
                },
                {
                    name: 'Trebuchet MS',
                    stack: 'Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif'
                },
                {
                    name: 'Verdana',
                    stack: 'Verdana, Geneva, sans-serif'
                },
                {
                    name: 'Times New Roman',
                    stack: 'TimesNewRoman, Times New Roman, Times, Baskerville, Georgia, serif'
                }
        ];

        var service = {
            getAvailableFonts: getAvailableFonts,
            getFontByStack: getFontByStack,
            getDisplayFontName: getDisplayFontName
        };
        return service;

        function getAvailableFonts() {
            return DEFAULT_WEBSAFE_FONTS;
        }

        function getFontByStack(fontStack) {
            var mainFontName = fontStack.split(',')[0].toLowerCase();
            if (mainFontName === '') return null;

            for (var i = 0; i < DEFAULT_WEBSAFE_FONTS.length; i++) {
                if (DEFAULT_WEBSAFE_FONTS[i].stack.split(',')[0].toLowerCase() === mainFontName)
                    return DEFAULT_WEBSAFE_FONTS[i];
            }
            return null;
        }

        function getDisplayFontName(fontStack) {
            var font = service.getFontByStack(fontStack);
            return font ? font.name : '';
        }
    }
})();