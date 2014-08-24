angular.module('helium')

.controller('Post',
  function($scope, $stateParams, postManager) {
    var postId = $stateParams.postId

    $scope.globals.loading = true
    postManager.getPost(postId).then(function(post) {
      $scope.globals.loading = false
      $scope.post = post
    })
  }
)