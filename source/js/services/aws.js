'use strict';

angular.module('helium')

.service('aws',
  // I'm not sure that testing this is necessary.
  // It is mostly just a wrapper that encapsulates AWS JS SDK.
  /* istanbul ignore next */
  function($q, config, user, lStorage) {
    /* global AWS */

    var aws = {}
    var adminRoleArn = config.amazonRoleArn
    var bucketName = config.amazonS3BucketName
    var bucketUrl = 'https://s3.amazonaws.com/' + bucketName
    var s3Options = { params: { Bucket: bucketName } }

    return angular.extend(aws, {
      bucketUrl: bucketUrl,

      authenticate: function() {
        return user.authenticate().then(function() {
          if (AWS.config.credentials === null || AWS.config.credentials.params.RoleArn !== adminRoleArn) {
            AWS.config.credentials = new AWS.WebIdentityCredentials({
              RoleArn: adminRoleArn,
              WebIdentityToken: lStorage.getVal('idToken')
            })
          }

          return true
        })
      },

      putObject: function(file) {
        return aws.authenticate().then(function() {
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
        return aws.authenticate().then(function() {
          var getFile = $q.defer()

          new AWS.S3(s3Options)
            .getObject({
              Bucket: bucketName,
              Key: fileKey,
            })
            .on('complete', function(file) {
              getFile.resolve(file)
            })
            .on('error', function(error) {
              console.log(error)
              getFile.resolve({ error: error })
            })
            .send()

          return getFile.promise
        })
      },

      deleteObject: function(fileKey) {
        return aws.authenticate().then(function() {
          var removeObject = $q.defer()

          new AWS.S3(s3Options)
            .deleteObject({
              Bucket: bucketName,
              Key: fileKey,
            })
            .on('complete', function(response) {
              removeObject.resolve(response)
            })
            .on('error', function(error) {
              removeObject.resolve({ error: error })
            })
            .send()

          return removeObject.promise
        })
      }
    })
  }
)