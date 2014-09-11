'use strict';

describe('AdminSettings', function() {
  var $controller
  var $rootScope
  var $scope
  var blogManager
  var mediaManager
  var $q

  function instantiateCtrl() {
    return $controller('AdminSettings', {
      $scope: $scope,
      blogManager: blogManager,
      mediaManager: mediaManager,
      config: config,
      $q: $q,
      systemConfig: systemConfig
    })
  }

  beforeEach(function() {
    inject(function($injector) {
      $controller = $injector.get('$controller')
      $rootScope = $injector.get('$rootScope')
      mediaManager = $injector.get('mediaManager')
      $q = $injector.get('$q')
      blogManager = $injector.get('blogManager')
    })

    $scope = $rootScope.$new()
    $scope.globals = {}
  })

  describe('profile.socialLinks property', function() {
    it('should be instantiated as a list of new-line separated URLs based on what is in config.socialLinks', function() {
      config.socialLinks = {
        'twitter.com': 'http://twitter.com/msafi',
        'github.com': 'http://github.com/msafi'
      }

      instantiateCtrl()

      expect(_.isString($scope.profile.socialLinks)).toBe(true)
    })
  })

  describe('picture method', function() {
    it('takes an array of files and assigns the first element of that array to $scope.profile.picture', function() {
      instantiateCtrl()

      $scope.picture([1,2,3])

      expect($scope.profile.picture).toBe(1)
    })
  })

  describe('headerImage method', function() {
    it('takes an array of files and assigns the first element of that array to $scope.profile.headerImage', function() {
      instantiateCtrl()

      $scope.headerImage([1, 2, 3])

      expect($scope.profile.headerImage).toBe(1)
    })
  })

  describe('submit method', function() {
    it('uses the mediaManager to upload the picture and header image to the server', function() {
      spyOn(mediaManager, 'uploadImage').and.returnValue($q.reject())

      instantiateCtrl()

      $scope.submit()

      $timeout.flush()

      expect(mediaManager.uploadImage.calls.count()).toBe(2)
    })

    it('updates the blog configurations after mediaManager has finished its work', function() {
      spyOn($q, 'all').and.returnValue($q.when({
        picture: { request: { params: { Key: '' } } },
        headerImage: { request: { params: { Key: '' } } }
      }))
      spyOn(blogManager, 'updateConfig')

      instantiateCtrl()

      $scope.submit()

      $timeout.flush()

      expect(blogManager.updateConfig).toHaveBeenCalled()
    })

    it('does not throw when $scope.profile.socialLinks is not a string', function() {
      spyOn($q, 'all').and.returnValue($q.when({
        picture: { request: { params: { Key: '' } } },
        headerImage: { request: { params: { Key: '' } } }
      }))
      spyOn(blogManager, 'updateConfig')

      instantiateCtrl()

      $scope.profile.socialLinks = null

      expect(function() {
        $scope.submit()
        $timeout.flush()
      }).not.toThrow()
    })
  })
})