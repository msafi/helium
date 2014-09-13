'use strict';

angular.module('helium')

.service('blogManager',
  function(backend, systemConfig, $q, utils, $state, config) {
    var blogManager = {}

    return angular.extend(blogManager, {
      updateConfig: function(newConfig) {
        config = angular.extend(config, newConfig)

        return backend.getFile('index.html').then(
          function success(indexHtml) {
            indexHtml = indexHtml.replace(
              /(heliumConfigurations = {(.*\n)+};;;)/gm,
              'heliumConfigurations = ' + JSON.stringify(config, null, 2) + ';;;'
            )

            return backend.uploadFile({
              key: 'index.html',
              body: indexHtml,
              acl: 'public-read',
              type: 'text/html'
            })
          }
        )
      }
    })
  }
)