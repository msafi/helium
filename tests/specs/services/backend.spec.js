'use strict';

describe('backend', function() {
  var fileKey = 'foo.json'
  var backend
  var aws
  var user

  beforeEach(function() {
    inject(function($injector) {
      backend = $injector.get('backend')
      aws = $injector.get('aws')
      user = $injector.get('user')
    })
  })

  describe('uploadFile', function() {
    it('delegates to aws.putObject', function() {
      spyOn(aws, 'putObject').and.returnValue('bar')

      expect(backend.uploadFile('foo')).toBe('bar')
      expect(aws.putObject).toHaveBeenCalledWith('foo')
    })
  })

  describe('uploadJson', function() {
    it('delegates to uploadFile() after settings some defaults', function() {
      var file = { body: { val: 1 } }

      spyOn(backend, 'uploadFile').and.returnValue('bar')

      expect(backend.uploadJson(angular.copy(file))).toBe('bar')
      expect(backend.uploadFile).toHaveBeenCalledWith({
        body: angular.toJson(file.body),
        type: 'application/json'
      })
    })
  })

  describe('getFile', function() {
    it('sends a GET HTTP request for the file key to the backend file system', function() {
      $httpBackend.expectGET(aws.bucketUrl + '/' + fileKey).respond(200)

      backend.getFile(fileKey)

      flushAll()
    })

    it('sends cache-control: no-cache header if user is logged in', function() {
      spyOn(user, 'hasValidCredentials').and.returnValue(true)

      $httpBackend.expectGET(
        aws.bucketUrl + '/' + fileKey,
        {
          'Accept': 'application/json, text/plain, */*',
          'cache-control': 'no-cache'
        }
      ).respond(200)

      backend.getFile(fileKey)

      flushAll()
    })

    it('returns a promise that resolves to response data when the HTTP request succeeds', function() {
      $httpBackend.expectGET(aws.bucketUrl + '/' + fileKey).respond(200, 'foo')

      backend.getFile(fileKey).then(function(response) {
        expect(response).toBe('foo')
      })

      flushAll()
    })

    it('returns a promise that rejects with { error: error.statusText } ' +
       'when the HTTP request errors', function() {
      $httpBackend.expectGET(aws.bucketUrl + '/' + fileKey).respond(500, null, null, 'foo')

      backend.getFile(fileKey).then(angular.noop, function(error) {
        expect(error).toEqual({ error: 'foo' })
      })

      flushAll()
    })
  })

  describe('deleteFile', function() {
    it('delegates to aws.deleteObject()', function() {
      spyOn(aws, 'deleteObject').and.returnValue('bar')

      expect(backend.deleteFile(fileKey)).toBe('bar')
      expect(aws.deleteObject).toHaveBeenCalledWith(fileKey)
    })
  })
})