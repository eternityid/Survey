(function () {
    'use strict';
    describe('Testing arrayUtilSvc service', function () {
        beforeEach(function () {
            module('svt');
        });

        describe('Testing getPositionSpecification function', function () {
            var ids, position;
            it('should return null with invalid data', inject(function (arrayUtilSvc) {
                ids = [];
                position = 0;

                var result = arrayUtilSvc.getPositionSpecification(ids, position);

                expect(result).toBeNull();
            }));

            it('should return no previous, no next with first and only one item', inject(function (arrayUtilSvc) {
                ids = ['dummy'];
                position = 0;

                var result = arrayUtilSvc.getPositionSpecification(ids, position);

                expect(result.hasPreviousElement).toBeFalsy();
                expect(result.hasNextElement).toBeFalsy();
            }));

            it('should return no previous, has next with first item', inject(function (arrayUtilSvc) {
                ids = ['dummy', 'dummy2'];
                position = 0;

                var result = arrayUtilSvc.getPositionSpecification(ids, position);

                expect(result.hasPreviousElement).toBeFalsy();
                expect(result.hasNextElement).toBeTruthy();
            }));

            it('should return has previous, no next with last item', inject(function (arrayUtilSvc) {
                ids = ['dummy', 'dummy2'];
                position = 1;

                var result = arrayUtilSvc.getPositionSpecification(ids, position);

                expect(result.hasPreviousElement).toBeTruthy();
                expect(result.hasNextElement).toBeFalsy();
            }));

            it('should return has previous, has next with middle item', inject(function (arrayUtilSvc) {
                ids = ['dummy', 'dummy2', 'dummy3'];
                position = 1;

                var result = arrayUtilSvc.getPositionSpecification(ids, position);

                expect(result.hasPreviousElement).toBeTruthy();
                expect(result.hasNextElement).toBeTruthy();
            }));
        });
    });
})();