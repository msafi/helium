angular.module('uiRouterMock', []).service('$state', function() {
  return { go: angular.noop }
}).service('$urlRouter', function() {
  return {}
})