var GeneralPage = (function () {
    return {
        isLastPage: isLastPage,
        isThankYouPage: isThankYouPage
    };

    function isLastPage(navigation) {
        return $(navigation).find('input[value=Finish]').length > 0;
    }

    function isThankYouPage() {
        return $('[question-alias=thankyou]').length > 0;
    }
})();
