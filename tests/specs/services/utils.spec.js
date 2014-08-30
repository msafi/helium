'use strict';

describe('utils', function() {
  var utils

  beforeEach(function() {
    inject(function($injector) {
      utils = $injector.get('utils')
    })
  })

  describe('getPostMapKey', function() {
    it('takes post map number as integer and returns the key for the post map', function() {
      expect(utils.getPostMapKey(1)).toBe('{0}post-map-{1}.json'.format(systemConfig.general.filePaths.postMaps, 1))
    })
  })
})