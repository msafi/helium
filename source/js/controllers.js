angular.module('helium')

.controller('Post',
  function($scope, $stateParams, postManager) {
    var postId = $stateParams.postId

    postManager.getPost(postId).then(function(post) {
      $scope.body = post.body
    })
  }
)