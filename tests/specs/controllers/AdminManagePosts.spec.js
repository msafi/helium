'use strict';

describe('AdminManagePosts', function() {
  var $controller
  var $rootScope
  var $scope
  var postManager
  var $q
  var $state

  function instantiateCtrl() {
    return $controller('AdminManagePosts', {
      $scope: $scope,
      postManager: postManager
    })
  }

  beforeEach(function() {
    inject(function($injector) {
      $controller = $injector.get('$controller')
      $rootScope = $injector.get('$rootScope')
      $q = $injector.get('$q')
      $state =$injector.get('$state')
//      postManager = $injector.get('postManager')
    })

    $state.go = angular.noop
    postManager = { getPosts: angular.noop, deletePost: angular.noop }
    $scope = $rootScope.$new()
    $scope.globals = {}
  })

  describe('initialization', function() {
    it('sets $scope.globals.loading to true', function() {
      spyOn(postManager, 'getPosts').and.returnValue($q.when(false))

      instantiateCtrl()

      expect($scope.globals.loading).toBe(true)

      $timeout.flush()
    })

    it('calls postManager.getPosts, assigns the results to $scope.posts and ' +
       'sets $scope.globals.loading to false when done', function() {
      spyOn(postManager, 'getPosts').and.returnValue($q.when('foo'))

      instantiateCtrl()

      $timeout.flush()

      expect($scope.posts).toBe('foo')
      expect($scope.globals.loading).toBe(false)
    })
  })

  describe('deletePost method', function() {
    it('turns on loading, calls postManager.deletePost(post), and when successful, it removes the post ' +
       'from $scope.posts and turns off loading', function() {
      spyOn(postManager, 'deletePost').and.returnValue($q.when(true))
      spyOn(postManager, 'getPosts').and.returnValue($q.when([{ id: 1 }, { id: 2 }, { id: 3 }]))

      instantiateCtrl()

      expect($scope.globals.loading).toBe(true)

      $timeout.flush()

      $scope.deletePost({ id: 2 })

      $timeout.flush()

      expect($scope.posts.length).toBe(2)
      expect($scope.globals.loading).toBe(false)
    })
  })
})