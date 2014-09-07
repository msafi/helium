'use strict';

angular.module('helium')

.controller('AdminMenu',
  function($scope, user, $state, postManager) {
    angular.extend($scope, {
      deletePost: function(postId) {
        if (confirm('This post is about to be deleted...')) {
          $scope.globals.loading = true

          postManager.deletePost(postId).finally(function() {
            $scope.globals.loading = false
            $state.go('homepage', { reload: true })
          })
        }
      },

      signOut: function() {
        $scope.globals.loading = true

        user.signOut().finally(function() {
          $scope.globals.loading = false
          $state.go('homepage', { reload: true })
        })
      }
    })
  }
)