'use strict';

describe('blogManager', function() {
  var blogManager
  var backend
  var $q
  var backendUploadJsonSpy
  var backendGetFileSpy
  var $state

  beforeEach(function() {
    inject(function($injector) {
      blogManager = $injector.get('blogManager')
      backend = $injector.get('backend')
      $q = $injector.get('$q')
      $state = $injector.get('$state')
    })

    flushAll()

    backendUploadJsonSpy = spyOn(backend, 'uploadJson')
    backendUploadJsonSpy.and.returnValue($q.all())

    backendGetFileSpy = spyOn(backend, 'getFile')
    backendGetFileSpy.and.returnValue($q.all())
  })

  describe('updateState', function() {
    beforeEach(function() {
      spyOn(blogManager, 'getState').and.returnValue({ foo: 1 })
    })

    it('gets a fresh state from the server before it attempts to update', function() {
      blogManager.updateState({ newValue: 1 })

      $timeout.flush()

      expect(blogManager.getState).toHaveBeenCalled()
    })

    it('does not get a fresh state from server before it attempts to update if fresh === true', function() {
      blogManager.updateState({}, true)

      $timeout.flush()

      expect(blogManager.getState).not.toHaveBeenCalled()
      expect(backend.uploadJson).toHaveBeenCalled()
    })

    it('extends existing state with new state properties if fresh !== true', function() {
      blogManager.updateState({
        bar: 1
      })

      $timeout.flush()

      var argumentPassedToUploadJson = backend.uploadJson.calls.argsFor(0)[0]

      expect(argumentPassedToUploadJson.body).toEqual({
        foo: 1,
        bar: 1
      })
    })

    it('marks the updated state file as publicly readable', function() {
      blogManager.updateState({
        bar: 1
      }, true)

      $timeout.flush()

      var argumentPassedToUploadJson = backend.uploadJson.calls.argsFor(0)[0]

      expect(argumentPassedToUploadJson.acl).toBe('public-read')
    })
  })

  describe('initialize', function() {
    it('uploads the initial required files of Helium to the server and returns the results', function() {
      var initializeResults = {}

      blogManager.initialize().then(function(results) {
        initializeResults = results
      })

      $timeout.flush()

      expect(backend.uploadJson.calls.count()).toBe(2)
      expect(initializeResults.state).toBeDefined()
      expect(initializeResults.postMap).toBeDefined()
    })

    it('returns the results of the operation even if the upload process fails', function() {
      var initializeResults = {}
      backendUploadJsonSpy.and.returnValue($q.reject('foo'))

      blogManager.initialize().then(angular.noop, function(results) {
        initializeResults = results
      })

      $timeout.flush()

      expect(backend.uploadJson.calls.count()).toBe(2)
      expect(initializeResults).toBe('foo')
    })
  })

  describe('getState', function() {
    it('retrieves the state file from the server using backend.getFile', function() {
      var getStateResults = {}

      backendGetFileSpy.and.returnValue($q.all(['foo']))

      blogManager.getState().then(function(results) {
        getStateResults = results
      })

      $timeout.flush()

      expect(getStateResults).toEqual(['foo'])
    })

    it('initializes the blog for first time use if backend.getFile fails with error message "Forbidden"', function() {
      backendGetFileSpy.and.returnValue($q.reject({ error: 'Forbidden' }))
      spyOn(blogManager, 'initialize').and.returnValue($q.when({ state: 'foo' }))

      blogManager.getState()

      $timeout.flush()

      expect(blogManager.initialize).toHaveBeenCalled()
    })

    it('redirects to the login state if blogManager.initialize() fails with Google auth error message', function() {
      backendGetFileSpy.and.returnValue($q.reject({ error: 'Forbidden' }))
      spyOn(blogManager, 'initialize').and.returnValue(
        $q.reject({ error: systemConfig.messages.googleAuthenticationError })
      )
      spyOn($state, 'go')

      blogManager.getState()

      $timeout.flush()

      expect($state.go).toHaveBeenCalled()
    })

    it('returns the results of the error if backend.getFile fails or blogManager.initialize fails due' +
       'to a reason other than Google auth error', function() {
      backendGetFileSpy.and.returnValue($q.reject('foo'))
      spyOn(blogManager, 'initialize').and.returnValue($q.reject('foo'))
      spyOn($state, 'go')

      blogManager.getState().catch(function(results) {
        expect($state.go).not.toHaveBeenCalled()
        expect(results).toBe('foo')
      })

      $timeout.flush()
    })
  })
})