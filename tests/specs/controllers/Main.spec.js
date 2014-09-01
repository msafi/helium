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
})