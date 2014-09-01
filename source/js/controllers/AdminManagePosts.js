'use strict';

angular.module('helium')

.controller('AdminManagePosts',
  function($scope, postManager) {
    angular.extend($scope, {
      deletePost: function(post) {
        $scope.globals.loading = true

        return postManager.deletePost(post).then(function() {
          _.remove($scope.posts, { id: post.id })
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