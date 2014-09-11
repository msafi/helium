'use strict';

describe('mediaManager', function() {
  var mediaManager
  var backend
  var $q

  beforeEach(function() {
    inject(function($injector) {
      mediaManager = $injector.get('mediaManager')
      backend = $injector.get('backend')
      $q = $injector.get('$q')
    })
  })

  describe('uploadImage', function() {
    it('sets some defaults and delegates to backend.uploadFile', function() {
      var someImageBlob = { aLotOfDateNotReallyObjectLiteralLikeThis: true, name: 'foo' }

      spyOn(backend, 'uploadFile')

      mediaManager.uploadImage(someImageBlob)

      expect(backend.uploadFile).toHaveBeenCalledWith(angular.extend(someImageBlob, {
        key: systemConfig.general.filePaths.media + someImageBlob.name,
        acl: 'public-read'
      }))
    })
  })
})