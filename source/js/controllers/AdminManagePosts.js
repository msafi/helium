angular.module('helium')

.controller('AdminManagePosts',
  function($scope, postManager) {
    angular.extend($scope, {
      deletePost: function(post) {
        $scope.globals.loading = true
        postManager.deletePost(post).then(function() {
          return postManager.getPosts()
        }).then(function(posts) {
          $scope.posts = posts
        }).finally(function() {
          $scope.globals.loading = false
        })
      }
    })

    $scope.globals.loading = true
    postManager.getPosts().then(function(posts) {
      $scope.posts = posts
    }).finally(function() {
      $scope.globals.loading = false
    })
  }
)