'use strict';

angular.module('helium')

.service('pageTitle',
  function(reactToRouteChange, config, $rootScope, systemConfig) {
    var pageTitleObject = { value: undefined }
    var blogTitle = config.blogTitle

    reactToRouteChange([
      { name: 'homepage', value: blogTitle },
      { name: 'admin.post', value:  systemConfig.ui.adminPostTitle + ' | ' + blogTitle },
      { name: 'admin.managePosts', value: systemConfig.ui.adminManagePostsTitle + ' | ' + blogTitle },
      { name: 'default', value: blogTitle }
    ], pageTitleObject, 'value')

    $rootScope.$on('post', function(event, post) {
      pageTitleObject.value = post.title + ' | ' + blogTitle
    })

    return pageTitleObject
  }
)