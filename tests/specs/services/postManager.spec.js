'use strict';

describe('postManager', function() {
  var postManager
  var backend
  var postMapManager
  var blogManager
  var $q
  var utils

  beforeEach(function() {
    inject(function($injector) {
      postManager = $injector.get('postManager')
      postMapManager = $injector.get('postMapManager')
      backend = $injector.get('backend')
      blogManager = $injector.get('blogManager')
      $q = $injector.get('$q')
      utils = $injector.get('utils')
    })

    flushAll()
  })

  describe('savePost', function() {
    var passedArgument
    var postContent = {
      id: '123',
      body: 'foo',
      title: 'bar'
    }

    beforeEach(function() {
      spyOn(backend, 'uploadJson')
      spyOn(postMapManager, 'update')
    })

    it('creates the post file and uploads it to the back-end', function() {
      postManager.savePost(postContent)

      passedArgument = backend.uploadJson.calls.argsFor(0)[0]

      $timeout.flush()

      expect(passedArgument.key).toBeDefined()
      expect(passedArgument.body).toEqual(postContent)
      expect(passedArgument.acl).toBe('public-read')
    })

    it('updates post maps', function() {
      postManager.savePost(postContent)

      passedArgument = postMapManager.update.calls.argsFor(0)[0]

      $timeout.flush()

      expect(passedArgument).toBe(postContent)
    })
  })

  describe('getPosts', function() {
    it('asks blogManager for the number of the latest post map then retrieves the latest post map ' +
       'then returns the posts array from it', function() {
      spyOn(blogManager, 'getState').and.returnValue($q.when({ latestPostMapNumber: 2 }))
      spyOn(backend, 'getFile').and.returnValue($q.when({ posts: ['foo', 'bar'] }))

      postManager.getPosts().then(function(results) {
        expect(results).toEqual(['foo', 'bar'])
      })

      $timeout.flush()
    })
  })

  describe('getPost', function() {
    it('takes a post ID and retrieves it from the server using backend.getFile', function() {
      spyOn(backend, 'getFile').and.returnValue($q.when('foo'))

      postManager.getPost(123).then(function(results) {
        expect(results).toBe('foo')
      })

      $timeout.flush()
    })
  })

  describe('generateId', function() {
    it('generates a post ID by getting the current time in ' +
       'milliseconds by delegating to utils.currentTime()', function() {
      spyOn(utils, 'currentTime')

      postManager.generateId()

      expect(utils.currentTime).toHaveBeenCalled()
    })
  })

  describe('deletePost', function() {
    beforeEach(function() {
      spyOn(backend, 'deleteFile')
      spyOn(postMapManager, 'update')

      postManager.deletePost({ id: 123 })

      $timeout.flush()
    })

    it('takes post data and calls backend.deleteFile', function() {
      expect(backend.deleteFile).toHaveBeenCalled()
    })

    it('updates post maps', function() {
      expect(postMapManager.update).toHaveBeenCalledWith({ id: 123 }, true)
    })
  })
})