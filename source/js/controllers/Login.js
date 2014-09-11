'use strict';

angular.module('helium')

.controller('Login',
  function($scope, user, $state, $stateParams, systemConfig) {
    angular.extend($scope, {
      message: $stateParams.authError,

      authenticate: function() {
        return user.authenticate({ immediate: false }).then(
          function success() {
            $state.go('homepage')
          },

          function error(authResults) {
            $scope.message = systemConfig.messages.genericError

            console.log(authResults)
          }
        )
      }
    })
  }
)
