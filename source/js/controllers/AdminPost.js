'use strict';

angular.module('helium')

.controller('AdminPost',
  function($scope, postManager, systemConfig, $state) {
    var newPostId = postManager.generateId()

    angular.extend($scope, {
      submitPost: function() {
        if ($scope.newPostForm.$valid === true) {
          $scope.globals.loading = true

          postManager.savePost({
            title: $scope.postTitle,
            body: $scope.postBody,
            id: newPostId
          }).then(
            function success() {
              $state.go('post', { postId: newPostId })
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
  }
)
