const mongoose = require('mongoose');

const { Schema } = mongoose;

// Can add non-essential fields to meta: {} later on
const studentSchema = new Schema(
  {
    stname: String,
    stemail: String,
    stpassword: String,
    stjobtitle: String,
    stlocation: String,
    stphoto: {
      type: String,
      default:
        'https://glassdoor-273.s3.us-west-1.amazonaws.com/1606091787051-unknown.jpg',
    },
    // cross-referencing photos added for a company
    cphotos: [
      {
        url: String,
        // user/student name added here
        cname: String,
        cid: String,
        approval: {
          type: String,
          enum: ['Pending', 'Approved', 'Rejected'],
          default: 'Pending',
        },
      },
    ],
    stresumes: [
      {
        stresume: String,
        stselect: {
          type: String,
          enum: ['', 'Primary'],
          default: '',
        },
        _id: false,
      },
    ],
    stjobpref: {
      searchstatus: {
        type: String,
        enum: ['Not Looking', 'Casually Looking', 'Actively Looking'],
        default: 'Casually Looking',
      },
      // required job title
      title: String,
      targetsalary: Number,
      salarypayperiod: String,
      relocation: {
        type: String,
        enum: ['Yes', 'No'],
        default: 'No',
      },
      industry: String,
    },
    // If reviews > 0, only then show more than 5 reviews on fronntend
    streviews: [],
    streviewsaccepted: {
      type: Number,
      default: 0,
    },
    stsalaries: [],
    stinterviews: [],
    stdemographics: {
      race_ethnicity: {
        type: String,
        enum: [
          'American Indian',
          'Alaska Native',
          'Asian',
          'Black or African American',
          'Native Hawaiian',
          'Other Pacific Islander',
          'White',
          'Refuse to disclose',
        ],
        default: 'Refuse to disclose',
      },
      gender: {
        type: String,
        enum: ['Male', 'Female', 'Non-binary', 'Refuse to disclose'],
        default: 'Refuse to disclose',
      },
      disability: {
        type: String,
        enum: ['Disabled', 'Not Disabled', 'Refuse to disclose'],
        default: 'Refuse to disclose',
      },
      veteran: {
        type: String,
        enum: ['Protected Veteran', 'Not a Veteran', 'Refuse to disclose'],
        default: 'Refuse to disclose',
      },
    },
  },
  {
    versionKey: false,
  },
);

const studentModel = mongoose.model('student', studentSchema);
module.exports = studentModel;
