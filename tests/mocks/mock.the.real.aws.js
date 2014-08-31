AWS.S3 = function() {
  var results = {}

  function returnThis() { return this }

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