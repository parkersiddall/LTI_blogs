# LTI Blogs
This is a simple blog app that integrates with learning managements systems (Blackboard, Moodle, Canvas, etc.) via the LTI 1.1 standard. LMS users can launch into the app and be authenticated automatically based on trust between the LMS and the app. Professors are able to create blogs and then "deep link" them into their course. Students can click on these links and leave comments.

Comments left on blog posts are visible to all users and are not segregated based on the course the student launches from. This is an example of a feature extension that the app provides: a professor can hold a discussion that incorporates students enrolled in different courses.

## Instructions to run the app locally
Using Docker it is easy to get up and running, just follow these steps:
1. Clone this repository and cd into it
2. Configure your .env file using the example provided (NOTE: The Mongo_URL is already set based on the hardcoded user/pwd/db name)
3. Run `docker compose up`
4. Configure LTI integration in your LMS (see below)

## Configure the app in Blackboard
1. Go to the Admin page, select "LTI Tool Providers" within the "Integrations" section.
2. Click on "Register LTI 1.1 Provider", enter the following settings then click submit:
    - Provider Domain: localhost
    - Provider Domain Status: Approved
    - Default Configuration: Set seperately for each link
    - Send User Data: Send user data over any connection
    - User Fields to send: Role in Course, Name, Email Address
    - Allow Membership Service Access: Yes
3. From the list of LTI providers, click the dropdown in the row "localhost", then click "Manage Placements"
4. Click "Create Placement", enter in the following settings, then click submit:
    - Label: LTI Blogs
    - Handle: lti-blogs
    - Availability: Yes
    - Type: Deep linking content tool (without student access)
    - Launch in New Window: Yes (necessary because it is not SSL)
    - Tool Provider URL: http://localhost/lti
    - Tool Provider Key: (insert KEY value from your .env file)
    - Tool Provider Secret: (insert SECRET value from your .env file)

After these steps you should be able to access the tool from without your course.
