'use strict';

describe('utils', function() {
  var utils

  beforeEach(function() {
    inject(function($injector) {
      utils = $injector.get('utils')
    })
  })
})