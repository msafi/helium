angular.module('helium')

.controller('Homepage',
  function($scope, postManager) {
    postManager.getPosts().then(function(posts) {
      $scope.posts = posts
    })
  }
)