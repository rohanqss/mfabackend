'use strict';


const Session = require("./schemas/sessionschema");
var jwt = require('jsonwebtoken');
const logger = require("./logger");
const config = require("./config");

var TokenOperations = {

    generateJwt : function(id,duration){
        logger.debug('jwt generateJwt');
        var token = jwt.sign({ userId: id }, config.jwtKey, {
            expiresIn: config.jwtDuration * duration
        });
        return token;
    },

    getUserid: function(token,callback){
        logger.debug('jwt getuserId');
        Session.findOne({sessionId:token},function(error,result){
            if(error){
                logger.error(error);
                callback(null);
            }
            else{
                if(result && result.userId){
                    callback(result);
                }
                else{
                    callback(null);
                }   
            }
        });
    },


    fillJwtSession: function(request, userData, callback){
        logger.debug('jwt fillJwtSession');
        var that = this;
        if (userData.userId) {
            var duration = 1;
            if(userData.rememberMe){
                duration = 30;
            }
            var token = that.generateJwt(userData.userId,duration);
            // userData=userData.toObject();
            userData.objectId = userData._id;
            userData._id=undefined; //prevent duplicate record error
            userData.sessionId=token;
            userData.uuid = "xxxxxxxxxx";
            const uuid = request.headers["uuid"];
            if(uuid && config.sessionType !== 'single'){
                userData.uuid = uuid;
            }

            Session.find({ 
                userId : userData.userId ,
                uuid: userData.uuid
            }).remove(function (error, result) {
                if (error) {
                    logger.error(error);
                    callback(null);
                }
                else{
                    that.storeSession(userData, callback);
                }
            });
        }

    },

    storeSession: function(userData, callback){
        logger.debug('jwt storeToken');
        Session.create(userData,function(error,result){

            if(error){
                logger.error(error);
                callback(null)
            }
            else{
                callback(userData);
            }
        });
    },
};

module.exports = TokenOperations;    