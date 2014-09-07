'use strict';

describe('AdminMenu', function() {
  var $controller
  var $rootScope
  var $scope
  var user
  var $state
  var postManager
  var $q

  function instantiateCtrl() {
    return $controller('AdminMenu', {
      $scope: $scope,
      $state: $state,
      user: user,
      postManager: postManager
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
})