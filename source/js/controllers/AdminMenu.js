'use strict';

angular.module('helium')

.controller('AdminMenu',
  function($scope, user, $state, postManager, $location, $rootScope, systemConfig) {
    angular.extend($scope, {
      makingNewPost: function() {
        return $state.is('post') === true && $location.search().new === 'true'
      },

      editingPost: function() {
        return $state.is('post') === true && $location.search().edit === 'true'
      },

      newPost: function() {
        $state.go('post', { postId: postManager.generateId(), new: true }, { inherit: false })
      },

      savePost: function() {
        $rootScope.$broadcast('savePost')
      },

      deletePost: function(postId) {
        if (confirm(systemConfig.messages.confirmPostDeletion)) {
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