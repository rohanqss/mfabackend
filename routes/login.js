'use strict';

//Routing for login factory only calls

const express = require('express');
const router = express.Router();
const utils = require('../config/utils');
const dbOperations = require("../config/crudoperations/login");
const validate =require("../config/validate");
const logger = require("../config/logger");

///Logging in 
router.post('/login',function(request,response){
    logger.debug('routes login login');
    
    var loginObject=request.body;
    var message = "Invalid parameters provided -";
    var isValidUserEmail = false;
    var isValidUsername = false;
    var isValidMobile = false;
    var isValidPassword = false; 
    if(loginObject.loginId){
        request.body.loginId=request.body.loginId.toLowerCase();
        isValidUserEmail=validate.email(loginObject.loginId);
        isValidUsername=validate.username(loginObject.loginId);
        isValidMobile=validate.mobile(loginObject.loginId);
    }
    if(!isValidUserEmail && !isValidUsername && !isValidMobile){
        message+=" loginId";
    }

    if(loginObject.password){
        isValidPassword = validate.password(loginObject.password);
    }
    if(!isValidPassword){
        message+=" password";
    }

    
    if((isValidUserEmail===true || isValidUsername===true || isValidMobile===true) && isValidPassword===true
    && (loginObject.rememberMe===true || loginObject.rememberMe===false || loginObject.rememberMe===undefined)){
       
        dbOperations.doLogin(request,response);
    }
    else{
        
        utils.response(response,'unknown',message);
    }
});

router.post('/loginOTP',function(request,response){
    logger.debug('routes login login');

    dbOperations.sendVerificationCode(request, response);

});
router.post('/verifyOTP',function(request,response){
    logger.debug('routes login login');

    var loginObject=request.body;
    var message = "Invalid parameters provided -";
    var isValidUserEmail = false;
    var isValidUsername = false;
    var isValidMobile = false;
    var isValidPassword = false;

    dbOperations.verifyCode(request, response);

});

router.post('/2faverifyOTP',function(request,response){
    logger.debug('routes login login');

    var loginObject=request.body;
    var message = "Invalid parameters provided -";
    var isValidUserEmail = false;
    var isValidUsername = false;
    var isValidMobile = false;
    var isValidPassword = false;

    dbOperations.verifyCode2fa(request, response);

});
router.post('/2faresendOTP',function(request,response){
    logger.debug('routes login login');

    var loginObject=request.body;
    var message = "Invalid parameters provided -";
    var isValidUserEmail = false;
    var isValidUsername = false;
    var isValidMobile = false;
    var isValidPassword = false;

    dbOperations.resend2faOtp(request, response);

});



module.exports = router;