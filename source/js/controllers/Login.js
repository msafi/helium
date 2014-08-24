angular.module('helium')

.controller('Login',
  function($scope, user, $state, $stateParams) {
    angular.extend($scope, {
      message: $stateParams.authError,

      authenticateWithGoogle: function() {
        user.authenticateWithGoogle({ immediate: false }).then(function(authResults) {
          if (authResults.error !== undefined) {
            $scope.message = authResults.error
          } else {
            $state.go('admin')
          }
        })
      },
    })
  }
)
