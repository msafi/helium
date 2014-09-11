'use strict';

angular.module('helium')

.controller('AdminSettings',
  function($scope, config, blogManager, mediaManager, $q, systemConfig) {
    angular.extend($scope, {
      profile: {
        name: config.name,
        bio: config.bio,
        pictureUrl: config.picture,
        headerImageUrl: config.headerImage,
        socialLinks: parseSocialLinks(config.socialLinks)
      },

      picture: function(files) {
        $scope.profile.picture = files[0]
      },

      headerImage: function(files) {
        $scope.profile.headerImage = files[0]
      },

      submit: function() {
        var imagesToUpload = {
          picture: ($scope.profile.picture !== undefined) ?
                   mediaManager.uploadImage($scope.profile.picture) :
                   undefined,

          headerImage: ($scope.profile.headerImage !== undefined) ?
                       mediaManager.uploadImage($scope.profile.headerImage) :
                       undefined
        }

        $scope.globals.loading = true
        $q.all(imagesToUpload).then(function(results) {
          var name = $scope.profile.name
          var bio = $scope.profile.bio
          var pictureUrl = (results.picture !== undefined) ?
                           config.siteUrl + results.picture.request.params.Key :
                           undefined
          var headerImageUrl = (results.headerImage !== undefined) ?
                               config.siteUrl + results.headerImage.request.params.Key :
                               undefined
          var socialLinks = (_.isString($scope.profile.socialLinks) === true) ?
                            parseSocialLinks($scope.profile.socialLinks) :
                            undefined

          return blogManager.updateConfig({
            name: name,
            picture: pictureUrl,
            headerImage: headerImageUrl,
            bio: bio,
            socialLinks: socialLinks
          })
        }).finally(function() {
          $scope.globals.loading = false
        })
      }
    })

    function parseSocialLinks(links) {
      if (_.isString(links)) {
        links = links.split('\n')

        return _.transform(systemConfig.supportedSiteLinks, function(socialLinks, site) {
          socialLinks[site] = _.find(links, function(link) {
            return _.contains(link, site)
          })
        }, {})
      } else {
        return _.reduce(links, function(links, link) {
          return links + '\n' + link
        })
      }
    }
  }
)