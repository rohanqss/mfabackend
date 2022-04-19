'use strict';

///Routing for register factory only calls

const express = require('express');
const router = express.Router();
const utils = require('../config/utils');

const dbOperations = require("../config/crudoperations/signup");
const validate =require("../config/validate");
const logger = require("../config/logger");

////User registration
router.post('/register',function(request,response){
    logger.debug('routes signup signup');
    
    var userObject=request.body;
    var message = "Invalid parameters provided -";
    var isValidUserEmail = false;
    var isValidUsername = false;
    var isValidPassword = false;
  
    var isValidFname = false;
    var isValidMname = true;
    var isValidLname = false;
    var isValidMobile = false;
    var isValidCcode = false;
   
  

  

    if(userObject.userEmail){
        request.body.userEmail=request.body.userEmail.toLowerCase();
        isValidUserEmail=validate.email(userObject.userEmail);
    }
    if(!isValidUserEmail){
        message+=' userEmail';
    }


    if(userObject.username){
        request.body.username=request.body.username.toLowerCase();
        isValidUsername=validate.username(userObject.username);
    }
    if(!isValidUsername){
        message+=' username';
    }

    if(userObject.password){
        isValidPassword=validate.password(userObject.password);
    }
    if(!isValidPassword){
        message+=' password';
    }
    
    
    


 
   
 

    if(userObject.firstName){
        isValidFname = validate.name(userObject.firstName);
    }
    if(!isValidFname){
        message+=' firstName';
    }

    if(userObject.middleName){
        isValidMname = validate.name(userObject.middleName);
    }
    if(!isValidMname){
        message+=' middleName';
    }

    if(userObject.lastName){
        isValidLname = validate.name(userObject.lastName);
    }
    if(!isValidLname){
        message+=' lastName';
    }

   
    if(userObject.mobile){
        isValidMobile = validate.mobile(userObject.mobile);
    }
    if(!isValidMobile){
        message+=' mobile';
    }

    if(userObject.code){
        isValidCcode = validate.code(userObject.code);
    }
    if(!isValidCcode){
        message+=' code';
    }

    if(isValidUserEmail && isValidUsername && isValidPassword
       && isValidFname && isValidLname && isValidMname 
        && isValidMobile){
        dbOperations.checkUser(request,response);
    }
    else{
        utils.response(response,'unknown',message);
    }
});

module.exports = router;