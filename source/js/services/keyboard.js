'use strict';

angular.module('helium')

.service('keyboard',
  function($document, $rootScope) {
    var keyboard = {}
    var keyMap = {
      p: [80],
      cmd: 'metaKey',
      enter: [13]
    }

    $rootScope.$on('$stateChangeSuccess', function() {
      $document.off('keydown.keyboard')
    })

    return angular.extend(keyboard, {
      bind: function(modifiers, key, callback) {
        $document.on('keydown.keyboard', function(e) {
          var requiredModifiersArePressed = _.map(modifiers, function(modifier) {
            return event[keyMap[modifier]] === true
          })

          if (_.all(requiredModifiersArePressed) === true && _.contains(keyMap[key], event.keyCode) === true) {
            e.preventDefault()

            $rootScope.$apply(function() {
              callback()
            })
          }
        })
      }
    })
  }
)