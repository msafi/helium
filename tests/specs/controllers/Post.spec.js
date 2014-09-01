'use strict';

describe('Post', function() {
  var $controller
  var $rootScope
  var $scope
  var $stateParams
  var postManager

  function instantiateCtrl() {
    return $controller('Post', {
      $scope: $scope,
      $state: $stateParams,
      postManager: postManager
    })
  }

  beforeEach(function() {
    inject(function($injector) {
      $controller = $injector.get('$controller')
      $rootScope = $injector.get('$rootScope')
      postManager = $injector.get('postManager')
    })

    $scope = $rootScope.$new()
    $scope.globals = {}

    flushAll()
  })

  describe('instantiation', function() {
    it('turns on loading indicator, then gets the post from the server, assings post data to $scope.post and then ' +
       'it turns off loading indicator', function() {
      spyOn(postManager, 'getPost').and.returnValue($q.when('foo'))
      instantiateCtrl()

      expect($scope.globals.loading).toBe(true)

      $timeout.flush()

      expect($scope.post).toBe('foo')
      expect($scope.globals.loading).toBe(false)
    })
  })
})