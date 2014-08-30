'use strict';

angular.module('helium')

.service('utils',
  function(systemConfig) {

    return {
      currentTime: function() {
        return (new Date()).getTime()
      },

      parseHashQs: function() {
        var params = {}
        var queryString = location.hash.substring(1)
        var regex = /([^&=]+)=([^&]*)/g
        var m = regex.exec(queryString)

        while (m) {
          params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
          m = regex.exec(queryString)
        }

        return params
      },

      getPostMapKey: function(postMapNumber) {
        return '{0}post-map-{1}.json'.format(systemConfig.general.filePaths.postMaps, postMapNumber)
      },
    }
  }
)