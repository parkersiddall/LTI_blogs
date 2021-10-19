# LTI 1.1
This is a simple blog app to test out some of the features of LTI 1.1 such as:
- Basic launch
- Deep linking

Course instructors will be able to launch the tool and create blog posts. Then they will be able to insert a deep link to a specific post within their course for students to access and comment on.

## endpoints
- GET `/` will return a landing page where a user will be able to register for a key secret
- POST `/lti` is used for a basic launch. Only the Instructor role is authorized for this. If successful, the user will see a list of their blogs and have the option of creating a new blog or viewing existing blogs.
- POST `/lti/blog/<blog id>` used for basic lti launches that open up an individual blog. These links are typically going to be inserted into the course content via deep linking.
- POST `/CIMrequest` used to for LTI Content Item Message request. Presents user with a list of their blog (same view as /lti) but each blog will have a button to deep link the blog to the course.
- GET `/test` will eventually be removed. Currently used to experiment with pug templates...

## Resources and References
- [BBDN-LTI-Tool-Provider-Node](https://github.com/blackboard/BBDN-LTI-Tool-Provider-Node)
- [LTI 1.1 Implementation Guide](https://www.imsglobal.org/specs/ltiv1p1/implementation-guide)

## Temporary Notes
### Mongo DB Docker container:
- docker container run --name mydatabase --publish 27017:27017 -d mongo
- For the moment I configured the lti database in the mongo shell. It is necessary to create a database (and a user - but this is to be checked)
- Look into volumes for mongodb, and how to create the js config file

Mongo DB Shell commands:
```
#mongo
#use lti
TODO: insert mongo shell commands to create user
```

### express-session
- TODO: configure sessionStore with mongodb
