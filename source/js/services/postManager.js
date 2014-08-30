'use strict';

angular.module('helium')

.service('postManager',
  function($q, utils, backend, blogManager, systemConfig, postMapManager) {
    var postManager = {}

    return angular.extend(postManager, {
      savePost: function(post) {
        var postFile = {}

        postFile.key = getPostKey(post.id)
        postFile.body = post
        postFile.acl = 'public-read'

        return $q.all({
          uploadPost: backend.uploadJson(postFile),
          updatePostMaps: postMapManager.update(post)
        })
      },

      getPosts: function() {
        return blogManager.getState().then(function(state) {
          return utils.getPostMapKey(state.latestPostMapNumber)
        }).then(function(latestPostMapFileName) {
          return backend.getFile(latestPostMapFileName)
        }).then(function(postMap) {
          return postMap.posts
        })
      },

      getPost: function(postId) {
        return backend.getFile(getPostKey(postId)).then(function(post) {
          return post
        })
      },

      generateId: function() {
        return utils.currentTime()
      },

      deletePost: function(post) {
        return $q.all({
          deletePostFile: backend.deleteFile(getPostKey(post.id)),
          updatePostMaps: postMapManager.update(post, true)
        })
      }
    })

    function getPostKey(postId) {
      return systemConfig.general.filePaths.posts + postId + '.json'
    }
  }
)