'use strict';

describe('AdminMenu', function() {
  var $controller
  var $rootScope
  var $scope
  var user
  var $state
  var $q

  function instantiateCtrl() {
    return $controller('AdminMenu', {
      $scope: $scope,
      $state: $state,
      user: user,
    })
  }

  beforeEach(function() {
    inject(function($injector) {
      $controller = $injector.get('$controller')
      $rootScope = $injector.get('$rootScope')
      $state = $injector.get('$state')
      user = $injector.get('user')
      $q = $injector.get('$q')
    })

    $scope = $rootScope.$new()

    $scope.globals = {}

    spyOn($state, ['go'])
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