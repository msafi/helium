'use strict';

describe('Homepage', function() {
  var $controller
  var $rootScope
  var $scope
  var postManager

  function instantiateCtrl() {
    return $controller('Homepage', {
      $scope: $scope,
      postManager: postManager,
    })
  }

  beforeEach(function() {
    inject(function($injector) {
      $controller = $injector.get('$controller')
      $rootScope = $injector.get('$rootScope')
    })

    $scope = $rootScope.$new()

    $scope.globals = {}

    postManager = { getPosts: jasmine.createSpy().and.returnValue($q.when([1,2,3])) }
  })

  describe('initialization', function() {
    it('sets turns on the loading indicator, gets the posts from the server and assigns the posts array to ' +
       '$scope.posts then it turns off the loading indicator', function() {

      instantiateCtrl()

      expect($scope.globals.loading).toBe(true)

      $timeout.flush()

      expect(postManager.getPosts).toHaveBeenCalled()
      expect($scope.posts).toEqual([1,2,3])
      expect($scope.globals.loading).toBe(false)
    })
  })
})