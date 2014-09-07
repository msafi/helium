'use strict';

describe('reactToRouteChange', function() {
  var reactToRouteChange
  var $rootScope
  var $state
  var $scope = { someProperty: '' }

  beforeEach(function() {
    inject(function($injector) {
      reactToRouteChange = $injector.get('reactToRouteChange')
      $rootScope = $injector.get('$rootScope')
      $state = $injector.get('$state')
    })
  })

  it('is used to assign values to an object property based on the current route', function() {
    $state.current.name = 'foo'

    reactToRouteChange([
      { name: 'foo', value: 'one' }
    ], $scope, 'someProperty')

    expect($scope.someProperty).toBe('one')
  })

  it('reacts to route changes', function() {
    reactToRouteChange([
      { name: 'bar', value: 'two' },
    ], $scope, 'someProperty')

    $rootScope.$broadcast('$stateChangeSuccess', { name: 'bar' })

    expect($scope.someProperty).toBe('two')
  })

  it('uses the last property of the valueMap array if it could not locate the intended item', function() {
    reactToRouteChange([
      { name: 'foo', value: 'one' },
      { name: 'bar', value: 'two' },
      { name: 'baz', value: 'three' }
    ], $scope, 'someProperty')

    $rootScope.$broadcast('$stateChangeSuccess', { name: 'qux' })

    expect($scope.someProperty).toBe('three')
  })
})