'use strict';

angular.module('helium')

.constant('systemConfig',
  {
    general: {
      filePaths: {
        posts: 'content/posts/',
        media: 'content/media/'
      },
    },

    supportedSiteLinks: [
      'twitter.com', 'facebook.com', 'plus.google.com', 'github.com', 'instagram.com'
    ],

    messages: {
      adminAuthError: 'Restricted area. You need to log-in.',
      invalidForm: 'You need to fill things out.',
      googleAuthenticationError: 'User could not be authenticated with Google.',
      blogNotInitialized: 'This blog has not been initialized yet. ' +
                          'If you are the admin, log-in to kick off automatic initialization.',
      initializing: 'Please wait while your blog is being initialized for first time use.',
      blogInitializationFailed: 'An error occurred during blog initialization.',
      genericError: 'An error occurred. Check your browser developer console.',
      confirmPostDeletion: 'This post is about to be deleted...',
      homepageTitlePrefix: 'Website of '
    },

    listObjectsMaxKeys: 10,

    ui: {
      adminPostTitle: 'Make a new post',
      adminManagePostsTitle: 'Manage posts'
    }
  }
)