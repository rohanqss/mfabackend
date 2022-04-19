'use strict';

const User = require("../schemas/userschema");
const commonOperations=require("./commonoperations");
const logger = require("../logger");
const utils = require("../utils");
const dbOperations= {

    /////Send email activation link
    sendActivationLink:function(email,response){
        logger.debug('crud index sendActivationLink');
        commonOperations.sendLink(email,"emailactivate","emailActivationToken");
        //need to be a callback function
        // response.json({message:"success"});
        // utils.success(response);
        utils.response(response,'success',"Link sent");
    },

    ///////Check and Update session
    checkSession:function(request,response,userData){
        logger.debug('crud index checkSession');
        var that=this;
        var userId=userData.userId;
        User.findOne({
            userId:userId
        },
        function(error,result){
            if(error){
                logger.error(error);
            }
            else{
                logger.debug('crud result'); 
                if(!result){
                    // response.json({message:"fail"});
                    // utils.fail(response);
                    utils.response(response,'fail');
                }
                else{
                    var status={};
                    status.Message="Hello "+result.username;
                    status.Email=result.userEmail;
                    status.ActivationStatus=result.emailVerified;
                    // if(result.username!=userData.username || result.address!=userData.address){
                        var sessionData=result;
                        const utils = require("../utils");
                        utils.fillSession(request,response,sessionData,status); 
                    // }
                    // else{
                    //     status.userData=userData;
                    //     response.send(status);
                    // }
                }
            }
        })
    },

    //////Session destroy
    destroySession:function(request,response){
        logger.debug('crud index destroySession');
        const utils = require("../utils");
        if(request.sessionMode === 'jwt'){
            utils.appSessionDestroy(request.token,response);
        }
        else if(request.sessionMode === 'app'){
            utils.appSessionDestroy(request.body.sessionId,response);
        }
        else if(request.sessionMode === 'web'){
            utils.webSessionDestroy(request,response);
        }
    }

};

module.exports =dbOperations;