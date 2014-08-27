angular.module('helium')

.directive('heliumLoading',
  function() {
    return {
      restrict: 'E',
      templateUrl: 'html/helium-loading.html',
    }
  }
)