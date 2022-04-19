'use strict';

///Routing for forgotpassword factory only calls

const express = require('express');
const router = express.Router();
const utils = require('../config/utils');
const dbOperations = require("../config/crudoperations/forgotpassword");
const validate =require("../config/validate");
const logger = require("../config/logger");

//////Send Link
router.post('/send-link',function(request,response){
    logger.debug('routes forgotpass sendlink');
    var isValidUserEmail = false;
    if(request.body.email){
        request.body.email=request.body.email.toLowerCase();
        isValidUserEmail=validate.email(request.body.email);
    }
    
    
    if(isValidUserEmail===true){
        dbOperations.checkEmail(request,response);
    }
    else{
        utils.response(response,'unknown','Invalid parameter provided - email');
    }
});

///////Check Token
router.post('/password-reset',function(request,response){
    logger.debug('routes forgotpass passwordReset');
    var passwordObject=request.body;
    var isValidUserEmail=validate.email(passwordObject.email);
    var isValidToken=validate.string(passwordObject.token);
    var isValidPassword;
    if(passwordObject.newPassword!=undefined){
        isValidPassword=validate.password(passwordObject.newPassword);
        if(isValidUserEmail===true && isValidToken===true && isValidPassword===true){
            dbOperations.passwordReset(request,response);
        }
        else{
            // response.json({message:"fail"});
            // utils.fail(response);
            utils.response(response,'fail');
        }
    }
    else if(isValidUserEmail===true && isValidToken===true){
        dbOperations.passwordReset(request,response);
    }
    else{
        // response.json({message:"fail"});
        // utils.fail(response);
        utils.response(response,'fail');
    }
});

module.exports = router;