'use strict';

describe('pageTitle', function() {
  var pageTitle
  var $rootScope

  beforeEach(function() {
    inject(function($injector) {
      pageTitle = $injector.get('pageTitle')
      $rootScope = $injector.get('$rootScope')
    })
  })

  it('returns the pageTitleObject whose "value" property is the page title of the current page', function() {
    expect(pageTitle.value).toBe('Website of ' + config.name)
  })

  it('sets the title of the page to the title of the post when "post" event is $broadcast', function() {
    $rootScope.$broadcast('post', { title: 'foo' })

    expect(pageTitle.value).toBe('foo | ' + config.name)
  })
})