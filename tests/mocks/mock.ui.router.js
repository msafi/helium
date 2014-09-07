angular.module('uiRouterMock', []).service('$state', function() {
  return { go: angular.noop, current: { name: '' } }
}).service('$urlRouter', function() {
  return {}
})