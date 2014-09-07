'use strict';

angular.module('helium')

.service('gapi',
  function(config, $q, $http) {
    /* jshint camelcase: false */
    /* global gapi */

    var _gapi = {}
    var clientId = config.googleClientId

    return angular.extend(_gapi, {
      authorize: function(options) {
        var googleAuthentication = $q.defer()

        options = options || {}
        options.immediate = options.immediate === undefined

        gapi.auth.authorize(
          {
            client_id: clientId,
            response_type: 'token id_token',
            cookie_policy: 'single_host_origin',
            immediate: options.immediate,
            scope: 'email',
          },

          /* istanbul ignore next */
          function(authResults) {
            if (authResults.error !== undefined) {
              googleAuthentication.reject(authResults)
            } else {
              googleAuthentication.resolve(authResults)
            }
          }
        )

        return googleAuthentication.promise
      },

      signOut: function() {
        return _gapi.authorize().then(
          function success(authResults) {
            return authResults
          },

          function error(authResults) {
            return $q.reject(authResults)
          }
        ).then(
          function success(authResults) {
            return $http({
              method: 'JSONP',
              url: 'https://accounts.google.com/o/oauth2/revoke?token=' + authResults.access_token
            })
          }
        )
      }
    })
  }
)