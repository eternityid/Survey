var BasePage = requirePage('common/basePage');
var TestPage = function (url) {
    var self = this;
    self.url = getSurveyExecutionUrl() + url;

    self.getQuestionsCount = getQuestionsCount;
    self.selectQuestionByIndex = selectQuestionByIndex;
    self.goToQuestionByIndex = goToQuestionByIndex;
    self.selectSingleSelectionGridAnswer = selectSingleSelectionGridAnswer;
    self.selectMultiSelectionGridAnswer = selectMultiSelectionGridAnswer;
    self.selectSingleSelectionAnswer = selectSingleSelectionAnswer;
    self.selectMultipleSelectionAnswer = selectMultipleSelectionAnswer;
    self.selectNumericAnswer = selectNumericAnswer;
    self.selectNetPromoterCoreAnswer = selectNetPromoterCoreAnswer;
    self.selectScaleAnswer = selectScaleAnswer;
    self.inputShortTextAnswer = inputShortTextAnswer;
    self.inputLongTextAnswer = inputLongTextAnswer;
    self.moveNextPage = moveNextPage;



    function getQuestionsCount() {
        return self.rootElement.all(by.css('div.deactive span.question-title')).count();
    }

    function selectQuestionByIndex(questionIndex) {
        element.all(by.css('div.deactive span.question-title')).get(questionIndex).click();
    }

    function goToQuestionByIndex(questionIndex) {
        var deferred = protractor.promise.defer();
        for (i = 0; i < questionIndex - 1; i++) {
            (function (i) {
                browser.driver.findElements(By.css("div.active div.long-text")).then(function (presenceOfElement) {
                    if (presenceOfElement) {
                        browser.actions().sendKeys(protractor.Key.TAB).perform();
                    }
                    else {
                        browser.driver.findElements(By.css("div.information div.active")).then(function (presenceOfElement) {
                            if (presenceOfElement) {
                                browser.actions().sendKeys(protractor.Key.TAB).perform();
                            }
                            else {
                                browser.actions().sendKeys(protractor.Key.ENTER).perform();
                            }
                        });
                    }
                });
            })(i);

        }
        browser.sleep(2000);
        deferred.fulfill();
        return deferred.promise;
    }

    function selectSingleSelectionGridAnswer(right, left, up, down) {
        var deferred = protractor.promise.defer();
        this.waitForElement(By.css("div.active table.grid-selection"));
        typeArrowKeysMultipleTimes(right, left, up, down);
        browser.actions().sendKeys(protractor.Key.SPACE).perform();
        browser.driver.findElement(By.xpath("//td[@class='active-option']/ancestor::tr/th")).getText().then(function (value) {
            browser.driver.findElement(By.css("td.active-option input")).getAttribute('value').then(function (attr) {
                browser.driver.findElement(By.css("td.active-option input")).getAttribute('checked').then(function (st) {
                    var result = { OptionName: '', Position: '', Status: '' }
                    result.Position = attr;
                    result.OptionName = value;
                    result.Status = st;
                    deferred.fulfill(result);
                });

            });

        });
        return deferred.promise;
    }

    function selectMultiSelectionGridAnswer(right, left, up, down) {
        var deferred = protractor.promise.defer();
        this.waitForElement(By.css("div.active table.grid-selection"));
        typeArrowKeysMultipleTimes(right, left, up, down);
        browser.actions().sendKeys(protractor.Key.SPACE).perform();
        browser.driver.findElement(By.xpath("//td[@class='active-option']/ancestor::tr/th")).getText().then(function (value) {
            browser.driver.findElement(By.css("td.active-option input")).getAttribute('name').then(function (attr) {
                browser.driver.findElement(By.css("td.active-option input")).getAttribute('checked').then(function (st) {
                    var result = { OptionName: '', Position: '', Status: '' }
                    result.Position = attr ? attr.substr(attr.length - 1, attr.length) : '';
                    result.OptionName = value;
                    result.Status = st;
                    deferred.fulfill(result);
                });

            });

        });
        return deferred.promise;
    }

    function selectSingleSelectionAnswer(keys, right, left, up, down) {
        var deferred = protractor.promise.defer();
        this.waitForElement(By.css("div.active label.single-selection"));
        typeArrowKeysMultipleTimes(right, left, up, down);
        browser.actions().sendKeys(protractor.Key.SPACE).perform();
        browser.driver.findElement(By.css("div.single-selection-option.active-option")).getText().then(function (text) {
            browser.driver.findElement(By.css("div.single-selection-option.active-option input")).getAttribute('position').then(function (attr) {
                browser.driver.findElement(By.css("div.single-selection-option.active-option input")).isSelected().then(function (st) {
                    var result = { OptionName: '', Position: '', Status: '' }
                    result.Position = attr;
                    result.OptionName = text.replace(/\s+/g, '');
                    result.Status = st;
                    deferred.fulfill(result);
                });
            });
        });
        return deferred.promise;
    }

    function selectMultipleSelectionAnswer(keys, right, left, up, down) {
        var deferred = protractor.promise.defer();
        this.waitForElement(By.css("div.active label.multi-selection"));

        typeArrowKeysMultipleTimes(right, left, up, down);
        browser.actions().sendKeys(protractor.Key.SPACE).perform();
        browser.driver.findElement(By.css("div.multi-selection-option.active-option")).getText().then(function (text) {
            browser.driver.findElement(By.css("div.multi-selection-option.active-option input")).getAttribute('position').then(function (attr) {
                browser.driver.findElement(By.css("div.multi-selection-option.active-option input")).getAttribute('checked').then(function (st) {
                    var result = { OptionName: '', Position: '', Status: '' }
                    result.Position = attr;
                    result.OptionName = text.replace(/\s+/g, '');
                    result.Status = st;
                    deferred.fulfill(result);
                });
            });
        });
        return deferred.promise;
    }

    function selectNumericAnswer(keys, up, down) {
        var deferred = protractor.promise.defer();
        this.waitForElement(By.css("div.active div.numeric-text"));
        browser.driver.findElement(By.css("div.active div.numeric-text input")).sendKeys('1');
        if (keys == null) {
            typeArrowKeysMultipleTimes(0, 0, up, down);
        } else {
            browser.driver.findElement(By.css("div.active div.numeric-text input")).sendKeys(keys)
        }
        browser.driver.findElement(By.css("div.active div.numeric-text input")).getAttribute('value').then(function (text) {
            var result;
            result = text;
            deferred.fulfill(result);
        });
        return deferred.promise;
    }

    function selectNetPromoterCoreAnswer(keys, right, left) {
        var deferred = protractor.promise.defer();
        this.waitForElement(By.css("div.active div.hrow.liker"), 2000);
        typeArrowKeysMultipleTimes(right, left, 0, 0);
        browser.actions().sendKeys(protractor.Key.SPACE).perform();
        this.waitForElement(By.css("div.deactive div.hrow.liker label.cell.single-selection-option.deactive-option span.selection-option-title"), 2000);
        browser.driver.findElements(By.css("div.deactive div.hrow.liker label.cell.single-selection-option.deactive-option span.selection-option-title")).then(function (elements) {
            var j = 0;
            var i = 0;
            while (i < elements.length) {
                browser.executeScript(function (domPicture) {
                    var style = window.getComputedStyle(domPicture, ':before');
                    return style.getPropertyValue('border');
                }, elements[i]).then(function (borderRadius) {
                    if (borderRadius == '4px solid rgb(8, 95, 100)') {
                        h = j;
                        elements[j + 1].findElement(By.xpath('../input')).getAttribute('value').then(function (st) {
                            var result = { value: '', position: '' }
                            result.value = st;
                            result.position = j;
                            deferred.fulfill(result);
                        });
                    }
                    j++;
                });
                i++;
            }

        });

        return deferred.promise;
    }

    function selectScaleAnswer(keys, right, left) {
        var deferred = protractor.promise.defer();
        this.waitForElement(By.id("bigscale_0"), 2000);
        browser.driver.findElement(By.css("div.question.active")).click();
        typeArrowKeysMultipleTimes(right, left, 0, 0);

        browser.actions().sendKeys(protractor.Key.SPACE).perform();
        this.waitForElement(By.css("div.question.deactive div.hrow.liker"), 2000);
        browser.driver.findElements(By.css("div.deactive div.hrow.liker label.cell.single-selection-option.deactive-option span.selection-option-title")).then(function (elements) {
            var j = 0;
            var i = 0;
            while (i < elements.length) {
                browser.executeScript(function (domPicture) {
                    var style = window.getComputedStyle(domPicture, ':before');
                    return style.getPropertyValue('border');
                }, elements[i]).then(function (borderRadius) {
                    if (borderRadius == '4px solid rgb(8, 95, 100)') {
                        h = j;
                        elements[j + 1].findElement(By.xpath('../input')).getAttribute('value').then(function (st) {
                            var result = { value: '', position: '' }
                            result.value = st;
                            result.position = j;
                            deferred.fulfill(result);
                        });
                    }
                    j++;
                });
                i++;
            }

        });
        return deferred.promise;
    }

    function inputShortTextAnswer(shorttext) {
        var deferred = protractor.promise.defer();
        this.waitForElement(By.css("div.active div.short-text"));
        browser.driver.findElement(By.css("div.active div.short-text input")).sendKeys(shorttext);
        browser.driver.findElement(By.css("div.active div.short-text input")).getAttribute("value").then(function (value) {
            deferred.fulfill(value);
        });
        return deferred.promise;
    }

    function inputLongTextAnswer(longtext) {
        var deferred = protractor.promise.defer();
        this.waitForElement(By.css("div.active div.long-text"), 2000);

        browser.driver.findElement(By.css("div.active div.long-text textarea")).sendKeys(longtext);
        browser.driver.findElement(By.css("div.active div.long-text textarea")).getAttribute("value").then(function (value) {
            deferred.fulfill(value.trim());
        });
        return deferred.promise;
    }

    function moveNextPage() {
        var deferred = protractor.promise.defer();
        browser.sleep(2000);
        var a = 7;
        while (a > 0) {
            browser.actions().sendKeys(protractor.Key.ENTER).perform();
            a--;
        }
        browser.sleep(1000);
        browser.actions().sendKeys(protractor.Key.SPACE).perform();

        this.waitForElement(By.css("div.active"), 5000);
        deferred.fulfill();
        return deferred.promise;
    }

    function typeArrowKeysMultipleTimes(right, left, up, down) {
        for (i = 0; i < right; i++) {
            browser.actions().sendKeys(protractor.Key.ARROW_RIGHT).perform();
            browser.sleep(300);
        }
        for (i = 0; i < left; i++) {
            browser.actions().sendKeys(protractor.Key.ARROW_LEFT).perform();
            browser.sleep(300);
        }
        for (i = 0; i < down; i++) {
            browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
            browser.sleep(300);
        }
        for (i = 0; i < up; i++) {
            browser.actions().sendKeys(protractor.Key.ARROW_UP).perform();
            browser.sleep(300);
        }
    }
};

TestPage.prototype = new BasePage();
TestPage.constructor = BasePage;
TestPage.prototype.goTo = function () {
    this.goDirectToWithAbsoluteUrl();
};

module.exports = TestPage;