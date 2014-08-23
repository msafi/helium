angular.module('helium')

.controller('AdminPost',
  function($scope, postManager, config) {
    var newPostId = postManager.generateId()

    angular.extend($scope, {
      submitPost: function() {
        if ($scope.newPostForm.$valid === true) {
          postManager.savePost({
            title: $scope.postTitle,
            body: $scope.postBody,
            id: newPostId
          })
        } else {
          $scope.errorMessage = config.general.errorMessages.invalidForm
        }
      }
    })
  }
)
