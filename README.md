# LTI 1.1
This simple app is to test some of the core features of LTI 1.1, including:
- Basic launch
- Deep linking
- Basic outcome

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
```
