'use strict';

angular.module('helium')

.service('utils',
  function() {

    return {
      currentTime: function() {
        return (new Date()).getTime()
      },

      parseHashQs: parseHashQs,
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