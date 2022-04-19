'use strict';

///Routing for shared calls

const express = require('express');
const router = express.Router();
const utils = require('../config/utils');
const dbOperations = require("../config/crudoperations/commonoperations");
const validate =require("../config/validate");
const logger = require("../config/logger");

////////////Activate Email
router.post('/activate-email',function(request,response){
    logger.debug('routes common activateemail');
    var activationObject=request.body;
    var isValidUserEmail = false;
    var isValidToken = false;
    var message = "Invalid parameters provided -";
    if(activationObject.userEmail){
        isValidUserEmail=validate.email(activationObject.userEmail);
    }
    if(!isValidUserEmail){
        message+=" userEmail";
    }

    if(activationObject.token){
        isValidToken=validate.string(activationObject.token);
    }
    if(!isValidToken){
        message+=" token";
    }
 
    if(isValidUserEmail===true && isValidToken===true){
        dbOperations.checkToken(request,response);
    }
    else{
        utils.response(response,'unknown',message);
    }
});


////////////CheckUsername if already exists
router.post('/check-username',function(request,response){
    logger.debug('routes common checkUsername');
    if(request.body.username && validate.username(request.body.username)){
        request.body.username=request.body.username.toLowerCase();
        var usernameObj=request.body;
        usernameObj.notFound=undefined;
        dbOperations.checkUsername(usernameObj,function(){
        if(usernameObj.notFound==true){
            response.json({"message":"Not found",code:404,success:false});
        }
        else{
            response.json({"message":"Found",code:200,success:true});
        }
        });
    }
    else{
        utils.response(response,'unknown','Invalid parameter provided - username');
    }
    
    
});

//////////getUsername from mobile///////
router.post('/get-username',function(request,response){
    logger.debug('routes common get-username');
    var mobileNumber = request.body.mobile;
    var isMobileValid = validate.mobile(mobileNumber);

    if(isMobileValid===true){
        dbOperations.getUsername(mobileNumber,(error,result)=>{
            if(error){
                utils.response(response,'fail');
            }
            else{
                if(result.length<1){
                    response.json({message:'Not found',success:false,code:404});
                }
                else{
                    response.json({message:'success',success:true,code:200,data:{username:result[0].username}});
                }
            }
        });
    }
    else{
        utils.response(response,'unknown');
    } 
});









module.exports = router;



