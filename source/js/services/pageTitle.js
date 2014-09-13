'use strict';

angular.module('helium')

.service('pageTitle',
  function(reactToRouteChange, config, $rootScope, systemConfig) {
    var pageTitleObject = { value: undefined }
    var name = config.name
    var titlePrefix = systemConfig.messages.homepageTitlePrefix

    reactToRouteChange([
      { name: 'homepage', value: titlePrefix + name },
      { name: 'default', value: titlePrefix + name }
    ], pageTitleObject, 'value')

    $rootScope.$on('post', function(event, post) {
      pageTitleObject.value = post.title + ' | ' + name
    })

    return pageTitleObject
  }
)