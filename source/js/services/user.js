angular.module('helium')

.service('user',
  function(config, systemConfig, $location, localStorage, utils, $q) {
    var user = {}
    var clientId = config.googleClientId

    return angular.extend(user, {
      authenticateWithGoogle: function(options) {
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
              localStorage.setVal('credentialsExpirationTime', utils.currentTime() + 3600000)
              localStorage.setVal('idToken', authResults.id_token)

              googleAuthentication.resolve(authResults)
            }
          }
        )

        return googleAuthentication.promise
      },

      hasValidCredentials: function() {
        var currentTime = utils.currentTime()
        var credentialsExpirationTime = localStorage.getVal('credentialsExpirationTime')

        return credentialsExpirationTime !== undefined && credentialsExpirationTime > currentTime
      },

      verify: function() {
        var verify = $q.defer()

        if (!this.hasValidCredentials()) {
          user.authenticateWithGoogle().then(
            function success() {
              verify.resolve(true)
            },

            function error() {
              verify.reject({ error: systemConfig.messages.googleAuthenticationError })
            }
          )
        } else {
          verify.resolve(true)
        }

        return verify.promise
      }
    })
  }
)