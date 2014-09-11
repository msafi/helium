'use strict';

angular.module('helium')

.service('backend',
  function($q, config, user, lStorage, $http, aws) {
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

          function error(err) {
            return $q.reject({ error: err.statusText })
          }
        )
      },

      deleteFile: function(fileKey) {
        return aws.deleteObject(fileKey)
      },

      listFiles: function(options) {
        return aws.listObjects(options).then(function(response) {
          return response.data
        })
      },

      getFileMeta: function(fileKey) {
        return aws.headObject(fileKey).then(function(response) {
          return response.data.Metadata.data
        })
      }
    })
  }
)