angular.module('helium')

.constant('config',
  {
    blogTitle: 'Helium blog',

    googleClientId: '712050489687-62tf7qp59i5932la9jsmkvllbo2qr25g.apps.googleusercontent.com',

    amazonS3BucketName: 'mk-helium-blog',

    amazonRoleArn: 'arn:aws:iam::901881000271:role/helium-blogger'
  }
)