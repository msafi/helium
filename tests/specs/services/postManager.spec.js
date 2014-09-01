'use strict';

describe('postManager', function() {
  var postManager
  var backend
  var blogManager
  var $q
  var utils

  beforeEach(function() {
    inject(function($injector) {
      postManager = $injector.get('postManager')
      backend = $injector.get('backend')
      blogManager = $injector.get('blogManager')
      $q = $injector.get('$q')
      utils = $injector.get('utils')
    })
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
    })

    it('creates the post file and uploads it to the back-end', function() {
      postManager.savePost(postContent)

      passedArgument = backend.uploadJson.calls.argsFor(0)[0]

      expect(passedArgument.key).toBeDefined()
      expect(passedArgument.body).toEqual(postContent)
      expect(passedArgument.acl).toBe('public-read')
    })
  })

  describe('getPosts', function() {
    it('lists all the files in the posts folder and gets the file meta of each post file', function() {
      spyOn(backend, 'listFiles').and.returnValue($q.when({ Contents: [{ Key: 1 }, { Key: 2 }] }))
      spyOn(backend, 'getFileMeta').and.returnValue($q.when('foo'))

      postManager.getPosts().then(function(results) {
        expect(results).toEqual(['foo', 'foo'])
      })

      $timeout.flush()
    })

    it('returns the error when any of its promises fail', function() {
      spyOn(backend, 'listFiles').and.returnValue($q.reject(false))

      postManager.getPosts().then(function(results) {
        expect(results).toBe(false)
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

      postManager.deletePost({ id: 123 })
    })

    it('takes post data and calls backend.deleteFile', function() {
      expect(backend.deleteFile).toHaveBeenCalled()
    })
  })

  describe('rebuildPosts', function() {
    it('is used when rebuilding posts is required after changing how the blog works ' +
       'but for now, it just returns an empty promise', function() {
      expect(postManager.rebuildPosts().then).toBeDefined()

      $timeout.flush()
    })
  })
})