'use strict';

angular.module('helium')

.controller('Post',
  function($scope, $stateParams, postManager, $rootScope) {
    var postId = $stateParams.postId

    $scope.globals.loading = true
    postManager.getPost(postId).then(function(post) {
      $rootScope.$broadcast('post', post)
    }).finally(function() {
      $scope.globals.loading = false
    })
  }
)