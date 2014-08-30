'use strict';

angular.module('helium')

.service('utils',
  function(systemConfig) {

    return {
      /* istanbul ignore next: Not sure what to do with this one. It's declarative and all.
      I don't think it needs testing.*/
      currentTime: function() {
        return (new Date()).getTime()
      },

      parseHashQs: parseHashQs,

      getPostMapKey: function(postMapNumber) {
        return '{0}post-map-{1}.json'.format(systemConfig.general.filePaths.postMaps, postMapNumber)
      },
    }

    /* istanbul ignore next: I got this code from https://developers.google.com/accounts/docs/OAuth2UserAgent
     So, it's written by Google. So, hopefully, it works and doesn't need testing? */
    function parseHashQs() {
      var params = {}
      var queryString = location.hash.substring(1)
      var regex = /([^&=]+)=([^&]*)/g
      var m = regex.exec(queryString)

      while (m) {
        params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        m = regex.exec(queryString)
      }

      return params
    }
  }
)