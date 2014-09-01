'use strict';

angular.module('helium')

.controller('Admin',
  function($scope, verificationResults, $state, $rootScope, systemConfig, $q) {
    if (verificationResults !== true) {
      $state.go('login', { authError: systemConfig.messages.adminAuthError })
      return false
    }

    angular.extend($scope, {
      verificationResults: verificationResults,
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

        case 'admin.managePosts':
          $scope.action = 'Manage posts'
          break

        default:
          $scope.action = ''
      }
    }
  }
)
