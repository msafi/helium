'use strict';

describe('user', function() {
  var user
  var lStorage
  var utils
  var gapi
  var $q

  beforeEach(function() {
    inject(function($injector) {
      user = $injector.get('user')
      lStorage = $injector.get('lStorage')
      utils = $injector.get('utils')
      gapi = $injector.get('gapi')
      $q = $injector.get('$q')
    })
  })

  afterEach(function() {
    localStorage.clear()
  })

  describe('hasValidCredentials', function() {
    it('returns true if credentialsExpirationTime is larger than current time and ' +
       'user identity is the same as config.amazonRoleArn', function() {
      lStorage.setVal('credentialsExpirationTime', utils.currentTime() + 3600000)
      lStorage.setVal('identity', config.amazonRoleArn)

      expect(user.hasValidCredentials()).toBe(true)
    })

    it('returns false otherwise', function() {
      expect(user.hasValidCredentials()).toBe(false)
    })
  })

  describe('authenticate', function() {
    it('resolves to true if user has valid credentials', function() {
      spyOn(user, 'hasValidCredentials').and.returnValue(true)

      user.authenticate().then(function(results) {
        expect(results).toBe(true)
      })

      $timeout.flush()
    })

    it('calls gapi.authorize if user does not have valid credentials', function() {
      spyOn(gapi, 'authorize').and.returnValue($q.when({ id_token: 123 }))

      user.authenticate()

      $timeout.flush()

      expect(gapi.authorize).toHaveBeenCalled()
    })

    it('stores user credentials in localStorage when gapi.authorize succeeds', function() {
      spyOn(gapi, 'authorize').and.returnValue($q.when({ id_token: 123 }))

      user.authenticate().then(function(results) {
        expect(results).toBe(true)
      })

      $timeout.flush()

      expect(lStorage.getVal('credentialsExpirationTime')).toBeDefined()
      expect(lStorage.getVal('idToken')).toBeDefined()
      expect(lStorage.getVal('identity')).toBeDefined()
    })

    it('rejects the promise with Google auth error message when gapi.authorize fails', function() {
      spyOn(gapi, 'authorize').and.returnValue($q.reject())

      user.authenticate().catch(function(error) {
        expect(error).toEqual({ error: systemConfig.messages.googleAuthenticationError })
      })

      $timeout.flush()
    })
  })
})