(function () {
    angular.module('svt').service('deleteOptionAndGroupSvc', DeleteOptionAndGroupSvc);

    function DeleteOptionAndGroupSvc() {
        var service = {
            deleteGroupEnd: deleteGroupEnd,
            deleteGroupHeaderAndChildrenOptions: deleteGroupHeaderAndChildrenOptions,
            deleteGroupHeaderOnly: deleteGroupHeaderOnly
        };
        return service;

        function deleteGroupEnd(optionList, labelOption) {
            var groupAlias = labelOption.isIndent ? labelOption.referToGroupAlias : labelOption.groupAlias;
            var groupIndex = detectGroupIndex(groupAlias);
            var previousGroupAlias = groupIndex > 0 ? optionList.optionGroups[groupIndex - 1].alias : null;
            optionList.options.forEach(function (option) {
                if (option.hasOwnProperty('$type') && option.$type === 'Option' && option.groupAlias === groupAlias) {
                    option.groupAlias = previousGroupAlias;
                }
            });
            optionList.optionGroups.splice(groupIndex, 1);
            return;

            function detectGroupIndex(alias) {
                var index = optionList.optionGroups.findIndex(function (group) {
                    return group.alias === alias;
                });

                return index;
            }
        }

        function deleteGroupHeaderAndChildrenOptions(optionList, groupHeader) {
            optionList.options = optionList.options.filter(function (option) {
                return option.groupAlias !== groupHeader.alias;
            });
            optionList.optionGroups = optionList.optionGroups.filter(function (optionGroup) {
                return optionGroup.$$hashKey !== groupHeader.$$hashKey;
            });
        }

        function deleteGroupHeaderOnly(optionList, groupHeader) {
            var previousGroupAlias = detectPreviousGroupAlias();
            optionList.options.forEach(function (option) {
                if (option.groupAlias === groupHeader.alias) {
                    option.groupAlias = previousGroupAlias;
                }
            });
            optionList.optionGroups = optionList.optionGroups.filter(function (optionGroup) {
                return optionGroup.$$hashKey !== groupHeader.$$hashKey;
            });
            return;

            function detectPreviousGroupAlias() {
                var index = optionList.optionGroups.findIndex(function (group) {
                    return group.$$hashKey === groupHeader.$$hashKey;
                });
                return index <= 0 ? null : optionList.optionGroups[index - 1].alias;
            }
        }
    }
})();