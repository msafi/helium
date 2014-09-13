/* global AWS */

'use strict';

describe('aws', function() {
  var adminRoleArn
  var aws
  var user
  var $q

  beforeEach(function() {
    inject(function($injector) {
      aws = $injector.get('aws')
      user = $injector.get('user')
      $q = $injector.get('$q')
    })

    adminRoleArn = config.amazonRoleArn
  })

  afterEach(function() {
    localStorage.clear()
  })

  describe('authenticate', function() {
    it('first checks that user.authenticate passes', function() {
      spyOn(user, 'authenticate').and.returnValue($q.reject(false))

      aws.authenticate().catch(function(results) {
        expect(results).toBe(false)
      })

      $timeout.flush()
    })

    it('calls AWS.WebIdentityCredentials if credentials do not exist or ' +
       'the saved role ARN is not that of admin and it always returns true', function() {
      spyOn(user, 'authenticate').and.returnValue($q.when(true))
      spyOn(AWS, 'WebIdentityCredentials')

      AWS.config.credentials = null
      aws.authenticate()

      $timeout.flush()

      AWS.config.credentials = { params: { RoleArn: 'foo' } }
      aws.authenticate()

      $timeout.flush()

      expect(AWS.WebIdentityCredentials.calls.count()).toBe(2)
    })

    it('returns true even if it does not call WebIdentityCredentials', function() {
      spyOn(user, 'authenticate').and.returnValue($q.when(true))
      spyOn(AWS, 'WebIdentityCredentials')

      AWS.config.credentials = { params: { RoleArn: adminRoleArn } }

      aws.authenticate().then(function(results) {
        expect(results).toBe(true)
        expect(AWS.WebIdentityCredentials).not.toHaveBeenCalled()
      })

      $timeout.flush()
    })
  })

  describe('authenticateWithCognitoIfNecessary', function() {
    it('just returns true if credentials role ARN is that of the admin', function() {
      AWS.config.credentials = { params: { RoleArn: adminRoleArn } }

      expect(aws.authenticateWithCognitoIfNecessary()).toBe(true)
    })

    it('calls AWS.CognitoIdentityCredentials if there are no credentials or ' +
       'the role ARN is not that of a cognito user', function() {
      AWS.config.credentials = null
      spyOn(AWS, 'CognitoIdentityCredentials')

      aws.authenticateWithCognitoIfNecessary()

      AWS.config.credentials = { params: { RoleArn: 'foo' } }

      aws.authenticateWithCognitoIfNecessary()

      expect(AWS.CognitoIdentityCredentials.calls.count()).toBe(2)
    })

    it('does nothing when no conditions are met', function() {
      AWS.config.credentials = { params: { RoleArn: config.amazonCognitoRoleArn } }

      spyOn(AWS, 'CognitoIdentityCredentials')

      aws.authenticateWithCognitoIfNecessary()

      expect(AWS.CognitoIdentityCredentials).not.toHaveBeenCalled()
    })
  })

  describe('putObject', function() {
    it('authenticates with aws.authenticate then calls AWS.S3().putObject', function() {
      spyOn(aws, 'authenticate').and.returnValue($q.when(true))
      spyOn(AWS, 'S3').and.callThrough()

      aws.putObject({})

      $timeout.flush()

      expect(aws.authenticate).toHaveBeenCalled()
      expect(AWS.S3).toHaveBeenCalled()
    })
  })

  describe('getObject', function() {
    it('authenticates with aws.authenticate then calls AWS.S3().getObject', function() {
      spyOn(aws, 'authenticate').and.returnValue($q.when(true))
      spyOn(AWS, 'S3').and.callThrough()

      aws.getObject()

      $timeout.flush()

      expect(aws.authenticate).toHaveBeenCalled()
      expect(AWS.S3).toHaveBeenCalled()
    })
  })

  describe('deleteObject', function() {
    it('authenticates with aws.authenticate then calls AWS.S3().deleteObject', function() {
      spyOn(aws, 'authenticate').and.returnValue($q.when(true))
      spyOn(AWS, 'S3').and.callThrough()

      aws.deleteObject()

      $timeout.flush()

      expect(aws.authenticate).toHaveBeenCalled()
      expect(AWS.S3).toHaveBeenCalled()
    })
  })

  describe('listObjects', function() {
    it('authenticates with Amazon Cognito if necessary then calls AWS.S3().listObjects', function() {
      spyOn(aws, 'authenticateWithCognitoIfNecessary').and.returnValue(true)
      spyOn(AWS, 'S3').and.callThrough()

      aws.listObjects()

      expect(aws.authenticateWithCognitoIfNecessary).toHaveBeenCalled()
      expect(AWS.S3).toHaveBeenCalled()
    })
  })

  describe('headObject', function() {
    it('authenticates with Amazon Cognito if necessary then calls AWS.S3().headObject', function() {
      spyOn(aws, 'authenticateWithCognitoIfNecessary').and.returnValue(true)
      spyOn(AWS, 'S3').and.callThrough()

      aws.headObject()

      expect(aws.authenticateWithCognitoIfNecessary).toHaveBeenCalled()
      expect(AWS.S3).toHaveBeenCalled()
    })
  })
})