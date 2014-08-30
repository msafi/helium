'use strict';

angular.module('helium')

.service('gapi',
  function(config, $q) {
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
            immediate: options.immediate,
            scope: 'email',
          },

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
    })
  }
)