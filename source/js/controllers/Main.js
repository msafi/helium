'use strict';

angular.module('helium')

.controller('Main',
  function($scope, config) {
    $scope.globals = { loading: false }
    $scope.pageTitle = config.blogTitle
  }
)