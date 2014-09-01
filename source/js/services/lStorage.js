'use strict';

angular.module('helium')

.service('lStorage',
  function() {
    return {
      setVal: function(key, value) {
        localStorage[key] = angular.toJson({ value: value })
      },

      getVal: function(key) {
        return (localStorage[key] === undefined) ? undefined : angular.fromJson(localStorage[key]).value
      }
    }
  }
)