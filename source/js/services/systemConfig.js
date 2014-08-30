'use strict';

angular.module('helium')

.constant('systemConfig',
  {
    general: {
      postMapLimit: 10,

      filePaths: {
        posts: 'content/posts/',
        postMaps: 'content/post-maps/',
        state: 'content/'
      },

      fileNames: {
        state: 'state.json'
      },
    },

    messages: {
      adminAuthError: 'Restricted area. You need to log-in.',
      invalidForm: 'You need to fill things out.',
      googleAuthenticationError: 'User could not be authenticated with Google.',
      blogNotInitialized: 'This blog has not been initialized yet. ' +
                          'If you are the admin, log-in to kick off automatic initialization.',
      initializing: 'Please wait while your blog is being initialized for first time use.'
    },
  }
)