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
  })
})