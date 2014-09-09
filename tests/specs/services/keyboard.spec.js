'use strict';

describe('keyboard', function() {
  var keyboard
  var $document
  var $injector
  var $rootScope

  beforeEach(function() {
    inject(function(_$injector_) {
      $injector = _$injector_

      $document = $injector.get('$document')
      $rootScope = $injector.get('$rootScope')
    })
  })

  describe('initialization', function() {
    it('turns off any pre-registered events with the namespace keydown.keyboard', function() {
      var foo = 0

      $document.on('keydown.keyboard.foo', function() {
        ++foo
      })

      $document.trigger('keydown.keyboard.foo')

      expect(foo).toBe(1)

      keyboard = $injector.get('keyboard')

      $document.trigger('keydown.keyboard.foo')

      expect(foo).toBe(1)
    })

    it('registers an event listener through $rootScope.$on for "$stateChangeSuccess" and "$destroy", which turns off ' +
       'all events in the keydown.keyboard namespace', function() {
      var foo = 0
      keyboard = $injector.get('keyboard')

      $document.on('keydown.keyboard.foo', function() {
        ++foo
      })

      $document.trigger('keydown.keyboard.foo')

      expect(foo).toBe(1)

      $rootScope.$broadcast('$stateChangeSuccess')

      $document.trigger('keydown.keyboard.foo')

      expect(foo).toBe(1)

      $document.on('keydown.keyboard.foo', function() {
        ++foo
      })

      $document.trigger('keydown.keyboard.foo')

      expect(foo).toBe(2)

      $rootScope.$broadcast('$destroy')

      $document.trigger('keydown.keyboard.foo')

      expect(foo).toBe(2)
    })
  })

  describe('bind method', function() {
    beforeEach(function() {
      keyboard = $injector.get('keyboard')
    })

    it('is used to bind an array of modifiers and a key with a callback function', function() {
      var foo = 0

      keyboard.bind(['cmd'], 'p', function() {
        ++foo
      })

      $document.trigger($.Event('keydown', { keyCode: 80, metaKey: true }))

      expect(foo).toBe(1)
    })

    it('keeps track of existing bindings and updates the binding if the same key combination has been used for an ' +
       'earlier binding', function() {
      var foo = 0

      keyboard.bind(['cmd'], 'p', function() {
        ++foo
      })

      keyboard.bind(['cmd'], 'p', function() {
        --foo
      })


      $document.trigger($.Event('keydown', { keyCode: 80, metaKey: true }))

      expect(foo).toBe(-1)
    })
  })
})