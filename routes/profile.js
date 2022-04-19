'use strict';

///Routing for profile factory only calls

const express = require('express');
const router = express.Router();
const utils = require('../config/utils');
const dbOperations = require("../config/crudoperations/profile");
const validate =require("../config/validate");
const logger = require("../config/logger");




/////////////Change Username
router.post('/change-username',function(request,response){
    logger.debug('routes profile changeUsername');
    var isValidUsername = false;
    if(request.body.username){
        request.body.username=request.body.username.toLowerCase();
        isValidUsername=validate.username(request.body.username);
    }
    
    if(isValidUsername){
        dbOperations.changeUsername(request,response,request.userData);
    }
    else{
        // response.json({message:"unknown",success:false,code:400});
        utils.response(response,'unknown','Invalid parameter provided - username');
    }
});

////////////Edit/Update profile data
router.post('/update-profile-data',function(request,response){
    logger.debug('routes profile updateProfileData');
    var isValidFname = true;
    var isValidLname = true;
    var isValidMname = true;
  
    var message = "Invalid parameters provided - ";
    var profileObject=request.body;
   
    if(profileObject.firstName == undefined){
        isValidFname = true;
    }
    else{
       isValidFname = validate.name(profileObject.firstName); 
       isValidFname==true?message=message:message=message+" first-name";
    }

    if(profileObject.middleName == undefined){
        isValidMname = true;
    }
    else{
       isValidMname = validate.name(profileObject.middleName); 
       isValidMname==true?message=message:message=message+" middle-name";
    }

    if(profileObject.lastName == undefined){
        isValidLname = true;
    }
    else{
       isValidLname = validate.name(profileObject.lastName); 
       isValidLname==true?message=message:message=message+" last-name";
    }

   
    if(isValidFname && isValidMname && isValidLname ){
        dbOperations.updateProfileData(request,response,request.userData);
    }
    else{
        // response.json({message:"unknown",code:400,success:false});
        utils.response(response,'unknown',message);
    }
});

////////////Mobile no. verification
/////Send Code
router.post('/update-mobile',function(request,response){
    logger.debug('routes profile updateMobile');
    var isValidCountryCode = false;
    var isValidMobile = false;
    var message = "Invalid parameter provided -";
    var mobileObject=request.body;
    if(mobileObject.mobileNumber){
        isValidMobile=validate.mobile(mobileObject.mobileNumber);
    }
    if(!isValidMobile){
        message+=" mobileNumber";
    }

    if(mobileObject.countryCode){
        isValidCountryCode=validate.code(mobileObject.countryCode);
    }
    if(!isValidCountryCode){
        message+=" countryCode";
    }
    
    if(isValidCountryCode && isValidMobile){
        dbOperations.checkMobileExistsCb(mobileObject.countryCode + mobileObject.mobileNumber,(err,res)=>{
            if(err){
                utils.response(response,"fail");
            }
            else if(res && res.mobile){
                response.json({message:"Mobile number exists",code:200,success:false});
            }
            else{
                dbOperations.sendVerificationCode(request,response,request.userData);
            }
        })
    }
    else{
        utils.response(response,'unknown',message);
    }
});

router.post('/resend-code',function(request,response){
    logger.debug('routes profile resend-code');
    if(request.userData.temporaryMobile){
        request.body = {
            countryCode:request.userData.countryCode,
            mobileNumber:request.userData.temporaryMobile
        }
        let mobNo = request.body.countryCode + request.body.mobileNumber;
        dbOperations.checkMobileExistsCb(mobNo,(err,res)=>{
            if(err){
                utils.response(response,"fail");
            }
            else if(res!=undefined){
                 response.json({message:"Mobile number exists",code:200,success:false});
            }
            else{
                dbOperations.sendVerificationCode(request,response,request.userData);
            }
        })
        
    }
    else{
        utils.response(response,'unknown',"Mobile number already verified or does not exist");
    }
});

