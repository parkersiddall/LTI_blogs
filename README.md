# LTI 1.1
This is a simple blog app to test out some of the features of LTI 1.1 such as:
- Basic launch
- Deep linking

Course instructors will be able to launch the tool and create blog posts. Then they will be able to insert a deep link to a specific post within their course for students to access and comment on.

## endpoints
`/` will return a landing page where a user will be able to register for a key secret
`/lti` will be used to launch a course tool without student access. An instructor will be able to launch into the tool and create blogs but not be able to link them
`/lti/deeplink` will be used launch a course content tool without student access. Instructors will be presented a list of their created blogs and will be able to choose which one(s) to deep link into the course.
`/test` will eventually be removed. Currently used to experiment with pug templates...

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
