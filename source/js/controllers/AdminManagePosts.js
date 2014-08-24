angular.module('helium')

.controller('AdminManagePosts',
  function($scope, postManager) {
    angular.extend($scope, {
      deletePost: function(post) {
        $scope.globals.loading = true
        postManager.deletePost(post).then(function() {
          return postManager.getPosts()
        }).then(function(posts) {
          $scope.globals.loading = false
          $scope.posts = posts
        })
      }
    })

    $scope.globals.loading = true
    postManager.getPosts().then(function(posts) {
      $scope.globals.loading = false
      $scope.posts = posts
    })
  }
)