'use strict';

angular.module('helium')

.controller('AdminSettings',
  function($scope, config, blogManager, mediaManager, $q, systemConfig) {
    angular.extend($scope, {
      profile: {
        name: config.name,
        bio: config.bio,
        picture: config.picture,
        headerImage: config.headerImage,
        socialLinks: parseSocialLinks(config.socialLinks)
      },

      picture: function(files) {
        $scope.profile.picture = files[0]
      },

      headerImage: function(files) {
        $scope.profile.headerImage = files[0]
      },

      submit: function() {
        $q.all({
          picture: mediaManager.uploadImage($scope.profile.picture),
          headerImage: mediaManager.uploadImage($scope.profile.headerImage)
        }).then(function(results) {
          var name = $scope.profile.name
          var pictureUrl = config.siteUrl + results.picture.request.params.Key
          var headerImageUrl = config.siteUrl + results.headerImage.request.params.Key
          var bio = $scope.profile.bio
          var socialLinks = (_.isString($scope.profile.socialLinks) === true) ?
                            parseSocialLinks($scope.profile.socialLinks) :
                            null

          return blogManager.updateConfig({
            name: name,
            picture: pictureUrl,
            headerImage: headerImageUrl,
            bio: bio,
            socialLinks: socialLinks
          })
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