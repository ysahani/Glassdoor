const mongoose = require("mongoose");

const { Schema } = mongoose;

// Can add non-essential fields to meta: {} later on
const companySchema = new Schema(
  {
    cname: { type: String, unique: true, DropDups: true },
    cemail: String,
    cpassword: String,
    clocation: String,
    clatitude: String,
    clongitude: String,
    cwebsite: String,
    csize: String,
    ctype: String,
    crevenue: Number,
    cindustry: String,
    cheadquarters: String,
    cfounded: String,
    cdescription: String,
    cmission: String,
    cceo: String,
    // cphoto: String,
    cphoto: {
      type: String,
      default:
        "https://glassdoor-273.s3.us-west-1.amazonaws.com/1606091787051-unknown.jpg",
    },
    // number of reviews, salary reviews, and interview reviews for a company
    reviewCount: {
      type: Number,
      default: 0,
    },
    salaryCount: {
      type: Number,
      default: 0,
    },
    interviewCount: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    // review ids that are featured will be stored here
    cfeatured: [],
    cviewedperday: { type: Number, default: 0 },
    // Photo URLs
    // cross-referencing photos added by a student/user
    cphotos: [
      {
        url: String,
        // user/student name added here
        stname: String,
        stid: String,
        approval: {
          type: String,
          enum: ["Pending", "Approved", "Rejected"],
          default: "Pending",
        },
      },
    ],
  },
  {
    versionKey: false,
  }
);

const companyModel = mongoose.model("company", companySchema);
module.exports = companyModel;
