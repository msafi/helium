angular.module('helium', [
  'helium.templates',

  'ui.router',
  'btford.markdown'
])

.config(
  function($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
      .state('homepage', {
        url: '/',
        templateUrl: 'html/homepage.html',
        controller: 'Homepage'
      })
      .state('login', {
        url: '/login?state&authError',
        templateUrl: 'html/login.html',
        controller: 'Login',
      })
      .state('admin', {
        url: '/admin',
        templateUrl: 'html/admin.html',
        controller: 'Admin',
        resolve: {
          verificationResults: function(user) {
            return user.verify().then(
              function success() {
                return true
              },

              function error() {
                return false
              }
            )
          }
        }
      })
      .state('admin.post', {
        url: '/post',
        templateUrl: 'html/admin.post.html',
        controller: 'AdminPost'
      })
      .state('admin.managePosts', {
        url: '/manage-posts',
        templateUrl: 'html/admin.manage-posts.html',
        controller: 'AdminManagePosts'
      })
      .state('post', {
        url: '/{postId:[0-9]{13,}}',
        templateUrl: 'html/post.html',
        controller: 'Post'
      })

    $urlRouterProvider.otherwise("/")

    $locationProvider
      .html5Mode(false)
      .hashPrefix('!')

    // Add format method to our string type
    // http://stackoverflow.com/a/4673436/604296
    if (!String.prototype.format) {
      String.prototype.format = function() {
        var args = arguments

        return this.replace(/\{(\d+)\}/g, function(match, number) {
          return number in args ? args[number] : match
        })
      }
    }
  })