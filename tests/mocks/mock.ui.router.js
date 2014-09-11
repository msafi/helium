'use strict';

angular.module('uiRouterMock', []).service('$state', function() {
  return { go: angular.noop, is: angular.noop, current: { name: '' } }
}).service('$urlRouter', function() {
  return {}
})