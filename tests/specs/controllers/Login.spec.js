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

    flushAll()
  })

  describe('authenticate method', function() {
    it('authenticates the user as an admin of the blog', function() {
      spyOn(user, 'authenticate').and.returnValue($q.reject(false))

      instantiateCtrl()

      $scope.authenticate()

      $timeout.flush()

      expect(user.authenticate).toHaveBeenCalled()
    })

    it('initializes the blog for first time use if the user was directed to the login page with $stateParams ' +
       'authError being systemConfig.messages.blogNotInitialized and then it redirects to the admin page', function() {
      spyOn(user, 'authenticate').and.returnValue($q.when(true))
      spyOn(blogManager, 'initialize').and.returnValue($q.when(true))
      $stateParams.authError = systemConfig.messages.blogNotInitialized

      instantiateCtrl()

      $scope.authenticate()

      $timeout.flush()

      expect(blogManager.initialize).toHaveBeenCalled()
      expect($state.go).toHaveBeenCalledWith('admin')
    })

    it('immediately redirects to the admin page if $stateParams.authError does not indicate the the blog has not ' +
       'been initialized', function() {
      spyOn(user, 'authenticate').and.returnValue($q.when(true))
      $stateParams.authError = null

      instantiateCtrl()

      $scope.authenticate()

      $timeout.flush()

      expect($state.go).toHaveBeenCalledWith('admin')
    })

    it('writes a generic error message to $scope.message when authentication fail', function() {
      spyOn(user, 'authenticate').and.returnValue($q.reject(true))

      instantiateCtrl()

      $scope.authenticate()

      $timeout.flush()

      expect($scope.message).toBe(systemConfig.messages.genericError)
    })

    it('writes a generic error message to $scope.message when initialization fails', function() {
      spyOn(user, 'authenticate').and.returnValue($q.when(true))
      spyOn(blogManager, 'initialize').and.returnValue($q.reject(true))
      $stateParams.authError = systemConfig.messages.blogNotInitialized

      instantiateCtrl()

      $scope.authenticate()

      $timeout.flush()

      expect($scope.message).toBe(systemConfig.messages.genericError)
    })
  })
})