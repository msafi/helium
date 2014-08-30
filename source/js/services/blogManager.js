'use strict';

angular.module('helium')

.service('blogManager',
  function(backend, systemConfig, $q, utils, $state) {
    var blogManager = {}
    var stateFileName = systemConfig.general.fileNames.state
    var stateFilePath = systemConfig.general.filePaths.state + stateFileName

    return angular.extend(blogManager, {
      updateState: function(newState, fresh) {
        return $q.all().then(function() {
          if (fresh !== true) {
            return blogManager.getState()
          } else {
            return newState
          }
        }).then(function(_newState) {
          return backend.uploadJson({
            key: stateFilePath,
            body: angular.extend(_newState, newState),
            acl: 'public-read'
          })
        })
      },

      initialize: function() {
        var newStateFile = { key: stateFilePath, body: { latestPostMapNumber: 1, tags: [] }, acl: 'public-read' }
        var originalPostMapFile = { key: utils.getPostMapKey(1), body: { posts: [], }, acl: 'public-read' }

        return $q.all({
          state: backend.uploadJson(angular.copy(newStateFile)).then(function() {
            return newStateFile.body
          }),
          postMap: backend.uploadJson(angular.copy(originalPostMapFile)).then(function() {
            return originalPostMapFile.body
          })
        }).then(
          function success(results) {
            return results
          },

          function error(results) {
            return $q.reject(results)
          }
        )
      },

      getState: function() {
        return backend.getFile(stateFilePath).then(
          function success(state) {
            return { state: state }
          },

          function error(errorResults) {
            if (errorResults.error === 'Forbidden') {
              return blogManager.initialize().catch(function(error) {
                return $q.reject(error)
              })
            } else {
              return $q.reject(errorResults)
            }
          }
        ).then(
          function success(results) {
            return results.state
          },

          function error(results) {
            if (results.error === systemConfig.messages.googleAuthenticationError) {
              // We could not upload initialization files because user is not authenticated. Ask user to authenticate.
              $state.go('login', { authError: systemConfig.messages.blogNotInitialized })
            }

            return $q.reject(results)
          }
        )
      }
    })
  }
)