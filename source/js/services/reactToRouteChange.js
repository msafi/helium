'use strict';

angular.module('helium')

.service('reactToRouteChange',
  function($state, $rootScope) {
    return function(valueMap, currentScope, target) {
      set($state.current.name)

      $rootScope.$on('$stateChangeSuccess', function(event, toState) {
        set(toState.name)
      })

      function set(stateName) {
        currentScope[target] = (_.find(valueMap, { name: stateName }) || _.last(valueMap)).value
      }
    }
  }
)