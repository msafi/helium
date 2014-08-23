angular.module('helium')

.service('postManager',
  function($q, utils, amazonApi, blogManager, config) {
    var postManager = {}
    var postMapLimit = config.general.postMapLimit
    var latestPostMapKey = ''
    var state = {}

    return angular.extend(postManager, {
      updatePostMaps: function(post) {
        return blogManager.getState().then(function(state) {
          return state
        }).then(function(_state) {
          state = _state
          latestPostMapKey = getLatestPostMapKey(state)

          return amazonApi.getFile(latestPostMapKey)
        }).then(function(latestPostMap) {
          var postData = { title: post.title, tags: post.tags, id: post.id }
          var postMapFile = {}
          var asynchronousWork = {}

          if (latestPostMap.posts.length >= postMapLimit) {
            asynchronousWork['updateState'] = blogManager.updateState(++state.latestPostMapNumber, true)

            latestPostMapKey = getLatestPostMapKey(state)

            postMapFile.body = { posts: [postData] }
          } else {
            latestPostMap.posts.push(postData)

            postMapFile.body = latestPostMap
          }

          postMapFile.key = latestPostMapKey
          postMapFile.acl = 'public-read'

          asynchronousWork['uploadPostMapFile'] = amazonApi.uploadJson(postMapFile)

          return $q.all(asynchronousWork)
        })
      },

      savePost: function(post) {
        var postFile = {}
        var postFilePath = config.general.filePaths.posts
        var postFileName = post.id + '.json'

        postFile.key = postFilePath + postFileName
        postFile.body = post
        postFile.acl = 'public-read'

        return $q.all({
          uploadPost: amazonApi.uploadJson(postFile),
          updatePostMaps: postManager.updatePostMaps(post)
        })
      },

      getPosts: function() {
        return blogManager.getState().then(function(state) {
          return getLatestPostMapKey(state)
        }).then(function(latestPostMapFileName) {
          return amazonApi.getFile(latestPostMapFileName)
        }).then(function(postMap) {
          return postMap.posts
        })
      },

      getPost: function(postId) {
        var postKey = config.general.filePaths.posts + postId + '.json'

        return amazonApi.getFile(postKey).then(function(post) {
          return post
        })
      },

      generateId: function() {
        return utils.currentTime()
      }
    })

    function getLatestPostMapKey(state) {
      return '{0}post-map-{1}.json'.format(config.general.filePaths.postMaps, state.latestPostMapNumber)
    }
  }
)