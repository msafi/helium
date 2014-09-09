'use strict';

angular.module('helium')

.controller('Main',
  function($scope, config, $state, $rootScope, reactToRouteChange, pageTitle, user) {
    $rootScope.$on('post', function(event, post) {
      $scope.post = post
    })

    $rootScope.$on('$stateChangeStart', function() {
      $scope.post = undefined
    })
    
    angular.extend($scope, {
      $state: $state,
      globals: { loading: false },
      pageTitle: pageTitle,

      isAdmin: user.isAdmin
    })
  }
)