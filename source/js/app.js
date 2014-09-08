'use strict';

angular.module('helium', [
  'helium.templates',

  'ui.router',
  'btford.markdown'
])

.config(
  /* istanbul ignore next: this code is mostly declarative and simple. And given how difficult it is to
     reach it from tests, I decided to skip it. */
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
            return user.authenticate().then(
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
      .state('post', {
        url: '/{postId:[0-9]{13,}}?new&edit',
        templateUrl: 'html/post.html',
        controller: 'Post'
      })

    $urlRouterProvider.otherwise('/')

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