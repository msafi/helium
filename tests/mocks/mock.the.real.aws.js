'use strict';

/* jshint undef: false */

AWS.S3 = function() {
  var results = {}

  function returnThis() { /* jshint validthis: true */ return this }

  _.each([
    'putObject',
    'on',
    'send',
    'getObject',
    'listObjects',
    'deleteObject',
    'headObject'
  ], function(fnName) {
    results[fnName] = returnThis
  })

  return results
}