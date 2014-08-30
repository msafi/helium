'use strict';

angular.module('helium')

.controller('Login',
  function($scope, user, $state, $stateParams, systemConfig, blogManager) {
    angular.extend($scope, {
      message: $stateParams.authError,

      authenticate: function() {
        return user.authenticate({ immediate: false }).then(
          function success() {
            if ($stateParams.authError === systemConfig.messages.blogNotInitialized) {
              $scope.initializingMessage = systemConfig.messages.initializing
              $scope.initializing = true

              // Kick off initialization
              return blogManager.initialize().finally(function() {
                $scope.initializing = false
                return true
              })
            } else {
              return true
            }
          },

          function error(authResults) {
            $scope.message = authResults.error
          }
        ).then(function() {
          $state.go('admin')
        })
      },
    })
  }
)
