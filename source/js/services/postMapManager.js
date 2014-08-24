angular.module('helium')

.service('postMapManager',
  function(blogManager, amazonApi, config, $q, utils) {
    var postMapManager = {}
    var postMapLimit = config.general.postMapLimit
    var latestPostMapKey = ''
    var state = {}

    return angular.extend(postMapManager, {
      update: function(post, remove) {
        // First get the state, so we know what the latest post map file is.
        return blogManager.getState().then(function(state) {
          return state
        }).then(function(_state) {
          state = _state
          latestPostMapKey = utils.getPostMapKey(state.latestPostMapNumber)

          return amazonApi.getFile(latestPostMapKey)
        }).then(function(latestPostMap) {
          // We have the latest post map. Let's either update it, delete it, or create a new one.
          var postData = { title: post.title, tags: post.tags, id: post.id }
          var postMapFile = {}
          var asynchronousWork = {}

          if (remove !== true) {
            // We're not removing a post, we're adding a post.
            if (latestPostMap.posts.length >= postMapLimit) {
              // We cannot add to this post map anymore. It has reached the limit.
              // We need to create a new post map and increment the post map pointer.
              asynchronousWork['updateState'] = blogManager.updateState(++state.latestPostMapNumber, true)

              latestPostMapKey = utils.getPostMapKey(state.latestPostMapNumber)

              postMapFile.body = { posts: [postData] }
            } else {
              // This map has still not reached its limit. We can add to it.
              latestPostMap.posts.unshift(postData)

              postMapFile.body = latestPostMap
            }

            postMapFile.key = latestPostMapKey
            postMapFile.acl = 'public-read'

            asynchronousWork['uploadPostMapFile'] = amazonApi.uploadJson(postMapFile)
          } else {
            // We're removing a post
            if (latestPostMap.posts.length <= 1) {
              // The post map has one or less posts. We should remove the post from it, delete it, and decrement
              // the post map pointer. But if it is post map #1, we should still remove the post but not decrement
              // the pointer or delete the file.
              if (state.latestPostMapNumber !== 1) {
                // not post-map-1.json
                asynchronousWork['deletePostMap'] = amazonApi.deleteObject(utils.getPostMapKey(state.latestPostMapNumber))
                asynchronousWork['updateState'] = blogManager.updateState(--state.latestPostMapNumber, true)
              } else {
                // post-map-1.json
                latestPostMap.posts = []

                postMapFile.body = latestPostMap
                postMapFile.key = utils.getPostMapKey(state.latestPostMapNumber)
                postMapFile.acl = 'public-read'

                asynchronousWork['uploadPostMapFile'] = amazonApi.uploadJson(postMapFile)
              }
            } else {
              // The post map has more than 1 post. We should remove the post, then update the file.
              _.remove(latestPostMap.posts, { id: post.id })

              postMapFile.body = latestPostMap
              postMapFile.key = utils.getPostMapKey(state.latestPostMapNumber)
              postMapFile.acl = 'public-read'

              asynchronousWork['uploadPostMapFile'] = amazonApi.uploadJson(postMapFile)
            }
          }

          return $q.all(asynchronousWork)
        })
      }
    })
  }
)