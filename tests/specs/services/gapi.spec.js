'use strict';

describe('gapi', function() {
  var _gapi

  beforeEach(function() {
    inject(function($injector) {
      _gapi = $injector.get('gapi')
    })
  })

  describe('authorize', function() {
    it('calls gapi.auth.authorize and returns the results as a promise', function() {
      spyOn(gapi.auth, 'authorize').and.returnValue(true)

      _gapi.authorize()

      expect(gapi.auth.authorize).toHaveBeenCalled()
    })
  })
})