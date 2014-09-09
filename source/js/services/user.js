'use strict';

angular.module('helium')

.service('user',
  function(config, systemConfig, lStorage, utils, gapi, $q) {
    var user = {}

    return angular.extend(user, {
      isAdmin: function() {
        var identity = lStorage.getVal('identity')

        return config.amazonRoleArn === identity
      },

      hasValidCredentials: function() {
        var currentTime = utils.currentTime()
        var credentialsExpirationTime = lStorage.getVal('credentialsExpirationTime')

        return credentialsExpirationTime !== undefined &&
               credentialsExpirationTime > currentTime &&
               user.isAdmin() === true
      },

      authenticate: function(options) {
        var authenticate = $q.defer()

        if (!this.hasValidCredentials()) {
          gapi.authorize(options).then(
            function success(authResults) {
              /* jshint camelcase: false */

              lStorage.setVal('credentialsExpirationTime', utils.currentTime() + 3600000)
              lStorage.setVal('idToken', authResults.id_token)
              lStorage.setVal('identity', config.amazonRoleArn)

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
      },

      signOut: function() {
        return gapi.signOut().finally(function() {
          lStorage.removeItem('credentialsExpirationTime')
          lStorage.removeItem('idToken')
          lStorage.removeItem('identity')
        })
      }
    })
  }
)