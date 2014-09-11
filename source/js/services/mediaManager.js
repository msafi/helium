'use strict';

angular.module('helium')

.service('mediaManager',
  function(backend, systemConfig, $q) {
    var mediaManager = {}

    return angular.extend(mediaManager, {
      uploadImage: function(file) {
        var path = systemConfig.general.filePaths.media

        return backend.uploadFile(angular.extend(file, {
          key: path + file.name,
          acl: 'public-read'
        }))
      },

      // Not sure how to test FileReader
      loadFile: /* istanbul ignore next */ function(file) {

        var loadedFile = $q.defer()
        var reader = new FileReader()

        reader.onload = function(loadEvent) {
          loadedFile.resolve(loadEvent.target.result)
        }

        reader.readAsDataURL(file)

        return loadedFile.promise
      }
    })
  }
)