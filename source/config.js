angular.module('helium')

.constant('config',
  {
    general: {
      title: 'Helium blog',
      postMapLimit: 10,
      url: 'http://mk-helium-blog.s3-website-us-east-1.amazonaws.com',

      filePaths: {
        posts: 'content/posts/',
        postMaps: 'content/post-maps/',
        state: 'content/'
      },

      fileNames: {
        state: 'state.json'
      },

      errorMessages: {
        adminAuthError: 'Restricted area. You need to log-in.',
        invalidForm: 'You need to fill things out.'
      }
    },

    google: {
      clientId: '712050489687-62tf7qp59i5932la9jsmkvllbo2qr25g.apps.googleusercontent.com',
    },

    amazon: {
      s3: {
        bucketName: 'mk-helium-blog',
        region: ''
      },
      roleArn: 'arn:aws:iam::901881000271:role/helium-blogger'
    }
  }
)