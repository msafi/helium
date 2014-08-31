'use strict';

angular.module('helium')

.service('aws',
  function($q, config, user, lStorage, systemConfig) {
    /* global AWS */

    var aws = {}
    var adminRoleArn = config.amazonRoleArn
    var bucketName = config.amazonS3BucketName
    var bucketUrl = 'https://s3.amazonaws.com/' + bucketName
    var s3Options = { params: { Bucket: bucketName } }
    var accountId = systemConfig.amazonAccountId
    var cognitoIdentityPoolId = systemConfig.amazonCognito.identityPoolId
    var cognitoRoleArn = systemConfig.amazonCognito.roleArn

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

      authenticateWithCognitoIfNecessary: function() {
        if (AWS.config.credentials !== null && AWS.config.credentials.params.RoleArn === adminRoleArn) {
          return true
        } else if (AWS.config.credentials === null || AWS.config.credentials.params.RoleArn !== cognitoRoleArn) {
          AWS.config.region = 'us-east-1'
          AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            AccountId: accountId,
            IdentityPoolId: cognitoIdentityPoolId,
            RoleArn: cognitoRoleArn,
          })
        }
      },

      putObject: function(file) {
        return aws.authenticate().then(function() {
          var uploadFile = $q.defer()

          /* istanbul ignore next */
          new AWS.S3(s3Options)
            .putObject({
              Bucket: bucketName,
              Key: file.key,
              Body: file.body || file,
              ContentType: file.type,
              ACL: file.acl,
              Metadata: { 'data': angular.toJson(file.metadata) }
            })
            .on('httpUploadProgress', function(uploadProgress) {
              uploadFile.notify({
                loaded: uploadProgress.loaded,
                total: uploadProgress.total
              })
            })
            .on('success', function(data) {
              uploadFile.resolve(data)
            })
            .on('error', function(error) {
              uploadFile.reject(error)
            })
            .send()

          return uploadFile.promise
        })
      },

      getObject: function(fileKey) {
        return aws.authenticate().then(function() {
          var getFile = $q.defer()

          /* istanbul ignore next */
          new AWS.S3(s3Options)
            .getObject({
              Bucket: bucketName,
              Key: fileKey,
            })
            .on('success', function(file) {
              getFile.resolve(file)
            })
            .on('error', function(error) {
              getFile.reject({ error: error })
            })
            .send()

          return getFile.promise
        })
      },

      listObjects: function(options) {
        var listObjects = $q.defer()

        options = options || {}

        aws.authenticateWithCognitoIfNecessary()

        /* istanbul ignore next */
        new AWS.S3(s3Options)
          .listObjects({
            Bucket: bucketName,
            Marker: options.marker || null,
            MaxKeys: options.maxKeys || systemConfig.listObjectMaxKeys,
            Prefix: options.prefix || null
          })
          .on('success', function(response) {
            listObjects.resolve(response)
          })
          .on('error', function(error) {
            listObjects.reject({ error: error })
          })
          .send()

        return listObjects.promise
      },

      deleteObject: function(fileKey) {
        return aws.authenticate().then(function() {
          var removeObject = $q.defer()

          /* istanbul ignore next */
          new AWS.S3(s3Options)
            .deleteObject({
              Bucket: bucketName,
              Key: fileKey,
            })
            .on('success', function(response) {
              removeObject.resolve(response)
            })
            .on('error', function(error) {
              removeObject.reject({ error: error })
            })
            .send()

          return removeObject.promise
        })
      },

      headObject: function(fileKey) {
        var headObject = $q.defer()

        aws.authenticateWithCognitoIfNecessary()

        /* istanbul ignore next */
        new AWS.S3(s3Options)
          .headObject({
            Bucket: bucketName,
            Key: fileKey,
          })
          .on('success', function(response) {
            response.data.Metadata.data = angular.fromJson(response.data.Metadata.data)
            headObject.resolve(response)
          })
          .on('error', function(error) {
            headObject.reject({ error: error })
          })
          .send()

        return headObject.promise
      }
    })
  }
)