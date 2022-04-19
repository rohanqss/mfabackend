'use strict';

const User = require("../schemas/userschema");
const logger = require("../logger");
const utils =require("../utils");


const dbOperations={

    //Check login id and password > Fill Session
    doLogin:function (request,response){
        logger.debug('crud login doLogin');
        const utils =require("../utils");
        var loginObject=request.body;
        var mobileId = loginObject.loginId; 
        if(loginObject.loginId.length!=10 || loginObject.loginId.startsWith("+91")){
            mobileId = "xxxxxxxxxxxxxxx";
        }

        User.find({
            // "$or": [{
            //         "userEmail":loginObject.loginId
            //     }, 
            //     {
            //         "username": loginObject.loginId
            //     },
            //     {
            //         "mobile": { "$regex": mobileId }
            //     }]
            $and : [
                { $or : [ {
                                "userEmail":loginObject.loginId
                            },
                                {
                                    "username": loginObject.loginId
                                },
                              
                                {
                                    "mobile": { "$regex": mobileId }
                                }] },
                { $and : [ { emailVerified : true }, {mobileVerified:true } ] }
            ]
        },
        function(error,result){
            if(error){
                logger.error(error);
            }
            else{ 
                logger.debug('crud result'); 
                if(result.length<1){
                    // response.json({message:"fail",code:"404",success:'false'});
                    // utils.fail(response);
                    response.json({message:'User not found',success:false,code:404});
                    // utils.response(response,'fail');
                }
                else{
                    var i=0;
                    var numberOfUsersFound=0;
                    const encrypt=require('../encrypt');
                    while(i<result.length){
                        if(result[i].salt===undefined){
                            i++;
                        }
                        else{
                            var salt=result[i].salt;
                            var encryptedData=encrypt.sha512(loginObject.password,salt);

                            var encryptedPassword=encryptedData.hash;
                            if(result[i].password1===encryptedPassword){
                                result[i].rememberMe=loginObject.rememberMe;
                                numberOfUsersFound++;
                                var sessionData=result[i];
                            }
                            i++;    
                       }
                    }
                    if(numberOfUsersFound===1){
                        if(sessionData.is2faEnabled===true)
                        {
                            var responseObject={
                                message:"Otp send to email and mobile successfully",
                                code:200,
                                success:true
                            };
                            var token =utils.randomNumberGenerate(100000,999999);
                           sessionData.mobileVerificationCode=token
                            User.updateOne({
                                "userEmail": sessionData.userEmail
                            },
                            {
                                $set: {
                                   
                                    "mobileTokenStamp":  new Date(),
                                  
                                    "mobileVerificationCode": token
                                }
                            },
                            function (error, result) {
                                if (error) {
                                    logger.error(error);
                                } else {
                                    //console.log("verification ---->", result, code)
                                    if (result) {
    
                                        var body='Your verification code is '+ token;
                                        utils.sendSms(sessionData.mobile,body);
                                        utils.createMail(sessionData,"verification2fa")
                                        response.json(responseObject)
    
                                      
                                    } else {
                                    }
                                }
                            });
                        }
                        else{
                            var responseObject={
                                message:"authenticated successfully",
                                code:200,
                                success:true
                            };
                            utils.fillSession(request,response,sessionData,responseObject);

                        }
   
                                // utils.fillSession(request,response,sessionData,responseObject);

                      

                    }
                    else if(numberOfUsersFound>1){
                        response.json({message:"Conflict! Try logging using email",code:400,success:false});
                    }
                    else{
                        // response.json({message:"fail",code:"404",success:'false'});
                        // utils.fail(response);
                        utils.response(response,'fail','User not found');
                    }  
                }  
            }
        });
    },
    resend2faOtp:function (request,response){
        logger.debug('crud login doLogin');
        const utils =require("../utils");
        var loginObject=request.body;
        var mobileId = loginObject.loginId; 
        if(loginObject.loginId.length!=10 || loginObject.loginId.startsWith("+91")){
            mobileId = "xxxxxxxxxxxxxxx";
        }

        User.findOne({
            "$or": [{
                    "userEmail":loginObject.loginId
                }, 
                {
                    "username": loginObject.loginId
                },
                {
                    "mobile": { "$regex": mobileId }
                }]
        },
        function(error,result){
            if(error){
                logger.error(error);
            }
            else{ 
              console.log("ddssd",result)
                if(result===null)
                {
                    utils.response(response, 'fail', "No User Exist");

                }
                else{
                    var responseObject={
                        message:"Otp send to email and mobile successfully",
                        code:200,
                        success:true
                    };
                    var token =utils.randomNumberGenerate(100000,999999);
                   result.mobileVerificationCode=token
                    User.updateOne({
                        "userEmail": result.userEmail
                    },
                    {
                        $set: {
                           
                            "mobileTokenStamp":  new Date(),
                          
                            "mobileVerificationCode": token
                        }
                    },
                    function (error, result22) {
                        if (error) {
                            logger.error(error);
                        } else {
                            //console.log("verification ---->", result, code)
                            if (result22) {

                                var body='Your verification code is '+ token;
                                utils.sendSms(result.mobile,body);
                                utils.createMail(result,"verification2fa")
                                response.json(responseObject)

                              
                            } else {
                            }
                        }
                    });
                }
                
                      
                          
                        }
              
        });
    },
    sendVerificationCode:function(request,response){
        logger.debug('crud profile sendVerificationCode');
        var MobileObject = request.body;
        var number = MobileObject.countryCode + MobileObject.mobileNumber;
        var code = utils.randomNumberGenerate(100000,999999);
        var body = 'Your OTP for OpenCityLabs.com is :' + code;
        var newTimeStamp = new Date();
        //console.log(request.body);
        User.findOne({
                "temporaryMobile": number
            },
            function (error, result) {
                if (error) {
                    logger.error(error);
                }
                    // else if (result && result.mobileTokenStamp && (Math.abs(newTimeStamp - result.mobileTokenStamp)) < 900000) {
                    //     logger.debug('crud result');
                    //     body = 'Your OTP for Arjoi.com is ' + result.mobileVerificationCode;
                    //     utils.sendSms2(number, body);
                    //     utils.response(response,'success',"Code sent");
                // }
                else {
                    if (result != undefined) {
                        User.updateOne({
                                "temporaryMobile": number
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
                                } else {
                                    //console.log("verification ---->", result, code)
                                    if (result) {

                                        logger.debug('crud result');
                                        utils.sendSms(number, body);
                                        //need to be a callback function
                                        // response.json({ message: "success" });
                                        // utils.success(response);
                                        utils.response(response, 'success', "Code sent");
                                    } else {
                                        utils.response(response, 'fail', "No User Exist");
                                    }
                                }
                            });
                    }
                    else{
                        utils.response(response, 'fail', "No User Exist");
                    }
                }
            });
    },

    ////verify code
    verifyCode:function(request,response){

        var CodeObject=request.body;
        var number = CodeObject.countryCode + CodeObject.mobileNumber;

        var date = new Date();

        User.find({
                "$and":[
                    {
                        "temporaryMobile": number,
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
                    //console.log("verification verify ---->", result,number,CodeObject.code)

                    logger.debug('crud result');
                    if(result.length<1){
                        // response.json({message:"fail"});
                        // utils.fail(response);
                        utils.response(response,'fail',"Invalid code");
                    }
                    // else if(!result[0].active){
                    //     utils.response(response,'fail',"User ban by admin");
                    // }
                    else if((Math.abs(date - result[0].mobileTokenStamp))>900000){
                        response.json({message:"Code expired",code:400,success:false});
                    }
                    else{
                        User.updateOne({
                            "temporaryMobile": number,
                        },{$set:{"mobileVerified":true,
                    "mobile":number,
                    "mobileTokenStamp": null,
                    "mobileVerificationCode": null,
                "temporaryMobile":null}},function (error,updateresult){
                            //console.log("result ----> ",result)
                            var sessionData=result[0];

                            if(sessionData.emailVerified===false)
                            {
                                var responseObject={
                                    message:"Mobile Verified successfully Please verify your email to proceed",
                                    code:200,
                                    success:true
                                };
                                response.json(responseObject)
                            }
                            else{
                                sessionData.mobileVerified = true
                                var responseObject={
                                    message:"authenticated successfully",
                                    code:200,
                                    success:true
                                };
    
                             
                                        utils.fillSession(request,response,sessionData,responseObject);
                            }
                           

                             
                        })


                    }
                }
            });
    },
    verifyCode2fa:function(request,response){

        var CodeObject=request.body;

        var date = new Date();

        User.findOne(
                    {
                        "mobileVerificationCode":CodeObject.code
                    }
                
      
            ,function(error,result){
                if(error){
                    logger.error(error);
                }
                else{
                    //console.log("verification verify ---->", result,number,CodeObject.code)

                    logger.debug('crud result');
                    if(result===null){
                        // response.json({message:"fail"});
                        // utils.fail(response);
                        utils.response(response,'fail',"Invalid code");
                    }
                    
                    // else if(!result[0].active){
                    //     utils.response(response,'fail',"User ban by admin");
                    // }
                    else if((Math.abs(date - result.mobileTokenStamp))>900000){
                        response.json({message:"Code expired",code:400,success:false});
                    }
                    else{
                        User.updateOne({
                            "mobileVerificationCode":CodeObject.code
                        },{$set:{   "mobileTokenStamp": null,
                        "mobileVerificationCode": null,
                "temporaryMobile":null}},function (error,updateresult){
                            //console.log("result ----> ",result)
                            var sessionData=result;
                       
                                var responseObject={
                                    message:"authenticated successfully",
                                    code:200,
                                    success:true
                                };
    
                             
                                        utils.fillSession(request,response,sessionData,responseObject);
                            
                           

                             
                        })


                    }
                }
            });
    },
};

module.exports =dbOperations;