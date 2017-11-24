(function () {
    angular.module('svt').service('moveOptionAndGroupSvc', MoveOptionAndGroupSvc);

    function MoveOptionAndGroupSvc() {
        var service = {
            isRealOption: isRealOption,
            updateOptionsBySortableOptions: updateOptionsBySortableOptions,
            getOptionGroupByAlias: getOptionGroupByAlias,
            getGroupIndexByAlias: getGroupIndexByAlias,
            getPreviousGroupByAlias: getPreviousGroupByAlias,
            getGroupAliasOfLastOption: getGroupAliasOfLastOption,
            removeDisplayedOptionNotBelongToGroup: removeDisplayedOptionNotBelongToGroup,
            moveOutGroupByAlias: moveOutGroupByAlias
        };
        return service;

        function isRealOption(option) {
            return option && option.hasOwnProperty('$type') && option.$type === 'Option';
        }

        function updateOptionsBySortableOptions(optionList) {
            optionList.options.length = 0;
            optionList.optionGroups.forEach(function (optionGroup) {
                var realOptions = filterDisplayedOptions(optionGroup);
                optionList.options = optionList.options.concat(realOptions);
            });
            return;

            function filterDisplayedOptions(optionGroup) {
                return optionGroup.displayedOptions.filter(function (option) {
                    return option.hasOwnProperty('$type') && option.$type === 'Option';
                });
            }
        }

        function getOptionGroupByAlias(optionList, alias) {
            var index = optionList.optionGroups.findIndex(function (group) {
                return group.alias === alias;
            });
            return optionList.optionGroups[index];
        }

        function getGroupIndexByAlias(optionList, alias) {
            return optionList.optionGroups.findIndex(function (group) {
                return group.alias === alias;
            });
        }

        function getPreviousGroupByAlias(optionList, alias) {
            var index = getGroupIndexByAlias(optionList, alias);
            return index > 0 ? optionList.optionGroups[index - 1] : null;
        }

        function getGroupAliasOfLastOption(optionGroup) {
            if (optionGroup.displayedOptions.length === 0) return optionGroup.alias;
            var lastOption = optionGroup.displayedOptions[optionGroup.displayedOptions.length - 1];
            if (service.isRealOption(lastOption) || !lastOption.isIndent) return lastOption.groupAlias;
            return lastOption.referToGroupAlias;
        }

        function removeDisplayedOptionNotBelongToGroup(optionGroup) {
            optionGroup.displayedOptions = optionGroup.displayedOptions.filter(function (group) {
                return group.groupAlias === optionGroup.alias;
            });
        }

        function moveOutGroupByAlias(optionList, groupAlias) {
            optionList.optionGroups = optionList.optionGroups.filter(function (group) {
                return group.alias !== groupAlias;
            });
        }
    }
})();