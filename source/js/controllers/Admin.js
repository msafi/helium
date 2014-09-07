'use strict';

angular.module('helium')

.controller('Admin',
  function($scope, verificationResults, $state, systemConfig, reactToRouteChange) {
    if (verificationResults !== true) {
      $state.go('login', { authError: systemConfig.messages.adminAuthError })
      return false
    }

    angular.extend($scope, {
      verificationResults: verificationResults,
    })
  }
)
