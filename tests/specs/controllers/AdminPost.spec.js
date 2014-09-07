'use strict';

describe('AdminPost', function() {
  var $controller
  var $rootScope
  var $scope
  var postManager
  var $state
  var $stateParams

  function instantiateCtrl() {
    return $controller('AdminPost', {
      $scope: $scope,
      postManager: postManager,
      $state: $state,
      systemConfig: systemConfig,
      $stateParams: $stateParams
    })
  }

  beforeEach(function() {
    inject(function($injector) {
      $controller = $injector.get('$controller')
      $rootScope = $injector.get('$rootScope')
      $stateParams = $injector.get('$stateParams')
      postManager = $injector.get('postManager')
      $state = $injector.get('$state')
    })

    $scope = $rootScope.$new()

    $scope.globals = {}

    $stateParams.postId = null
    spyOn($state, 'go')
    spyOn(postManager, 'generateId')
  })

  describe('initialization', function() {
    it('loads the post for editing if $stateParams.postId is specified', function() {
      spyOn(postManager, 'getPost').and.returnValue($q.when('foo'))
      $stateParams.postId = 123

      instantiateCtrl()

      $timeout.flush()

      expect($scope.post).toBe('foo')
    })
  })

  describe('submitPost method', function() {
    it('does not submit a new post if the form is not valid. Instead, it writes invalid form error message ' +
       'to $scope.errorMessage', function() {
      postManager.savePost = jasmine.createSpy()
      $scope.newPostForm = { $valid: false }

      instantiateCtrl()

      $scope.submitPost()

      expect(postManager.savePost).not.toHaveBeenCalled()
      expect($scope.errorMessage).toBe(systemConfig.messages.invalidForm)
    })

    it('turns on the loading indicator, saves the post using postManager.savePost and ' +
       'redirects to the new post when it is saved successfully.', function() {
      spyOn(postManager, 'savePost').and.returnValue($q.when(true))
      $scope.newPostForm = { $valid: true }
      
      instantiateCtrl()

      $scope.submitPost()

      expect($scope.globals.loading).toBe(true)
      expect(postManager.savePost).toHaveBeenCalled()

      $timeout.flush()

      expect($state.go).toHaveBeenCalledWith('post', { postId: undefined })
      expect($scope.globals.loading).toBe(false)
    })

    it('logs out the error when postManager.savePost fails', function() {
      spyOn(console, 'log')
      postManager.savePost = jasmine.createSpy().and.returnValue($q.reject(false))
      $scope.newPostForm = { $valid: true }

      instantiateCtrl()

      $scope.submitPost()

      $timeout.flush()

      expect(console.log).toHaveBeenCalled()
    })
  })
})