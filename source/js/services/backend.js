'use strict';

angular.module('helium')

.service('backend',
  function($q, config, user, localStorage, $http, aws) {
    var backend = {}
    var bucketUrl = aws.bucketUrl

    return angular.extend(backend, {
      uploadJson: function(jsonFile) {
        jsonFile.body = angular.toJson(jsonFile.body)
        jsonFile.type = 'application/json'

        return backend.uploadFile(jsonFile)
      },

      uploadFile: function(file) {
        return aws.putObject(file)
      },

      getFile: function(fileKey) {
        var httpOptions = {
          method: 'GET',
          url: bucketUrl + '/' + fileKey
        }

        if (user.hasValidCredentials()) {
          httpOptions.headers = { 'cache-control': 'no-cache' }
        }

        return $http(httpOptions).then(
          function success(response) {
            return response.data
          },

          function error(error) {
            return $q.reject({ error: error.statusText })
          }
        )
      },

      deleteFile: function(fileKey) {
        return aws.deleteObject(fileKey)
      }
    })
  }
)