'use strict';

describe('gapi', function() {
  var _gapi
  var $q

  beforeEach(function() {
    inject(function($injector) {
      _gapi = $injector.get('gapi')
      $q = $injector.get('$q')
    })
  })

  describe('authorize', function() {
    it('calls gapi.auth.authorize and returns the results as a promise', function() {
      spyOn(gapi.auth, 'authorize').and.returnValue(true)

      _gapi.authorize()

      expect(gapi.auth.authorize).toHaveBeenCalled()
    })
  })

  describe('signOut', function() {
    it('first authorizes the user in order to get a fresh access token, which gets used to ' +
       'revoke access of Helium. Once token is obtained, it asks Google to revoke it.', function() {
      spyOn(_gapi, 'authorize').and.returnValue($q.when({ access_token: 'foo' }))

      _gapi.signOut()

      $httpBackend.expectJSONP('https://accounts.google.com/o/oauth2/revoke?token=foo').respond(200)
      expect(_gapi.authorize).toHaveBeenCalled()

      $httpBackend.flush()
      $timeout.flush()
    })

    it('rejects the promise and does not call Google when authorization fails because that means the user is ' +
       'already signed out', function() {
      spyOn(_gapi, 'authorize').and.returnValue($q.reject(false))

      _gapi.signOut()

      expect(_gapi.authorize).toHaveBeenCalled()

      $httpBackend.verifyNoOutstandingRequest()
      $timeout.flush()
    })
  })
})