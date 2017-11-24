(function () {
    'use strict';

    angular
        .module('svt')
        .service('authSvc', authSvc);

    authSvc.$inject = ['OidcTokenManager', 'authorityUrl', 'clientAppUrl', '$window', '$location', '$rootScope'];

    function authSvc(OidcTokenManager, authorityUrl, clientAppUrl, $window, $location, $rootScope) {

        var oidcTokenManager = createOidcTokenManager();
        var service = {
            ensureLogin: ensureLogin,
            processTokenCallback: processTokenCallback,
            processTokenCallbackSilent : processTokenCallbackSilent,
            logout: logout,
            getLoginData: getLoginData,
            clearLoginData: clearLoginData,
            redirectForToken: redirectForToken
        };
        return service;


        function createOidcTokenManager() {
            var config = {
                authority: authorityUrl,
                client_id: "ResponsiveInsight",
                redirect_uri: clientAppUrl + "#/login/",
                silent_redirect_uri: clientAppUrl + "silent_renew.html",
                silent_renew: true,
                post_logout_redirect_uri: clientAppUrl,
                response_type: "id_token token",
                scope: "openid profile roles surveyInternalApi userManagement",
                store: window.localStorage
            };

            var tokenManager = new OidcTokenManager(config);
            return tokenManager;
        }


        function ensureLogin() {
            if (!getLoginData()) {
                var hash = $window.location.hash;
                if (!hash || hash.indexOf('id_token') === -1) {
                    redirectForToken();
                }
            }
        }

        function redirectForToken() {
            var locationPath = $location.path();
            if (locationPath) {
                window.localStorage.setItem('locationPath', locationPath);
            }
            oidcTokenManager.redirectForToken();
            $rootScope.digest();
        }

        function processTokenCallback(hash) {
            if (!hash || hash.indexOf('id_token') === -1) {
                return;
            }
            oidcTokenManager.processTokenCallbackAsync(hash).then(function () {
                $rootScope.$apply(function() {
                    $rootScope.$broadcast('loggedIn');
                });
            });
        }

        function processTokenCallbackSilent() {
            oidcTokenManager.processTokenCallbackSilent();
        }

        function logout() {
            oidcTokenManager.redirectForLogout();

            $rootScope.digest();
        }

        function clearLoginData() {
            oidcTokenManager.removeToken();
        }

        function getLoginData() {
            if (oidcTokenManager.access_token && oidcTokenManager.profile) {
                var loginData = {
                    token: oidcTokenManager.access_token,
                    userName: oidcTokenManager.profile.preferred_username,
                    userRole: oidcTokenManager.profile.role,
                    externalId: oidcTokenManager.profile.sub,
                    userId: oidcTokenManager.profile.sub
                };
                return loginData;
            } else {
                return null;
            }
        }
    }
})();