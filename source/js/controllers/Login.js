'use strict';

angular.module('helium')

.controller('Login',
  function($scope, user, $state, $stateParams, systemConfig, blogManager, $q) {
    angular.extend($scope, {
      message: $stateParams.authError,

      authenticate: function() {
        return user.authenticate({ immediate: false }).then(
          function success() {
            if ($stateParams.authError === systemConfig.messages.blogNotInitialized) {
              $scope.initializingMessage = systemConfig.messages.initializing
              $scope.initializing = true

              // Kick off first time initialization
              return blogManager.initialize()
            }
          },

          function error(authResults) {
            $scope.message = authResults.error
            return $q.reject(authResults)
          }
        ).then(
          function success() {
            $state.go('admin')
          },

          function error(error) {
            $scope.message = systemConfig.messages.genericError
            console.log(error)
          }
        ).finally(function() {
          $scope.initializing = false
        })
      },
    })
  }
)
