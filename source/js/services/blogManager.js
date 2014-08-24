angular.module('helium')

.service('blogManager',
  function(amazonApi, config, $q, utils) {
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
        return amazonApi.getFile(stateFilePath).then(function(state) {
          if (state.error === 'Forbidden') {
            // State file couldn't be found. This means blog files have not been setup. Initial setup is required.
            var newStateFile = { key: stateFilePath, body: { latestPostMapNumber: 1, tags: [] }, acl: 'public-read' }
            var originalPostMapFile = { key: utils.getPostMapKey(1), body: { posts: [], }, acl: 'public-read' }

            return $q.all({
              stateFile: amazonApi.uploadJson(angular.copy(newStateFile)).then(function() {
                return newStateFile.body
              }),
              originalPostMapFile: amazonApi.uploadJson(angular.copy(originalPostMapFile)).then(function() {
                return originalPostMapFile.body
              })
            })
          } else {
            return { stateFile: state }
          }
        }).then(function(results) {
          return results.stateFile
        })
      }
    })
  }
)