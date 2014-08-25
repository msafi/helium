angular.module('helium')

.controller('Homepage',
  function($scope, postManager) {
    $scope.globals.loading = true
    postManager.getPosts().then(function(posts) {
      $scope.posts = posts
    }).finally(function() {
      $scope.globals.loading = false
    })
  }
)