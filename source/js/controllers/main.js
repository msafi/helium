angular.module('helium')

.controller('Main',
  function($scope, config) {
    $scope.pageTitle = config.general.title
  }
)