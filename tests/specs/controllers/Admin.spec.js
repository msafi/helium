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

  describe('initialization', function() {
    it('sets $scope.action based on $state.current.name', function() {
      verificationResults = true
      $state.current.name = 'admin.post'

      instantiateCtrl()

      expect($scope.action).toBe('Make a new post')

      $state.current.name = 'admin.managePosts'

      instantiateCtrl()

      expect($scope.action).toBe('Manage posts')

      $state.current.name = 'foobar'

      instantiateCtrl()

      expect($scope.action).toBe('')
    })
  })

  describe('$stateChangeSuccess event', function() {
    it('changes the value $scope.action based on the name of the state that is being transisionted into', function() {
      instantiateCtrl()

      $rootScope.$broadcast('$stateChangeSuccess', { name: 'admin.post' })

      expect($scope.action).toBe('Make a new post')

      $rootScope.$broadcast('$stateChangeSuccess', { name: 'admin.managePosts' })

      expect($scope.action).toBe('Manage posts')
    })
  })
})