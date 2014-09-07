angular.module('helium')

.constant('config',
  {
    blogTitle: 'Helium blog',

    googleClientId: '712050489687-62tf7qp59i5932la9jsmkvllbo2qr25g.apps.googleusercontent.com',

    amazonS3BucketName: 'mk-helium-blog',

    amazonRoleArn: 'arn:aws:iam::901881000271:role/helium-blogger',

    amazonAccountId: '901881000271',

    amazonCognitoIdentityPoolId: 'us-east-1:3b9d95f2-3f63-4d7d-9fd8-75d1462e96db',

    amazonCognitoRoleArn: 'arn:aws:iam::901881000271:role/Cognito_heliumUnauth_DefaultRole',
  }
)