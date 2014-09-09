'use strict';

angular.module('helium')

.service('keyboard',
  function($document, $rootScope) {
    var keyboard = {}
    var bindings = []
    var keyMap = {
      p: [80],
      cmd: 'metaKey',
      enter: [13]
    }

    $document.off('keydown.keyboard')

    $rootScope.$on('$stateChangeSuccess', function() {
      $document.off('keydown.keyboard')
    })

    $rootScope.$on('$destroy', function() {
      $document.off('keydown.keyboard')
    })

    return angular.extend(keyboard, {
      bind: function(modifiers, key, callback) {
        var signature = _.sortBy(modifiers).toString() + key.toString()

        if (_.contains(bindings, signature) === true) {
          $document.off('keydown.keyboard.' + signature)
        } else {
          bindings.push(signature)
        }

        $document.on('keydown.keyboard.' + signature, function(e) {
          var requiredModifiersArePressed = _.map(modifiers, function(modifier) {
            return e[keyMap[modifier]] === true
          })

          if (_.all(requiredModifiersArePressed) === true && _.contains(keyMap[key], e.keyCode) === true) {
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