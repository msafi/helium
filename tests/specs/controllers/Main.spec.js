'use strict';

describe('Main', function() {
  var $controller
  var $rootScope
  var $scope
  var $state

  function instantiateCtrl() {
    return $controller('Main', {
      $scope: $scope,
      $state: $state,
      config: config
    })
  }

  beforeEach(function() {
    inject(function($injector) {
      $controller = $injector.get('$controller')
      $rootScope = $injector.get('$rootScope')
    })

    $scope = $rootScope.$new()

    $state = { go: jasmine.createSpy(), current: { name: '' }}
  })

  it('instantiates without errors', function() {
    expect(function() {
      instantiateCtrl()
    }).not.toThrow()
  })

  describe('event listeners', function() {
    it('assigns post data to $scope.post when the event "post" is broadcast', function() {
      instantiateCtrl()

      $rootScope.$broadcast('post', 'foo')

      expect($scope.post).toBe('foo')
    })

    it('sets $scope.post to undefined when the event "$stateChangeStart" is broadcast', function() {
      instantiateCtrl()

      $scope.post = 'foo'

      $rootScope.$broadcast('$stateChangeStart')

      expect($scope.post).toBeUndefined()
    })
  })
})