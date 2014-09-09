'use strict';

describe('AdminMenu', function() {
  var $controller
  var $rootScope
  var $scope
  var user
  var $state
  var postManager
  var $location
  var $q

  function instantiateCtrl() {
    return $controller('AdminMenu', {
      $scope: $scope,
      $state: $state,
      user: user,
      postManager: postManager,
      $location: $location
    })
  }

  beforeEach(function() {
    inject(function($injector) {
      $controller = $injector.get('$controller')
      $rootScope = $injector.get('$rootScope')
      $state = $injector.get('$state')
      user = $injector.get('user')
      $q = $injector.get('$q')
      postManager = $injector.get('postManager')
      $location = $injector.get('$location')
    })

    $scope = $rootScope.$new()

    $scope.globals = {}

    spyOn($state, ['go'])
  })

  describe('deletePost method', function() {
    it('confirms with the user if they really want to delete given post ID', function() {
      spyOn(window, 'confirm').and.returnValue(false)
      spyOn(postManager, 'deletePost')

      instantiateCtrl()

      $scope.deletePost(123)

      expect(postManager.deletePost).not.toHaveBeenCalled()
    })

    it('calls postManager.deletePost if confirmation goes through and when done, it redirects to the homepage', function() {
      spyOn(window, 'confirm').and.returnValue(true)
      spyOn(postManager, 'deletePost').and.returnValue($q.when(true))

      instantiateCtrl()

      $scope.deletePost(123)

      $timeout.flush()

      expect(postManager.deletePost).toHaveBeenCalledWith(123)
      expect($state.go).toHaveBeenCalledWith('homepage', { reload: true })
    })
  })

  describe('signOut method', function() {
    it('turns on the loading indicator and calls user.signOut', function() {
      spyOn(user, ['signOut']).and.returnValue($q.when('foo'))

      instantiateCtrl()

      $scope.signOut()

      $timeout.flush()

      expect(user.signOut).toHaveBeenCalled()
    })

    it('on success, turns off the loading indicator and redirects to the homepage', function() {
      spyOn(user, ['signOut']).and.returnValue($q.when('foo'))

      instantiateCtrl()

      $scope.signOut()

      $timeout.flush()

      expect($scope.globals.loading).toBe(false)
      expect($state.go).toHaveBeenCalledWith('homepage', { reload: true })
    })
  })

  describe('makingNewPost method', function() {
    it('is used to tell us whether the user is making a new post or not by returning true or false', function() {
      spyOn($state, 'is')

      instantiateCtrl()

      expect($scope.makingNewPost()).toBe(false)
    })

    it('returns true only when the current page is a post page and the URL has the querystring new=true', function() {
      spyOn($state, 'is').and.returnValue(true)
      spyOn($location, 'search').and.returnValue({ new: 'true' })

      instantiateCtrl()

      expect($scope.makingNewPost()).toBe(true)
    })
  })

  describe('editingPost method', function() {
    it('is used to tell us whether the user is editing a post or not by returning true or false', function() {
      spyOn($state, 'is')

      instantiateCtrl()

      expect($scope.editingPost()).toBe(false)
    })

    it('returns true only when the current page is a post page and the URL has the querystring edit=true', function() {
      spyOn($state, 'is').and.returnValue(true)
      spyOn($location, 'search').and.returnValue({ edit: 'true' })

      instantiateCtrl()

      expect($scope.editingPost()).toBe(true)
    })
  })

  describe('savePost', function() {
    it('simply $rootScope.$broadcasts the event "savePost" which is then handled by the Post.js controller', function() {
      spyOn($rootScope, '$broadcast').and.callThrough()

      instantiateCtrl()

      $scope.savePost()

      expect($rootScope.$broadcast).toHaveBeenCalledWith('savePost')
    })
  })

  describe('newPost method', function() {
    it('redirects the user to the create a new post page', function() {
      spyOn(postManager, 'generateId').and.returnValue(123)

      instantiateCtrl()

      $scope.newPost()

      expect($state.go).toHaveBeenCalledWith('post', { postId: 123, new: true }, { inherit: false })
    })
  })
})