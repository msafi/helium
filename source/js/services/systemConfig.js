'use strict';

angular.module('helium')

.constant('systemConfig',
  {
    general: {
      filePaths: {
        posts: 'content/posts/',
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
      initializing: 'Please wait while your blog is being initialized for first time use.',
      blogInitializationFailed: 'An error occurred during blog initialization.',
      genericError: 'An error occurred. Check your browser developer console.'
    },

    listObjectsMaxKeys: 10,

    amazonCognito: {
      identityPoolId: 'us-east-1:3b9d95f2-3f63-4d7d-9fd8-75d1462e96db',
      roleArn: 'arn:aws:iam::901881000271:role/Cognito_heliumUnauth_DefaultRole'
    },

    amazonAccountId: '901881000271'
  }
)