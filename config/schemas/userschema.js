'use strict';

const mongoose = require("../connection");
const config = require("../config");
const schema = mongoose.Schema;

const userSchema = new schema({
  userId: { type : String , unique : true, required : true },
  userEmail: { type : String ,  required : true },
 
  username: { type : String , unique : true, required : true },
  password1: String,
  salt: String,
  countryCode: String,
  mobile: { type : String , unique : true, sparse: true },
  mobileVerified: Boolean,
  is2faEnabled: Boolean,

  emailVerified: Boolean,
  emailActivationToken: String,
  forgotPasswordToken: String,
  passwordTokenStamp: Date,
  mobileVerificationCode: String,
  temporaryMobile: String,
  mobileTokenStamp: Date,
  role: String,
  registrationDate: Date,
 
  profilePic: String,
 
  profileUrl: String,
  
 
 
});

userSchema.index({ userId: 1 });
userSchema.index({ username: 1 });
// userSchema.index({ "geoLocation": "2dsphere" });

const User = mongoose.model(config.userCollection, userSchema);

module.exports = User;