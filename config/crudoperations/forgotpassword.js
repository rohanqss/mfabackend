'use strict';

const User = require("../schemas/userschema");
const commonOperations=require("./commonoperations");
const logger = require("../logger");
const utils = require("../utils");
const dbOperations= {

/////Sending link with token
    checkEmail:function (request,response){
        logger.debug('crud forgotpass checkEmail');
    
        var ForgotObject =request.body;
        User.find({"userEmail":ForgotObject.email},function(error,result){
            if(error){
                logger.error(error);
            }
            else{ 
                logger.debug('crud result'); 
                if(result[0]!=undefined){
                    commonOperations.sendLink(ForgotObject.email,"forgotpassword","forgotPasswordToken");
                    //need to be a callback function
                    response.json({message:"Email sent",success:true,code:200});
                }
                else
                {
                    response.json({message:"Email not found",code:404,success:false});
                }
            }
        });
    }, 

/////checking token
    passwordReset:function(request,response){
        logger.debug('crud forgotpass passwordReset');
        var that=this;
        var PasswordObject=request.body;
        
        User.find({
        "$and":[
            {
                "userEmail":PasswordObject.email
            }, 
            {
                "forgotPasswordToken":PasswordObject.token
            }
        ]
        }
        ,function(error,result){
        if(error){
            logger.error(error);
        }
        else{ 
            logger.debug('crud result'); 
            var date=new Date();
            
            if(result.length<1){
                // response.json({message:"fail"});
                // utils.fail(response);
                utils.response(response,'fail',"Invalid email or token");
            }
            else if((Math.abs(date-result[0].passwordTokenStamp))>86400000){
                // response.json({message:"fail"});
                // utils.fail(response);
                utils.response(response,'fail',"Token expired");
            }
            else{
                if(PasswordObject.newPassword!=undefined){
                    that.saveNewPassword(request,response);
                }
                else{
                    // response.json({message:"success"});
                    // utils.success(response);
                    utils.response(response,'success',"Valid token");
                }
            }
        } 
        });
    },   

/////////Saving new password
    saveNewPassword:function (request,response){
        logger.debug('crud forgotpass saveNewPassword');
        
        var newPasswordObject=request.body;

        const encrypt=require('../encrypt');
        var salt=encrypt.genRandomString(16);
        var encryptedData=encrypt.sha512(newPasswordObject.newPassword,salt);

        newPasswordObject.newPassword=encryptedData.hash;
        newPasswordObject.salt=encryptedData.salt;

        User.updateOne({
            "userEmail":newPasswordObject.email
        },
        {
            $set:{
                "password1":newPasswordObject.newPassword,
                "salt":newPasswordObject.salt,
                "emailVerified":true,
                "forgotPasswordToken":undefined,
            }
        },function(error,result){
            if(error){
                logger.error(error);
            }
            else{ 
                logger.debug('crud result'); 
                // response.json({message:"success"});
                // utils.success(response);
                utils.response(response,'success',"Password updated successfully");
            }
        });
    },

};

module.exports =dbOperations;