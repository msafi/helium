angular.module('helium')

.service('amazonApi',
  function($q, config, user, localStorage, $http, utils) {
    var amazonApi = {}
    var adminRoleArn = config.amazon.roleArn
    var bucketName = config.amazon.s3.bucketName
    var bucketUrl = 'https://s3.amazonaws.com/' + bucketName
    var s3Options = { params: { Bucket: bucketName } }

    return angular.extend(amazonApi, {
      authenticate: function() {
        return user.verify().then(function() {
          if (AWS.config.credentials === null || AWS.config.credentials.params.RoleArn !== adminRoleArn) {
            AWS.config.credentials = new AWS.WebIdentityCredentials({
              RoleArn: adminRoleArn,
              WebIdentityToken: localStorage.getVal('idToken')
            })
          }

          return true
        })
      },

      uploadJson: function(jsonFile) {
        jsonFile.body = angular.toJson(jsonFile.body)
        jsonFile.type = 'application/json'

        return amazonApi.uploadFile(jsonFile)
      },

      uploadFile: function(file) {
        return amazonApi.authenticate().then(function() {
          var uploadFile = $q.defer()

          new AWS.S3(s3Options)
            .putObject({
              Bucket: bucketName,
              Key: file.key,
              Body: file.body || file,
              ContentType: file.type,
              ACL: file.acl
            })
            .on('httpUploadProgress', function(uploadProgress) {
              uploadFile.notify({
                loaded: uploadProgress.loaded,
                total: uploadProgress.total
              })
            })
            .on('complete', function(data) {
              uploadFile.resolve(data)
            })
            .on('error', function(error) {
              console.log(error)
              uploadFile.resolve(error)
            })
            .send()

          return uploadFile.promise
        })
      },

      getObject: function(fileKey) {
        return amazonApi.authenticate().then(function() {
          var getFile = $q.defer()

          new AWS.S3(s3Options)
            .getObject({
              Bucket: bucketName,
              Key: fileKey,
              ResponseContentType: 'application/json'
            })
            .on('complete', function(file) {
              getFile.resolve(file)
            })
            .on('error', function(error) {
              console.log(error)
              getFile.resolve(error)
            })
            .send()

          return getFile.promise
        })
      },

      getFile: function(fileKey) {
        return $http({
          method: 'GET',
          url: bucketUrl + '/' + fileKey
//          headers: { 'cache-control': 'no-cache' }
        }).then(function(response) {
          return response.data
        }, function(error) {
          return { error: error.statusText }
        })
      }
    })
  }
)