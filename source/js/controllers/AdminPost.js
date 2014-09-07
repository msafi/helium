'use strict';

angular.module('helium')

.controller('AdminPost',
  function($scope, postManager, systemConfig, $state, $stateParams) {
    var postId = $stateParams.postId  || postManager.generateId()

    angular.extend($scope, {
      post: {},

      submitPost: function() {
        if ($scope.newPostForm.$valid === true) {
          $scope.globals.loading = true

          $scope.post.id = postId

          postManager.savePost($scope.post).then(
            function success() {
              $state.go('post', { postId: postId })
            },

            function error(error) {
              console.log(error)
            }
          ).finally(function() {
            $scope.globals.loading = false
          })
        } else {
          $scope.errorMessage = systemConfig.messages.invalidForm
        }
      }
    })

    if ($stateParams.postId) {
      $scope.globals.loading = true
      postManager.getPost(postId).then(function(post) {
        $scope.globals.loading = false
        $scope.post = post
      })
    }
  }
)
