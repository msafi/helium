'use strict';

describe('Post', function() {
  var $controller
  var $rootScope
  var $scope
  var $stateParams
  var postManager
  var keyboard
  var $document
  var $state

  function instantiateCtrl() {
    return $controller('Post', {
      $scope: $scope,
      $stateParams: $stateParams,
      postManager: postManager,
      keyboard: keyboard,
      $state: $state
    })
  }

  beforeEach(function() {
    inject(function($injector) {
      $controller = $injector.get('$controller')
      $rootScope = $injector.get('$rootScope')
      postManager = $injector.get('postManager')
      keyboard = $injector.get('keyboard')
      $stateParams = $injector.get('$stateParams')
      $document = $injector.get('$document')
      $state = $injector.get('$state')
    })

    $scope = $rootScope.$new()
    $scope.globals = {}
  })

  describe('instantiation', function() {
    it('turns on loading indicator, then gets the post from the server, then $rootScope.$broadcasts the post and ' +
       'then it turns off loading indicator', function() {
      spyOn(postManager, 'getPost').and.returnValue($q.when('foo'))
      spyOn($rootScope, '$broadcast')

      instantiateCtrl()

      expect($scope.globals.loading).toBe(true)

      $timeout.flush()

      expect($rootScope.$broadcast).toHaveBeenCalledWith('post', 'foo')
      expect($scope.globals.loading).toBe(false)
    })

    it('sets up a listener on the "savePost" event and calls $scope.savePost upon it', function() {
      spyOn($rootScope, '$on').and.callThrough()

      $stateParams.new = 'true'

      instantiateCtrl()

      spyOn($scope, 'savePost')

      $rootScope.$broadcast('savePost')

      expect($scope.savePost).toHaveBeenCalled()
    })

    it('binds Cmd+P to toggle $scope.preview between true and false', function() {
      $stateParams.new = 'true'

      instantiateCtrl()

      expect($scope.preview).toBe(false)

      $document.trigger($.Event('keydown', { keyCode: 80, metaKey: true }))

      expect($scope.preview).toBe(true)
    })

    it('binds Cmd+Enter to $scope.savePost() if the user is editing or writing a new post', function() {
      $stateParams.new = 'true'

      instantiateCtrl()

      spyOn($scope, ['savePost'])

      $document.trigger($.Event('keydown', { keyCode: 13, metaKey: true }))

      expect($scope.savePost).toHaveBeenCalled()

      $stateParams.new = 'false'

      spyOn(postManager, 'getPost').and.returnValue($q.reject(false))

      instantiateCtrl()

      $timeout.flush()

      spyOn($scope, ['savePost'])

      $document.trigger($.Event('keydown', { keyCode: 13, metaKey: true }))

      expect($scope.savePost).not.toHaveBeenCalled()
    })
  })

  describe('displayPublishedPost method', function() {
    it('tells us whether post.html template should display actual formatted post or the post editing part by ' +
       'returning a boolean which is true when the user is trying to preview a post or when the user is not ' +
       'editing or writing a new post', function() {
      spyOn(postManager, 'getPost').and.returnValue($q.reject(false))

      $stateParams.new = 'true'

      instantiateCtrl()

      $scope.preview = true

      expect($scope.displayPublishedPost()).toBe(true)

      $scope.preview = false
      $stateParams.new = null
      $stateParams.edit = null

      instantiateCtrl()

      $timeout.flush()

      expect($scope.displayPublishedPost()).toBe(true)

      $scope.preview = false
      $stateParams.new = 'true'
      $stateParams.edit = 'true'

      instantiateCtrl()

      expect($scope.displayPublishedPost()).toBe(false)
    })
  })

  describe('savePost method', function() {
    it('does not submit a new post if the form is not valid. Instead, it writes invalid form error message ' +
      'to $scope.errorMessage', function() {
      postManager.savePost = jasmine.createSpy()
      $scope.newPostForm = { $valid: false }

      instantiateCtrl()

      $scope.savePost()

      expect(postManager.savePost).not.toHaveBeenCalled()
      expect($scope.errorMessage).toBe(systemConfig.messages.invalidForm)
    })

    it('turns on the loading indicator, saves the post using postManager.savePost and ' +
      'redirects to the new post when it is saved successfully.', function() {
      $stateParams.postId = 123
      spyOn(postManager, 'savePost').and.returnValue($q.when(true))
      spyOn($state, 'go')
      $scope.newPostForm = { $valid: true }

      instantiateCtrl()

      $scope.savePost()

      expect($scope.globals.loading).toBe(true)
      expect(postManager.savePost).toHaveBeenCalled()

      $timeout.flush()

      expect($state.go).toHaveBeenCalledWith('post', { postId: 123 }, { inherit: false, reload: true })
      expect($scope.globals.loading).toBe(false)
    })

    it('logs out the error when postManager.savePost fails', function() {
      spyOn(console, 'log')
      postManager.savePost = jasmine.createSpy().and.returnValue($q.reject(false))
      $scope.newPostForm = { $valid: true }

      instantiateCtrl()

      $scope.savePost()

      $timeout.flush()

      expect(console.log).toHaveBeenCalled()
    })
  })
})