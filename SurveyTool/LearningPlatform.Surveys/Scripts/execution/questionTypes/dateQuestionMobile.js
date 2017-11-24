var DateQuestionMobile = (function () {
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
                        isSelectDate = true;
                    }
                    if (e.type === 'pickmeup-show') {
                        $('.pickmeup-twitter-bootstrap .date-close').remove();
                        $('.pickmeup-twitter-bootstrap').prepend('<div class="date-close">Cancel</div>');
                        $(element).parent().hide();
                    }

                    if (e.type === 'pickmeup-hide') {
                        if (isSelectDate) {
                            GeneralPageMobile.handleAutoNextOrNextQuestion();
                        }
                        $(element).parent().show();
                    }
                });
            }
        });

        $('.date input').pickmeup_twitter_bootstrap();
        dateClickEvent();
    }

    function dateClickEvent() {
        $('.pickmeup-twitter-bootstrap').on('click', function (event) {
            event.stopPropagation();
            if (event.target.className === 'date-close') {
                $(this).addClass('pmu-hidden');
                $('.date input').parent().show();
            } else if (event.target.className.indexOf('well') > 0) {
                $(this).removeClass('pmu-hidden');
            }
        });
    }
})();