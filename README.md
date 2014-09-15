# Helium

Helium is a blogging app that's coded entirely in AngularJS. For the back-end, it just needs Amazon S3. For authentication, it uses Amazon Identity & Access Management (IAM) in combination with Google Login. For unauthenticated access by blog readers, it uses Amazon Cognito.

The entire app is available in one file: `index.html`. You upload this file to your Amazon S3 account, do some configurations and you will have a blog with infinite and hassle-free scale. And you only pay for your Amazon S3 traffic. All the other services are free.

The current features of Helium are:

* Authenticated admin: login & logout
* Manage posts: create, edit, and delete
* Write posts in Markdown

While the code has complete unit test coverage, the application isn't ready for prime time. For example there's no pagination and the homepage is slow to load due to the number of HTTP requests that need to be made. But it all can be fixed! 

I just want to put this out here as a proof of concept. The benefits of this concept are significant:

* Pleasant to use because the entire application front-end code with interactive AngularJS UI
* Cheap because the only cost is your Amazon S3 traffic bill
* And since it only needs Amazon S3, it can handle an infinite amount of traffic
* Amazon CDN, CloudFront, can easily be integrated to provide even more performance
* Despite using a very light technology stack, it can support all the essential features that a full-stack system, like WordPress, supports
* The user owns both the platform and the content

## Try it out

If you'd like to try it out, I've set up a demo blog where you can [login](http://helium-demo.s3-website-us-east-1.amazonaws.com/#!/login) to access the admin menu and create new posts, etc.

Or you can follow the [installation instructions](https://github.com/msafi/helium/wiki/Installation).

## License

[CC0 1.0 Universal](http://creativecommons.org/publicdomain/zero/1.0/)

## Thanks

To Alex Craig from App Advice for constantly pushing me to explore new platforms and services, which opened my eyes to the possibility of integrating these services to create a lightweight blogging app.