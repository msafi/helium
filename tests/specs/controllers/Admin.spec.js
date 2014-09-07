'use strict';

describe('Admin', function() {
  var $controller
  var $rootScope
  var $scope
  var verificationResults
  var $state
  var reactToRouteChange

  function instantiateCtrl() {
    return $controller('Admin', {
      $scope: $scope,
      verificationResults: verificationResults,
      $state: $state,
      $rootScope: $scope,
      systemConfig: systemConfig,
      reactToRouteChange: reactToRouteChange
    })
  }

  beforeEach(function() {
    inject(function($injector) {
      $controller = $injector.get('$controller')
      $rootScope = $injector.get('$rootScope')
      reactToRouteChange = $injector.get('reactToRouteChange')
      $state = $injector.get('$state')
    })

    $scope = $rootScope.$new()

    verificationResults = true
    spyOn($state, ['go'])
  })

  describe('when verificationResults is not true', function() {
    it('redirects to the login page and returns false', function() {
      verificationResults = false
      $state = { go: jasmine.createSpy(), current: { name: '' }}

      instantiateCtrl()

      expect($state.go).toHaveBeenCalled()
    })
  })

  describe('when verificationResults is true', function() {
    it('continues on with the execution of the rest of the controller', function() {
      verificationResults = true

      instantiateCtrl()

      expect($scope.verificationResults).toBeDefined()
    })
  })
})