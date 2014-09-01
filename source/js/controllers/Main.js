'use strict';

angular.module('helium')

.controller('Main',
  function($scope, config, $state) {
    $scope.$state = $state
    $scope.globals = { loading: false }
    $scope.pageTitle = config.blogTitle
  }
)