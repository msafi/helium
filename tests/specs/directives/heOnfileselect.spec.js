'use strict';

describe('heOnfileselect', function() {
  var elm
  var $scope
  var $rootScope
  var $compile

  function processDirective(directive) {
    elm = angular.element(directive)

    $compile(elm)($scope)
    $scope.$digest()
  }

  beforeEach(function() {
    inject(function($injector) {
      $rootScope = $injector.get('$rootScope')
      $compile = $injector.get('$compile')
    })

    $scope = $rootScope.$new()
  })

  it('registers a "change" event listener on an input field that calls the specified function when the user ' +
     'selects a file', function() {
    $scope.someFunction = jasmine.createSpy()

    processDirective('<input type="file" he-onfileselect="someFunction">')

    elm.trigger('change')

    expect($scope.someFunction).toHaveBeenCalled()
  })

  it('passes the files that the user selected to the supplied function', function() {
    $scope.someFunction = jasmine.createSpy()

    processDirective('<input type="file" he-onfileselect="someFunction">')

    elm.trigger($.Event('change', { target: { files: [1, 2, 3] } }))

    expect($scope.someFunction).toHaveBeenCalledWith([1,2,3])
  })
})