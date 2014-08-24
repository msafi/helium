angular.module('helium')

.service('utils',
  function(config) {

    return {
      currentTime: function() {
        return (new Date).getTime()
      },

      parseHashQs: function() {
        var params = {}
        var queryString = location.hash.substring(1)
        var regex = /([^&=]+)=([^&]*)/g
        var m

        while (m = regex.exec(queryString)) {
          params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        }

        return params
      },

      getPostMapKey: function(postMapNumber) {
        return '{0}post-map-{1}.json'.format(config.general.filePaths.postMaps, postMapNumber)
      },
    }
  }
)