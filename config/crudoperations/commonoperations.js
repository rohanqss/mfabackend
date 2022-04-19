'use strict';

const User = require("../schemas/userschema");
const utils = require("../utils");
const logger = require("../logger");
const config = require("../config");

const dbOperations = {

    ////////Checking if username exists  ///////////////////// 
    checkUsername: function (object, callback) {
        logger.debug('crud common checkUsername');
        
        User.findOne({ "username": object.username }, function (error, result) {
            if (error) {
                logger.error(error);
            }
            else {
                logger.debug('crud result'); 
                if (result) {
                    object.notFound = false;
                }
                else {
                    object.notFound = true;
                }
            }
            callback();
        });
    },

    ///////////Email activation /////////////////////////
    ////////Checking token for activation
    checkToken: function (request, response) {
        logger.debug('crud common checkToken');
        var that = this;
        var activationObject = request.body;

        User.find({
            "$and": [
                {
                    "userEmail": activationObject.userEmail
                },
                {
                    "emailActivationToken": activationObject.token
                }
            ]
        }
            , function (error, result) {
                if (error) {
                    logger.error(error);
                }
                else {
                    logger.debug('crud result'); 
                    if (result.length < 1) {
                        // response.json({message:"fail",code:404,success:false});
                        // utils.fail(response);
                        utils.response(response,'fail', "Invalid email or token");
                    }
                    else {
                        that.activateEmail(activationObject.userEmail, response, result[0]);
                    }
                }
            });
    },

     //getUsername
    getUsername:function(mobileNumber,callback){
        logger.debug('crud commonops getUsername');
        User.find({mobile:{ "$regex":mobileNumber}},'username',function(error,result){
            if(error){
                logger.error(error);
                callback(error,null);
            }
            else{
                callback(null,result);
            }
        })
    },

    identify:function(user,callback){
        logger.debug('crud commonops identify');
        var mobileId=user;
        if(user.length!=10 || user.startsWith("+91")){
            mobileId = "xxxxxxxxxxxxxxx";
        }
        User.findOne(
            {
                "$or":[{
                    "userEmail": user
                }, 
                {
                    "username": user
                },
                {
                    "mobile": { "$regex": mobileId}
                }]
            },
            {
                username:true,
                userEmail:true,
                address:true,
                profilePic:true,
                mobile:true
            }
            ,function(error,result){
            if(error){
                logger.error(error);
                callback(error,null);
            }
            else{
                callback(null,result);
            }
        })
    },

    //////////Activating email
    activateEmail: function (userEmail, response, user) {
        logger.debug('crud common activateEmail');

        var Query={
            "emailVerified": true,
            "emailActivationToken": undefined
        };
        if(user.userEmail === user.communicationEmail){
            Query["communicationEmailVerified"] = true;
        }

        User.updateOne({
            "userEmail": userEmail
        },
            {
                $set: Query
            },
            function (error, result) {
                if (error) {
                    logger.error(error);
                }
                else {
                    logger.debug('crud result'); 
                    // utils.success(response);
                    // response.json({ message: "success",code:200, });
                    utils.response(response,'success',"Email updated successfully");
                }
            });
    },


  
    ////////////Send Activation/forgotpassword link//////////////
    sendLink: function (UserEmail, Page, TokenType) {
        logger.debug('crud common sendLink');
        const config = require("../config");
        var RandomToken = utils.randomStringGenerate(32);
        var Query = {};
        var userData = {};
        if (TokenType === "forgotPasswordToken") {
            Query["passwordTokenStamp"] = new Date();
            userData.type = "forgotpassword";
        }
        else {
            userData.type = "verificationlink";
        }
        Query[TokenType] = RandomToken;
        // var Url = config.reqUrl + "/email/verificiat/?email=" + UserEmail + "&token=" + RandomToken;
        var Url = RandomToken;

        User.updateOne({
            "userEmail": UserEmail
        },
            {
                $set: Query
            },
            function (error, result) {
                if (error) {
                    logger.error(error);
                }
                else {
                    logger.debug('crud result');
                    userData.email = UserEmail;
                    // userData.url = Url;
                    userData.token = RandomToken
                    utils.createMail(userData, userData.type);
                }
            });

    },

    checkMobile: function (mobile, callback) {
        logger.debug('crud commonoperations checkMobile');

        User.findOne({
            "$or":[
                { "mobile":mobile },
                { "temporaryMobile":mobile }
            ]
        },
            function (error, result) {
                if (error) {
                    logger.error(error);
                    callback(error,null);
                }
                else {
                    logger.debug('crud result');
                    callback(null,result);
                }
            });
    },

    checkEmail: function (Query, callback) {
        logger.debug('crud commonoperations checkEmail');

        User.findOne(Query,
            function (error, result) {
                if (error) {
                    logger.error(error);
                    callback(error,null);
                }
                else {
                    logger.debug('crud result');
                    callback(null,result);
                }
            });
    },

    

  
};





module.exports = dbOperations; 
