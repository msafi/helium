angular.module('helium')

.controller('AdminPost',
  function($scope, postManager, config, $state) {
    var newPostId = postManager.generateId()

    angular.extend($scope, {
      submitPost: function() {
        if ($scope.newPostForm.$valid === true) {
          $scope.globals.loading = true

          postManager.savePost({
            title: $scope.postTitle,
            body: $scope.postBody,
            id: newPostId
          }).then(function() {
            $scope.globals.loading = false
            $state.go('post', { postId: newPostId })
          })
        } else {
          $scope.errorMessage = config.general.errorMessages.invalidForm
        }
      }
    })
  }
)
