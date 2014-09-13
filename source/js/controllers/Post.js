'use strict';

angular.module('helium')

.controller('Post',
  function($scope, $stateParams, postManager, $rootScope, $state, keyboard, systemConfig) {
    var postId = parseInt($stateParams.postId)

    angular.extend($scope, {
      preview: false,

      displayPublishedPost: function() {
        return $scope.preview === true || ($stateParams.new !== 'true' && $stateParams.edit !== 'true')
      },

      savePost: function() {
        if ($scope.newPostForm.$valid === true) {
          $scope.globals.loading = true

          $scope.post.id = postId

          postManager.savePost($scope.post).then(
            function success() {
              $state.go('post', { postId: postId }, { inherit: false, reload: true })
            },

            function error(err) {
              console.log(err)
            }
          ).finally(function() {
            $scope.globals.loading = false
          })
        } else {
          $scope.errorMessage = systemConfig.messages.invalidForm
        }
      }
    })
    
    if ($stateParams.new === 'true') {
      $scope.post = {}
    } else {
      $scope.globals.loading = true
      postManager.getPost(postId, $stateParams.edit === 'true').then(function(post) {
        $rootScope.$broadcast('post', post)
      }).finally(function() {
        $scope.globals.loading = false
      })
    }

    $rootScope.$on('savePost', function() {
      $scope.savePost()
    })

    keyboard.bind(['cmd'], 'p', function() {
      $scope.preview = !$scope.preview
    })

    keyboard.bind(['cmd'], 'enter', function() {
      if ($stateParams.edit === 'true' || $stateParams.new === 'true') {
        $scope.savePost()
      }
    })
  }
)