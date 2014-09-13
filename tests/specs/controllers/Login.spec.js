'use strict';

describe('Login', function() {
  var $controller
  var $rootScope
  var $scope
  var user
  var $state
  var $stateParams
  var blogManager

  function instantiateCtrl() {
    return $controller('Login', {
      $scope: $scope,
      user: user,
      $state: $state,
      $stateParams: $stateParams,
      systemConfig: systemConfig,
      blogManager: blogManager
    })
  }

  beforeEach(function() {
    inject(function($injector) {
      $controller = $injector.get('$controller')
      $rootScope = $injector.get('$rootScope')
      user = $injector.get('user')
      $state = $injector.get('$state')
      $stateParams = $injector.get('$stateParams')
      systemConfig = $injector.get('systemConfig')
      blogManager = $injector.get('blogManager')
    })

    $scope = $rootScope.$new()

    $scope.globals = {}

    spyOn($state, 'go')
    spyOn(console, 'log')
  })

  describe('authenticate method', function() {
    it('authenticates the user as an admin of the blog', function() {
      spyOn(user, 'authenticate').and.returnValue($q.reject(false))

      instantiateCtrl()

      $scope.authenticate()

      $timeout.flush()

      expect(user.authenticate).toHaveBeenCalled()
    })

    it('immediately redirects to the homepage page', function() {
      spyOn(user, 'authenticate').and.returnValue($q.when(true))
      $stateParams.authError = null

      instantiateCtrl()

      $scope.authenticate()

      $timeout.flush()

      expect($state.go).toHaveBeenCalledWith('homepage')
    })

    it('writes a generic error message to $scope.message when authentication fail', function() {
      spyOn(user, 'authenticate').and.returnValue($q.reject(true))

      instantiateCtrl()

      $scope.authenticate()

      $timeout.flush()

      expect($scope.message).toBe(systemConfig.messages.genericError)
    })
  })
})