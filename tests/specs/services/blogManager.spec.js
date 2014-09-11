'use strict';

describe('blogManager', function() {
  var blogManager
  var backend
  var $q
  var $state

  beforeEach(function() {
    inject(function($injector) {
      blogManager = $injector.get('blogManager')
      backend = $injector.get('backend')
      $q = $injector.get('$q')
      $state = $injector.get('$state')
    })
  })

  describe('updateConfig method', function() {
    it('extends the configurations with the given configurations', function() {
      spyOn(backend, 'getFile').and.returnValue($q.reject())

      blogManager.updateConfig({ name: 'foo' })

      $timeout.flush()

      expect(config.name).toBe('foo')
    })

    it('retrieves the index.html file from the server using backend.getFile', function() {
      spyOn(backend, 'getFile').and.returnValue($q.reject())

      blogManager.updateConfig()

      $timeout.flush()

      expect(backend.getFile).toHaveBeenCalled()
    })

    it('rewrites the new configuration into the index.html and uploads it back to the server', function() {
      spyOn(backend, 'getFile').and.returnValue($q.when('some html heliumConfigurations = {\nfoo: "bar"\n};;; more html'))
      spyOn(backend, 'uploadFile')

      blogManager.updateConfig({ name: 'bar' })

      $timeout.flush()

      expect(backend.uploadFile).toHaveBeenCalledWith({
        key: 'index.html',
        body: 'some html heliumConfigurations = ' + JSON.stringify(config, null, 2) + ';;; more html',
        acl: 'public-read',
        type: 'text/html'
      })
    })
  })
})