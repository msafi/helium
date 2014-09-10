'use strict';

angular.module('helium')

.directive("heOnfileselect",
  function() {
    return {
      scope: {
        heOnfileselect: "="
      },

      link: function($scope, $element) {
        $element.on('change', function(changeEvent) {
          $scope.heOnfileselect(changeEvent.target.files)
        })
      }
    }
  }
)