'use strict';

angular.module('helium')

.service('postManager',
  function($q, utils, backend, blogManager, systemConfig) {
    var postManager = {}

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

      getPost: function(postId) {
        return backend.getFile(getPostKey(postId)).then(function(post) {
          return post
        })
      },

      generateId: function() {
        return utils.currentTime()
      },

      deletePost: function(post) {
        return backend.deleteFile(getPostKey(post.id))
      },

      rebuildPosts: function() {
        return $q.when()
      }
    })

    function getPostKey(postId) {
      return systemConfig.general.filePaths.posts + postId + '.json'
    }
  }
)