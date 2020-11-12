const mongoose = require('mongoose');

const { Schema } = mongoose;

// Can add non-essential fields to meta: {} later on
const jobSchema = new Schema({
  // Embedded company id
  cname: String,
  jtitle: String,
  jindustry: String,
  jcity: String,
  jstate: String,
  jcountry: String,
  jzip: String,
  jaddress: String,
  jlatitude: String,
  jlongitude: String,
  jwork: {
    type: String,
    enum: ['Remote', 'In-person'],
    default: 'Remote',
  },

  jposted: Date,
  jdescription: String,
  jresponsibilities: String,
  jqualifications: String,
},
{
  versionKey: false,
});

const jobModel = mongoose.model('job', jobSchema);
module.exports = jobModel;
