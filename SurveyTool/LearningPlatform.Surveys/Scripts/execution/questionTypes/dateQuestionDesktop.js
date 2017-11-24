var DateQuestionDesktop = (function () {
    return {
        buildDateQuestion: buildDateQuestion
    };

    function buildDateQuestion() {
        var isSelectDate = false;

        $.each(document.querySelectorAll('.date input'), function (index, element) {
            if (element) {
                if (element.value) {
                    var savedDate = new Date(element.value);
                    pickmeup(element, {
                        format: 'b d, Y', //format: 'aAbBCdeHIjklmMpPsSuwyY'
                        hide_on_select: true,
                        date: savedDate
                    });
                } else {
                    pickmeup(element, {
                        default_date: false,
                        format: 'b d, Y',
                        hide_on_select: true
                    });
                }

                $(element).on('pickmeup-change pickmeup-show pickmeup-hide', function (e) {
                    if (e.type === 'pickmeup-change') {
                        GeneralQuestionValidation.handleCheckingValidate(IndexModule.selectedQuestion);
                        var delay,
                            isAutoSelectOption = false;
                        GeneralPageDesktop.handleAutoNextOrNextQuestion(delay, isAutoSelectOption);
                    }
                });
            }
        });

        $('.date input').pickmeup_twitter_bootstrap();
        dateClickEvent();
    }

    function dateClickEvent() {
        $(document).on('mousedown', function (event) {
            $('.pickmeup-twitter-bootstrap').addClass('pmu-hidden');
            var pmuParent = $(event.target).parents().filter(function (index, parent) {
                return $(parent).hasClass('well');
            });
            //Enable to wait for select date run
            if (pmuParent) {
                $(pmuParent).removeClass('pmu-hidden');
            }
        });
    }
})();