'use strict';

angular.module('helium')

.controller('AdminMenu',
  function($scope, user, $state) {
    angular.extend($scope, {
      logout: function() {
        $scope.globals.loading = true

        user.signOut().finally(function() {
          $scope.globals.loading = false
          $state.go('homepage', { reload: true })
        })
      }
    })
  }
)