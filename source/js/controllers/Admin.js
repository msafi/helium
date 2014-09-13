'use strict';

angular.module('helium')

.controller('Admin',
  function($scope, verificationResults, $state, systemConfig) {
    if (verificationResults !== true) {
      $state.go('login', { authError: systemConfig.messages.adminAuthError })
      return false
    }

    angular.extend($scope, {
      verificationResults: verificationResults,
    })
  }
)
