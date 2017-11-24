(function() {
    angular.module('svt').factory('accessRightsSvc', accessRightsSvc);

    accessRightsSvc.$inject = ['stringUtilSvc', 'surveyEditorSvc', 'accessRightsConst', 'arrayUtilSvc', 'authSvc'];

    function accessRightsSvc(stringUtilSvc, surveyEditorSvc, accessRightsConst, arrayUtilSvc, authSvc) {
        var service = {
            getAccessRightsUsersInCompany: getAccessRightsUsersInCompany,
            getAccessRightsTypesWithoutNoAccess: getAccessRightsTypesWithoutNoAccess,
            makeAvailableUsers: makeAvailableUsers,
            updateAccessRightsInSurvey: updateAccessRightsInSurvey,
            convertAccessRightsParameters: convertAccessRightsParameters,
            isOwnerAccessRights: isOwnerAccessRights,
            addFullNameAndEmail: addFullNameAndEmail
        };
        return service;


        function getAccessRightsUsersInCompany(users) {
            var accessRightsUsersInCompany = [];
            var survey = surveyEditorSvc.getSurvey();
            var accessRightsBySurvey = survey.accessRights;
            if (!accessRightsBySurvey) return accessRightsUsersInCompany;

            removeLoginUser(accessRightsBySurvey);

            accessRightsBySurvey.full.forEach(function (userIdWithFullAction) {
                var user = getUserById(users, userIdWithFullAction);
                var isExists = accessRightsUsersInCompany.some(function (user) { return user.externalId === userIdWithFullAction; });
                if (isExists) return;

                accessRightsUsersInCompany.push({
                    id: user.externalId,
                    fullName: user.fullName,
                    email: user.email,
                    accessRights: accessRightsConst.action.full
                });
            });

            accessRightsBySurvey.write.forEach(function (userIdWithWriteAction) {
                var user = getUserById(users, userIdWithWriteAction);
                var isExists = accessRightsUsersInCompany.some(function (user) { return user.externalId === userIdWithWriteAction; });
                if (isExists) return;

                accessRightsUsersInCompany.push({
                    id: user.externalId,
                    fullName: user.fullName,
                    email: user.email,
                    accessRights: accessRightsConst.action.write
                });
            });

            return accessRightsUsersInCompany;

            function removeLoginUser(accessRights) {
                var loginData = authSvc.getLoginData();

                var index = accessRights.write.indexOf(loginData.externalId);
                if (index >= 0) accessRights.write.splice(index, 1);

                index = accessRights.full.indexOf(loginData.externalId);
                if (index >= 0) accessRights.full.splice(index, 1);
            }
        }

        function makeAvailableUsers(users, accessRightsUsers, newUserAccessRights) {
            var loginData = authSvc.getLoginData();
            var index = arrayUtilSvc.indexOfWithAttr(users, 'externalId', loginData.externalId);
            if (index >= 0) users.splice(index, 1);

            var surveyOwnerId = surveyEditorSvc.getSurvey().userId;
            index = arrayUtilSvc.indexOfWithAttr(users, 'externalId', surveyOwnerId);
            if (index >= 0) users.splice(index, 1);

            accessRightsUsers.forEach(function (user) {
                var userIndex = arrayUtilSvc.indexOfWithAttr(users, 'externalId', user.id);
                if (userIndex >= 0) users.splice(userIndex, 1);
            });

            newUserAccessRights.id = null;
            newUserAccessRights.fullName = null;
            newUserAccessRights.email = null;
            newUserAccessRights.accessRights = null;
        }

        function updateAccessRightsInSurvey(accessRights) {
            var survey = surveyEditorSvc.getSurvey();
            if (!survey.accessRights) survey.accessRights = {};

            survey.accessRights.full = accessRights.full;
            survey.accessRights.write = accessRights.write;
        }

        function convertAccessRightsParameters(users) {
            var writes = [];
            var fulls = [];

            users.forEach(function (user) {
                if (user.accessRights === accessRightsConst.action.write) writes.push(user.id);
                if (user.accessRights === accessRightsConst.action.full) fulls.push(user.id);
            });

            return { write: writes, full: fulls };
        }

        function getUserById(users, externalId) {
            for (var i = 0; i < users.length; i++) {
                var user = users[i];
                if (user.externalId === externalId) return user;
            }
            return null;
        }

        function isOwnerAccessRights() {
            var survey = surveyEditorSvc.getSurvey();
            var surveyUserId = survey.userId;
            var loginData = authSvc.getLoginData();
            return surveyUserId === loginData.externalId;
        }

        function addFullNameAndEmail(users) {
            users.forEach(function (user) {
                user.fullNameAndEmail = user.fullName && user.fullName.trim() !== '' ?
                    user.fullName.trim() + ' (' + user.email + ')' :
                    user.email;
            });
        }

        function getAccessRightsTypesWithoutNoAccess() {
            var types = angular.copy(accessRightsConst.accessRightsTypes);
            return types.filter(function (type) {
                return type.name.toLowerCase() !== 'no access';
            });
        }

    }
})();