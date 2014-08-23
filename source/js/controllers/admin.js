angular.module('helium')

.controller('Admin',
  function($scope, verificationResults, $state, $rootScope, config) {
    if (verificationResults !== true) {
      $state.go('login', { authError: config.general.errorMessages.adminAuthError })
      return false
    }

    angular.extend($scope, {
      verificationResults: verificationResults,

      newPost: function() {
        $state.go('admin.post')
      }
    })

    setActionText($state.current.name)

    $rootScope.$on('$stateChangeSuccess', function(event, toState) {
      setActionText(toState.name)
    })

    function setActionText(stateName) {
      switch (stateName) {
        case 'admin.post':
          $scope.action = 'Make a new post'
          break
        default:
          $scope.action = ''
      }
    }
  }
)
