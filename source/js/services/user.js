'use strict';

angular.module('helium')

.service('user',
  function(config, systemConfig, localStorage, utils, gapi, $q) {
    var user = {}

    return angular.extend(user, {
      hasValidCredentials: function() {
        var currentTime = utils.currentTime()
        var credentialsExpirationTime = localStorage.getVal('credentialsExpirationTime')
        var identity = localStorage.getVal('identity')

        return credentialsExpirationTime !== undefined &&
               credentialsExpirationTime > currentTime &&
               config.amazonRoleArn === identity
      },

      authenticate: function(options) {
        var authenticate = $q.defer()

        if (!this.hasValidCredentials()) {
          gapi.authorize(options).then(
            function success(authResults) {
              /* jshint camelcase: false */

              localStorage.setVal('credentialsExpirationTime', utils.currentTime() + 3600000)
              localStorage.setVal('idToken', authResults.id_token)
              localStorage.setVal('identity', config.amazonRoleArn)

              authenticate.resolve(true)
            },

            function error() {
              authenticate.reject({ error: systemConfig.messages.googleAuthenticationError })
            }
          )
        } else {
          authenticate.resolve(true)
        }

        return authenticate.promise
      }
    })
  }
)