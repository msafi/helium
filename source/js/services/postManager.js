'use strict';

angular.module('helium')

.service('postManager',
  function($q, utils, backend, blogManager, systemConfig) {
    var postManager = {}
    var currentPost = {}

    return angular.extend(postManager, {
      savePost: function(post) {
        var postFile = {}

        postFile.key = getPostKey(post.id)
        postFile.body = post
        postFile.acl = 'public-read'
        postFile.metadata = {
          title: post.title,
          id: post.id
        }

        return backend.uploadJson(postFile)
      },

      getPosts: function() {
        return backend.listFiles({ prefix: 'content/posts/' }).then(function(postFileNames) {
          var getAllPostMeta = []

          _.each(postFileNames.Contents, function(postData) {
            getAllPostMeta.push(backend.getFileMeta(postData.Key))
          })

          return $q.all(getAllPostMeta)
        }).then(function(allPostMeta) {
          return allPostMeta.reverse()
        }, function(error) {
          return error
        })
      },

      getPost: function(postId, cache) {
        if (postId === currentPost.id && cache !== false) {
          return $q.when(currentPost)
        } else {
          return backend.getFile(getPostKey(postId)).then(function(post) {
            currentPost = post
            return post
          })
        }
      },

      generateId: function() {
        return utils.currentTime()
      },

      deletePost: function(postId) {
        return backend.deleteFile(getPostKey(postId))
      },

      rebuildPosts: function() {
        return $q.when()
      },

      cachePost: function(post) {
        currentPost = post
      }
    })

    function getPostKey(postId) {
      return systemConfig.general.filePaths.posts + postId + '.json'
    }
  }
)