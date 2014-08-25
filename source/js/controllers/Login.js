angular.module('helium')

.controller('Login',
  function($scope, user, $state, $stateParams, config, blogManager) {
    angular.extend($scope, {
      message: $stateParams.authError,

      authenticateWithGoogle: function() {
        return user.authenticateWithGoogle({ immediate: false }).then(
          function success() {
            if ($stateParams.authError === config.messages.blogNotInitialized) {
              $scope.initializingMessage = config.messages.initializing
              $scope.initializing = true
              // Kick off initialization
              return blogManager.initialize()
            } else {
              return true
            }
          },

          function error(authResults) {
            $scope.message = authResults.error
          }
        ).then(function() {
          $scope.initializing = false
          $state.go('admin')
        })
      },
    })
  }
)
