(function () {
    'use strict';

    angular.module('svt')
        .constant('questionConst', {
            questionTypes: {
                information: 'InformationDefinition',
                numeric: 'NumericQuestionDefinition',
                shortText: 'OpenEndedShortTextQuestionDefinition',
                longText: 'OpenEndedLongTextQuestionDefinition',
                date: 'DateQuestionDefinition',
                singleSelection: 'SingleSelectionQuestionDefinition',
                multipleSelection: 'MultipleSelectionQuestionDefinition',
                rating: 'RatingQuestionDefinition',
                scale: 'ScaleQuestionDefinition',
                netPromoterScore: 'NetPromoterScoreQuestionDefinition',
                pictureSingleSelection: 'PictureSingleSelectionQuestionDefinition',
                pictureMultipleSelection: 'PictureMultipleSelectionQuestionDefinition',
                singleSelectionGrid: 'SingleSelectionGridQuestionDefinition',
                multipleSelectionGrid: 'MultipleSelectionGridQuestionDefinition',
                shortTextList: 'ShortTextListQuestionDefinition',
                longTextList: 'LongTextListQuestionDefinition',
                ratingGrid: 'RatingGridQuestionDefinition',
                scaleGrid: 'ScaleGridQuestionDefinition'
            }
        });
})();