'use strict';

var $httpBackend
var $timeout
var config

beforeEach(function() {
  module('helium')

  inject(function($injector) {
    $timeout = $injector.get('$timeout')
    $httpBackend = $injector.get('$httpBackend')
    config = $injector.get('config')
  })
})