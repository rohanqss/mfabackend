'use strict';

const User = require("../schemas/userschema");
const utils =require("../utils");
const commonOperations=require("./commonoperations");
const logger = require("../logger");

const dbOperations={

    //Updating username
    changeUsername:function(request,response,session){
        logger.debug('crud profile changeUsername');
        var UsernameObject=request.body;
        var userEmail= session.userEmail;
        
        var obj={
            "username":UsernameObject.username,
            "notFound":undefined
        };
        commonOperations.checkUsername(obj,function(){
            if(obj.notFound===true){
                User.updateOne({"userEmail":userEmail}, 
                {
                    $set:{
                        "username":obj.username,
                    }
                },
                function(error,result){
                    if(error){
                        logger.error(error);
                    }
                    else{ 
                        logger.debug('crud result'); 
                        // response.json({message:"success"});
                        // utils.success(response);
                        utils.response(response,'success', "Username updated successfully");
                    }
                });
            }
            else{
                response.json({message:"Username taken",code:200,success:false});
            }
        });      
    },



    ////updating info
    updateProfileData:function (request,response,session){
        logger.debug('crud profile updateProfileData');
        


        var userEmail= session.userEmail;
    
        User.updateOne({
            "userEmail":userEmail
        }, 
        {
            $set:{
               "is2faEnabled":request.body.is2faEnabled
            }
        }
        ,function(error,result){
            if(error){
                logger.error(error);
            }
            else{ 
                logger.debug('crud result'); 
                // response.json({message:"success"});
                // utils.success(response);
                utils.response(response,'success', "Userinfo updated successfully");
            }
        });
    }, 
    /////////////Mobile Number Verifiction 
    ////Send Sms
    sendVerificationCode:function(request,response,session){
        logger.debug('crud profile sendVerificationCode');
        var MobileObject = request.body;
        var UserEmail = session.userEmail;
        var number = MobileObject.countryCode + MobileObject.mobileNumber;
        var code = utils.randomNumberGenerate(1000,9999);
        var body = 'Your verification code for TinkerSale is :' + code;
        var newTimeStamp = new Date();
        console.log(request.body);
        User.findOne({
            "userEmail": UserEmail,
            "mobile": number
        },
            function (error, result) {
                if (error) {
                    logger.error(error);
                }
                else if (result && result.mobileTokenStamp && (Math.abs(newTimeStamp - result.mobileTokenStamp)) < 900000) {
                    logger.debug('crud result');
                    body = 'Your verification code is ' + result.mobileVerificationCode;
                    utils.sendSms(number, body);
                    // response.json({ message: "success" });
                    // utils.success(response);
                    utils.response(response,'success',"Code sent");
                }
                else {
                    User.updateOne({
                        "userEmail": UserEmail
                    },
                        {
                            $set: {
                                "countryCode": MobileObject.countryCode,
                                "mobileTokenStamp": newTimeStamp,
                                "temporaryMobile": number,
                                "mobileVerificationCode": code
                            }
                        },
                        function (error, result) {
                            if (error) {
                                logger.error(error);
                            }
                            else {
                                logger.debug('crud result');
                                utils.sendSms(number, body);
                                //need to be a callback function
                                // response.json({ message: "success" });
                                // utils.success(response);
                                utils.response(response,'success',"Code sent");
                            }
                        });
                }
            });
    },

    ////verify code
    verifyCode:function(request,response,session){
        logger.debug('crud profile verifyCode');
        var that=this;
        var UserEmail= session.userEmail;
        var CodeObject=request.body;
        var date = new Date();
        
        User.find({
        "$and":[
            {
                "userEmail":UserEmail
            }, 
            {
                "mobileVerificationCode":CodeObject.code
            }
        ]
        }
        ,function(error,result){
            if(error){
                logger.error(error);
            }
            else{ 
                logger.debug('crud result'); 
                if(result.length<1){
                    // response.json({message:"fail"});
                    // utils.fail(response);
                    utils.response(response,'fail',"Invalid code");
                }
                else if((Math.abs(date-result[0].mobileTokenStamp))>900000){
                    response.json({message:"Code expired",code:400,success:false});
                }
                else{
                    that.checkMobileExists(result,response);
                }
            } 
        });
    },

     ////Check if mobile no. already exists
    checkMobileExistsCb:function(mobile,cb){
        logger.debug('crud profile checkMobileExistsCb');
        User.findOne({
            "mobile":mobile
        },function(error,result){
            if(error){
                logger.error(error);
                cb(error,null);
            }
            else{
                logger.debug('crud result'); 
                cb(null,result);
            }
        });        
    },

    checkMobileExists:function(result,response){
        logger.debug('crud profile checkMobileExists');
        var that=this;
        var oldResult=result;

        User.find({
            "mobile":result[0].temporaryMobile
        },function(error,result){
            if(error){
                logger.error(error);
            }
            else{
                logger.debug('crud result'); 
                if(result[0]!=undefined){
                    response.json({message:"Mobile number exists",code:200,success:false});
                }
                else{
                    that.setMobile(oldResult,response);
                }
            }
        });        
    },

    ////Updating Mobileno.
    setMobile:function(result,response){
        logger.debug('crud profile setMobile');
        var TemporaryMobile=result[0].temporaryMobile;
        var UserEmail=result[0].userEmail;
        const config = require('../config');
        var newRole = result[0].role;
        if(result[0].role === config.defaultRole){
            newRole = config.alternateRole0;
        }

        User.updateOne({
            "userEmail":UserEmail
        },
        {
            $set:{
                "mobile":TemporaryMobile,
                "temporaryMobile":undefined,
                "mobileVerificationCode":undefined,
                "mobileTokenStamp":undefined,
                "role": newRole
            }
        },function(error,result){
            if(error){
                logger.error(error);
            }
            else{ 
                logger.debug('crud result'); 
                // response.json({message:"success"});
                // utils.success(response);
                utils.response(response,'success',"Mobile number updated successfully");
            }
        });
    },

    //////Checking old password
    checkPassword:function (request,response,session){
        logger.debug('crud profile checkPassword');
        var that=this;
        var passwordObject=request.body;
        var userEmail=session.userEmail;
        User.find({
            "userEmail":userEmail
        }
        ,function(error,result){
            if(error){
                logger.error(error);
            }
            else{ 
                logger.debug('crud result'); 
                if(result.length<1){
                    response.json({message:"User not found",success:false,code:404});
                }
                else if(result[0].salt===undefined){
                    // response.json({message:"fail"});
                    // utils.fail(response);
                    utils.response(response,'fail');
                }
                else{
                    const encrypt=require('../encrypt');
                    var salt=result[0].salt;
                    var encryptedData=encrypt.sha512(passwordObject.oldPassword,salt);

                    passwordObject.oldPassword=encryptedData.hash;
                    if(result[0].password1===passwordObject.oldPassword){
                        that.setNewPassword(request,response,session.userEmail);
                    }
                    else{
                        // response.json({message:"fail"});
                        // utils.fail(response);
                        utils.response(response,'fail',"Incorrect old password");
                    }  
                }  
            }
        });
    },
    //////////////Setting new password
    setNewPassword:function (request,response,userEmail){
        logger.debug('crud profile setNewPassword');
        var passwordObject=request.body;

        const encrypt=require('../encrypt');
        var salt=encrypt.genRandomString(16);
        var encryptedData=encrypt.sha512(passwordObject.password1,salt);

        passwordObject.password1=encryptedData.hash;
        passwordObject.salt=encryptedData.salt;
    
        User.updateOne({
            "userEmail":userEmail
        }, 
        {
            $set:{
                "password1":passwordObject.password1,
                "salt":passwordObject.salt
            }
        },
        function(error,result){
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

   
    updateProperty: function (userId, field, target, callback) {
        logger.debug('crud profile updateProperty');

        var Query = {};
        Query[field] = target;
        User.updateOne({
            "userId": userId
        }, {
                $set: Query
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

    loadUsers: function (request, response, userData) {
        logger.debug('crud profile loadUsers');

        var type = request.body.type || "search";
        var filters = request.body.filters || {};
        var sortBy = request.body.sortBy || {};
        var count = request.body.count || 0;
        var fields = request.body.fields || 'min';

        var SortQuery = {};
        if (sortBy.type && sortBy.order === 1 || sortBy.order === -1) {
            SortQuery[sortBy.type] = sortBy.order;
        }

        var Query = {};
        const config = require('../config');
        Query['role'] = {};

        try{
            request.body.hasFilters = false;
            Object.keys(filters).forEach(function (key) {  //only checks whether atleast a single filter exists or not
                if (filters[key] != "") {
                    request.body.hasFilters = true;
                }
            });

            if (request.body.hasFilters === true) {
                Object.keys(filters).forEach(function (key) {
                    if (filters[key] && key === "registrationDate") {
                        if (filters.registrationDate.startDate && filters.registrationDate.endDate) {
                            var x = new Date(filters.registrationDate.startDate);
                            var y = new Date(filters.registrationDate.endDate);
                            Query["registrationDate"] = { "$gte": x, "$lte": y};
                        }   
                    }
                    else if (filters[key]) {
                        filters[key] = filters[key].trim();
                        Query[key] = { $regex: filters[key], $options: "$i" };
                    }
                });
            }
        }
        catch(error){
            logger.error(error);
        }

        var Fields = {
            salt:false,
            password1:false,
            emailActivationToken:false,
            forgotPasswordToken:false,
            mobileVerificationCode:false,
            social:false
        };

        if (fields === 'max') {
            Fields = {
                salt:false,
                password1:false,
                emailActivationToken:false,
                forgotPasswordToken:false,
                mobileVerificationCode:false,
                social:false
            }
        }
        else if (fields === 'super' && userData &&(config.higherOrderRoles.indexOf(userData.role) > -1)) {
            Fields = {
                salt:false,
                password1:false,
                emailActivationToken:false,
                forgotPasswordToken:false,
                mobileVerificationCode:false,
                social:false
            };
        }
        Query['role']["$ne"]=config.higherOrderRoles[0];

        User
            .find(Query, Fields)
            .sort(SortQuery)
            .skip(count)
            .limit(10)
            .exec(function (error, result) {
                if (error) {
                    logger.error(error);
                }
                else {
                    logger.debug('crud result');
                    if (result.length < 1) {
                        response.json({ message: "No users found",success:false,code:404 });
                    }
                    else {
                        var ten = result;
                        if(ten.length<1){
                            response.json({ message: "No users found",success:false,code:404 }); 
                        }
                        else {
                            for(var i =0 ;i<ten.length;i++){
                                ten[i] = ten[i].toObject();
                                if(ten[i].address){
                                    ten[i].firstName = ten[i].address.firstName;
                                    ten[i].lastName = ten[i].address.lastName;
                                    ten[i].middleName = ten[i].address.middleName;
                                    ten[i].address.firstName = undefined;
                                    ten[i].address.lastName = undefined;
                                    ten[i].address.middleName = undefined;
                                }
                            }
                            response.send({message:"success","success":true,"code":200,"data":{users:ten}});
                        }
                    }
                }
            });
    },

    getUser: function (user, callback,Fields = {}) {
        logger.debug('crud profile getUser');
        
        User.findOne({
            "$or":[
                {"userId": user},
                { "userEmail": user},
                {"username":user}
            ]
        },Fields,
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

    getUsers: function (userIds, Fields = {},callback) {
        logger.debug('crud profile getUser');
        
        User.find({
            "userId": {"$in":userIds},
               
        },Fields,
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

    verifyPassword:function (password, userId,response){
        logger.debug('crud profile verifyPassword');

        User.findOne({
            "userId":userId
        }
        ,function(error,result){
            if(error){
                logger.error(error);
            }
            else{ 
                logger.debug('crud result'); 
                if(result && result.salt===undefined){
                    utils.response(response,'fail');
                }
                else if(result){
                    const encrypt=require('../encrypt');
                    var salt=result.salt;
                    var encryptedData=encrypt.sha512(password,salt);

                    password=encryptedData.hash;
                    if(result.password1===password){
                        response.json({message:"Password valid","success":true,"code":200});
                    }
                    else{
                        response.json({message:"Password invalid","success":true,"code":200});
                    }  
                }  
                else{
                    response.json({message:"User not found",success:false,code:404});
                }
            }
        });
    },

    
  
    deleteUser: function (id, callback) {
        logger.debug('crud products deleteUser');

        User.remove({
            userId: id
        },
            function (error, result) {
                if (error) {
                    logger.error(error);
                    callback(error, null);
                }
                else {
                    callback(null, result);
                }
            });
    },

    
};

module.exports =dbOperations;