//////////////Verify Code
router.post('/verify-code',function(request,response){
    logger.debug('routes profile verifyCode');
    var isValidCode = false;
    var codeObject=request.body;
   
    if(codeObject.code){
        isValidCode = validate.code(codeObject.code);
    }
    if(isValidCode){
        dbOperations.verifyCode(request,response,request.userData);
    }
    else{
        // response.json({message:"unknown",success:false,code:400});
        utils.response(response,'unknown','Invalid parameter provided - code');
    }
});

////////////Change Password
router.post('/set-new-password',function(request,response){
    logger.debug('routes profile setNewPassword');
    var isValidOldPassword = false;
    var isValidNewPassword = false;
    var message = "Invalid parameters provided -";
    var passwordObject=request.body;
    if(passwordObject.oldPassword){
        isValidOldPassword=validate.password(passwordObject.oldPassword);
    }
    if(!isValidOldPassword){
        message+=" oldPassword";
    }

    if(passwordObject.password){
        isValidNewPassword=validate.password(passwordObject.password);
    }
    if(!isValidNewPassword){
        message+=" password";
    }
    

    if(isValidOldPassword && isValidNewPassword){
        request.body.password1 = passwordObject.password;
        dbOperations.checkPassword(request,response,request.userData);
    }
    else{
        // response.json({message:"unknown",success:false,code:400});
        utils.response(response,'unknown',message);
    }
});


/////Verify password
router.post('/verify-password', function (request, response) {
    logger.debug('routes profile verifyPassword');
    var isValidPassword = false;
    if(request.body.password){
        isValidPassword = validate.password(request.body.password); 
    }
    if (isValidPassword) {
        dbOperations.verifyPassword(request.body.password, request.userData.userId,response);
    }
    else {
        utils.response(response,'unknown','Invalid parameter provided - password');
    }
});

/////change Email
router.post('/change-email', function (request, response) {
    logger.debug('routes profile changeEmail');
    var isValidEmail = false;


    var isValidUserId = false;


    var Query = {};
    if(request.body.email){
        isValidEmail = validate.email(request.body.email);
        if(isValidEmail){
            Query["userEmail"] = request.body.email;

            if(request.body.userId){

                isValidUserId = validate.id(request.body.userId);
                const { higherOrderRoles } = require('../config/config');
                if(isValidUserId && higherOrderRoles.indexOf(request.userData.role) > -1 ){
                    Query["userId"] = request.body.userId;
                }
                else{
                    Query["userId"] = request.userData.userId;
                }
            }
        } 
    }    
    
  
        
   
    

    if (isValidEmail || isValidUserId) {
        const commonOperations = require('../config/crudoperations/commonoperations');
        commonOperations.checkEmail(Query, (error,result)=>{
            if(error){
                response.json({"message":"Error",success:false,code:400});
            }
            else if(result){
                response.json({"message":"Email exists!",success:true,code:200});
            }
            else{
                dbOperations.getUser(request.body.email,(e,r)=>{
                    if(e){
                        utils.response(response,'fail');
                    }
                    else if(r && r.social && r.social.length>1){
                        utils.response(response,'fail',"Cannot change email, as registered through third party OAuth");
                    }
                    else{
                        dbOperations.updateProperty(request.userData.userId, 'userEmail', request.body.email, (error,result)=>{
                            if(error){
                                utils.response(response,'fail');
                            }
                            else if(result){
                                commonOperations.sendLink(request.body.email,"emailactivate","emailActivationToken");
                                utils.response(response,'success',"Email changed successfully");
                            }
                        });
                    } 
                });
            }
        });
    }
    else {
        var message = 'Invalid parameter provided -';
        request.body.email?(isValidEmail?(message+=' email'):(message+='')):(message+='')
        request.body.userId?(isValidUserId?(message+=' userId'):(message+='')):(message+='')
        utils.response(response,'unknown',message);
    }
});






module.exports = router;