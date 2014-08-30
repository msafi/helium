'use strict';

angular.module('helium')

.service('localStorage',
  function() {
    return {
      setVal: function(key, value) {
        localStorage[key] = angular.toJson({ value: value })
      },

      getVal: function(key) {
        if (localStorage[key] !== undefined) {
          return angular.fromJson(localStorage[key]).value
        } else {
          return null
        }
      }
    }
  }
)