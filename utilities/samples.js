const blogs = [
  {
    id: "1",
    dateCreated: "July 4, 1776",
    creator: "Thomas Jefferson",
    title: "Declaration of Independence",
    content: "We hold these truths to be self evident, that all men are created equal...",
    views: 34,
    comments: 5
  },
  {
    id: "2",
    dateCreated: "November 19, 1863",
    creator: "Abraham Lincoln",
    title: "Gettysburg Address",
    content: "Four score and seven years ago our fathers brought forth, upon this continent, a new nation, conceived in liberty, and dedicated to the proposition that all men are created equal",
    views: 50,
    comments: 17
  },
  {
    id: "3",
    dateCreated: "August 28, 1963",
    creator: "Martin Luther King Jr.",
    title: "I Have a Dream",
    content: "I have a dream that one day this nation will rise up and live out the true meaning of its creed: We hold these truths to be self-evident, that all men are created equal.",
    views: 25,
    comments: 8
  }
]

const comments = [
  {
    id: "1",
    dateCreated: "July 4, 1776",
    creator: "John Smith",
    content: "this is the first comment",
    up: 34,
    down: 5
  },
  {
    id: "2",
    dateCreated: "November 19, 1863",
    creator: "Abraham Lincoln",
    content: "this is the second comment",
    up: 50,
    down: 17
  },
  {
    id: "3",
    dateCreated: "August 28, 1963",
    creator: "Martin Luther King Jr.",
    content: "This is the third comment",
    up: 25,
    down: 8
  }
]

const session_auth = {
  tool_consumer_info_product_family_code: 'BlackboardLearn',
  context_title: 'Zoom LTI Pro TEST',
  roles: 'urn:lti:role:ims/lis/Instructor',
  lis_person_name_family: 'Siddall',
  tool_consumer_instance_name: 'UBM - test',
  tool_consumer_instance_guid: 'b6f7fdde20a343b18616a63a082b27fe',
  custom_context_memberships_url: 'https://bb-test.unibocconi.it/learn/api/v1/lti/external/memberships/2cf57aa451c64846b0d99f09b063243b?placement_id=_137_1',
  resource_link_id: '_274_1BbdnLtiToolNode',
  oauth_signature_method: 'HMAC-SHA1',
  oauth_version: '1.0',
  ext_fnds_user_id: '5a16d82c-b2b5-11eb-ae57-cbe61ea7f13d',
  custom_caliper_profile_url: 'https://uclb-test.blackboard.com/learn/api/v1/telemetry/caliper/profile/_274_1BbdnLtiToolNode',
  launch_presentation_return_url: 'https://bb-test.unibocconi.it/webapps/blackboard/execute/blti/launchReturn?course_id=_274_1&nonce=1bd71986e9a244109ed55f35e1379646&launch_id=fbacec3a-44e6-453a-b43c-11042971374c&link_id=_274_1BbdnLtiToolNode&launch_time=1634288436708',
  ext_launch_id: 'fbacec3a-44e6-453a-b43c-11042971374c',
  ext_fnds_tenant_id: '39e2c8b8-4d59-4a24-86db-9b5bf0ef758d',
  ext_lms: 'bb-3900.26.0-rel.2+6bc051d',
  lti_version: 'LTI-1p0',
  lis_person_contact_email_primary: 'parker.siddall@unibocconi.it',
  oauth_signature: 'r848kX7rzG52s+EqES0kCHPIilc=',
  tool_consumer_instance_description: 'UBM - test',
  ext_fnds_course_id: '16401728-19f3-11ec-8312-cdd98d05bc6b',
  oauth_consumer_key: '12345',
  launch_presentation_locale: 'en-US',
  custom_caliper_federated_session_id: 'https://caliper-mapping.cloudbb.blackboard.com/v1/sites/f4df5a29-6f8b-4f3d-941c-80af6077096f/sessions/492037035A5F554D09178CB627C5552D',
  lis_person_sourcedid: 'siddall',
  oauth_timestamp: '1634288436',
  lis_person_name_full: 'Parker Siddall',
  tool_consumer_instance_contact_email: 'ltcc@unibocconi.it',
  lis_person_name_given: 'Parker',
  custom_tc_profile_url: 'https://bb-test.unibocconi.it/learn/api/v1/lti/profile?lti_version=LTI-1p0',
  oauth_nonce: '126228830956875',
  lti_message_type: 'basic-lti-launch-request',
  user_id: '5efce972da334aab8c1eba8100a51fa9',
  oauth_callback: 'about:blank',
  tool_consumer_info_version: '3900.26.0-rel.2+6bc051d',
  context_id: '2cf57aa451c64846b0d99f09b063243b',
  context_label: 'Zoom_TEST',
  launch_presentation_document_target: 'window',
  ext_launch_presentation_css_url: 'https://bb-test.unibocconi.it/common/shared.css,https://bb-test.unibocconi.it/themes/as_2015/theme.css'
}

module.exports = {blogs, comments, session_auth}