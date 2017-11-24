(function() {
    describe('Testing fontSelectorSvc service', function () {
        var svc;

        beforeEach(function() {
            module('svt');
            inject(function($injector) {
                svc = $injector.get('fontSelectorSvc');
            });
        });

        describe('Testing getFontByStack function', function() {
            var fontStack = '', font;

            it('should return null with empty font stack', function() {
                font = svc.getFontByStack(fontStack);

                expect(font).toBeNull();
            });

            it('should return font with tahoma', function () {
                fontStack = 'tahoma';

                font = svc.getFontByStack(fontStack);

                expect(font.stack).toEqual('Tahoma, Verdana, Segoe, sans-serif');
            });

            it('should return null with invalid font stack', function () {
                fontStack = 'dummy';

                font = svc.getFontByStack(fontStack);

                expect(font).toBeNull();
            });
        });

        describe('Testing getDisplayFontName function', function () {
            var fontStack, fontName;

            it('should return verdana with verdana font stack', function () {
                fontStack = 'Verdana, Geneva, sans-serif';

                fontName = svc.getDisplayFontName(fontStack);

                expect(fontName).toEqual('Verdana');
            });

            it('should return empty name with invalid font stack', function () {
                fontStack = 'dummy';

                fontName = svc.getDisplayFontName(fontStack);

                expect(fontName).toEqual('');
            });
        });
    });
})();