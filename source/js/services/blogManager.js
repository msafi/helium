angular.module('helium')

.service('blogManager',
  function(amazonApi, config, $q) {
    var blogManager = {}
    var stateFileName = config.general.fileNames.state
    var stateFilePath = config.general.filePaths.state + stateFileName

    return angular.extend(blogManager, {
      updateState: function(newState, fresh) {
        $q.all().then(function() {
          if (fresh !== true) {
            return blogManager.getState()
          } else {
            return newState
          }
        }).then(function(_newState) {
          return amazonApi.uploadJson({
            key: stateFilePath,
            body: angular.extend(_newState, newState),
            acl: 'public-read'
          })
        })
      },

      getState: function() {
        return amazonApi.getFile(stateFilePath).then(function(stateFile) {
          // @todo: stateFile is probably never a falsy value. Do better checking.
          return stateFile || {
            'latestPostMapNumber': 0,
            'tags': []
          }
        })
      }
    })
  }
)