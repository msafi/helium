'use strict';

describe('lStorage', function() {
  var lStorage

  beforeEach(function() {
    inject(function($injector) {
      lStorage = $injector.get('lStorage')
    })

    localStorage.clear()
  })

  afterEach(function() {
    localStorage.clear()
  })

  describe('setVal', function() {
    it('wraps the passed value into { value: passedValue } and JSONifies it ' +
       'to ensure safe retrieval in the future', function() {
      lStorage.setVal('foo', 'bar')

      expect(localStorage['foo']).toEqual(angular.toJson({ value: 'bar' }))
    })
  })

  describe('getVal', function() {
    it('retrieves a value that was saved using setVal()', function() {
      lStorage.setVal('foo', 'bar')

      expect(lStorage.getVal('foo')).toBe('bar')
    })

    it('returns undefined if the queried key does not exist', function() {
      expect(lStorage.getVal('foo')).toBeUndefined()
    })
  })
})