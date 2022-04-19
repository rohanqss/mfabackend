'use strict';
//Schema for session database

const mongoose = require("../connection");
const config = require("../config");
const schema = mongoose.Schema;

const sessionSchema= new schema({
    sessionId: { type : String , unique : true, required : true },
    uuid: { type : String, required : true },
    objectId: String,
    userId: String,
    userEmail: String,
    mobileVerified: Boolean,
    is2faEnabled: Boolean,

    username: String,
    role: String,
    registrationDate: Date,
    emailVerified: Boolean,
    temporaryMobile: String,
    mobile: String,
    countryCode: String,
    mobile:String,
  
  

    createdAt:{type:Date,expires:"30d",default:Date.now},
    profilePic:String
});

const Session = mongoose.model(config.sessionCollection,sessionSchema); 

module.exports = Session;