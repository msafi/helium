'use strict';

var $httpBackend
var $timeout
var config
var systemConfig
var $q

var beforeAll = false
beforeEach(function() {
  module('helium')

  inject(function($injector) {
    $timeout = $injector.get('$timeout')
    $httpBackend = $injector.get('$httpBackend')
    config = $injector.get('config')
    systemConfig = $injector.get('systemConfig')
    $q = $injector.get('$q')
  })

  $httpBackend.whenGET('html/homepage.html').respond(200)

  if (beforeAll === true) {
    return true
  } else {
    beforeAll = true
  }
})

afterEach(function() {
  $httpBackend.verifyNoOutstandingExpectation()
  $httpBackend.verifyNoOutstandingRequest()

  $timeout.verifyNoPendingTasks()
})

function flushAll() {
  $httpBackend.flush()
  $timeout.flush()
}