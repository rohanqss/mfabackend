'use strict';

const User = require("../schemas/userschema");

const commonOperations=require("./commonoperations");
const logger = require("../logger");
const profileOperations = require("./profile");

const dbOperations={

    ////Check Email > Username if already exists 
    checkUser:function (request,response){
        logger.debug('crud signup checkUser');
        var that=this;
        var userObject =request.body;

        User.find({
            "userEmail":userObject.userEmail
        },
        function(error,result){
            if(error){
                logger.error(error);
            }
            else{ 
                logger.debug('crud result'); 
                if(result[0]!=undefined){
                    response.json({message:"Email taken" ,code:200,success:false});
                }
                else
                {
                    var obj={
                        "username":userObject.username,
                        "notFound":undefined
                    };
                    commonOperations.checkUsername(obj,function(){
                        if(obj.notFound==true){
                            var mobileNumber = userObject.code + userObject.mobile;
                            
                            profileOperations.checkMobileExistsCb(mobileNumber,(error,result)=>{
                                if(error){
                                    utils.response(response,'fail');
                                }
                                else{
                                    if(result){
                                        response.json({"message":"Mobile taken",code:200,success:false});
                                    }
                                    else{
                                        that.addUser(request,response);
                                    }
                                }
                            });
                        }
                        else{
                            response.json({message:"Username taken",code:200,success:false});
                        }
                    });
                }
            }
        });
    },
    /////////////Adding new user
    addUser:function(request,response){
        logger.debug('crud signup addUser');
        const utils =require("../utils");
        const config = require('../config');
        var data={};
        data.userEmail=request.body.userEmail;
        data.username=request.body.username;
        data.password1=request.body.password;
        data.role=config.defaultRole;
     

        var mobileNumber = request.body.code + request.body.mobile;
        
        var token = utils.randomNumberGenerate(100000,999999);
        data.temporaryMobile = mobileNumber;
        data.countryCode = request.body.code;
        data.mobileVerificationCode = token;
        data.mobileTokenStamp = new Date();

        const encrypt=require('../encrypt');
        var salt=encrypt.genRandomString(16);
        var encryptedData=encrypt.sha512(data.password1,salt);

        data.password1=encryptedData.hash;
        data.salt=encryptedData.salt;
        data.userId = utils.randomStringGenerate(32);

        data.registrationDate=new Date();
        data.emailVerified=false;
        data.mobileVerified=false;
        data.is2faEnabled=true;
        User.create(data,function(error,result){
            
            if(error){
                logger.error(error);
            }
            else{
                logger.debug('crud result'); 
                commonOperations.sendLink(result.userEmail,"emailactivate","emailActivationToken");
                var body='Your verification code is '+ token;
                utils.sendSms(mobileNumber,body);
                var responseObject={
                    message:"successfully registered",
                    success:true,
                    code:200
                };
                response.json(responseObject)
                // utils.fillSession(request,response,result,responseObject);
            }
        });
    },

    checkUser2:function (request,response){
        logger.debug('crud signup checkUser');
        var that=this;
        var userObject =request.body;

        User.findOne({
            "userEmail":userObject.userEmail,
        },
        function(error,result){
            if(error){
                logger.error(error);
            }
            else{ 
                logger.debug('crud result'); 
                if(result){
                    response.json({message:"Email taken" ,code:200,success:false});
                }
                else
                {
                    var obj={
                        "username":userObject.username,
                        "notFound":undefined
                    };
                    commonOperations.checkUsername(obj,function(){
                        if(obj.notFound==true){
                            var mobileNumber = userObject.code + userObject.mobile;
                            commonOperations.checkMobile(mobileNumber,(error2,result2)=>{
                                if(error2){
                                    utils.response(response,'fail');
                                }
                                else{
                                    if(result2){
                                        response.json({"message":"Mobile taken",code:200,success:false});
                                    }
                                    else{
                                        User.findOne({
                                            "social": {$elemMatch: {"sId": request.body.social[0].sId}}
                                        },(error,result)=>{
                                            if(error){
                                                utils.response(response,'fail');
                                            }
                                            else{
                                                if(result){
                                                    response.json({"message":"sId already exists",code:200,success:false});
                                                }
                                                else{
                                                    that.addUser2(request,response);
                                                }
                                            }
                                        });
                                    }
                                }
                            });
                        }
                        else{
                            response.json({message:"Username taken",code:200,success:false});
                        }
                    });
                }
            }
        });
    },
    /////////////Adding new user
    addUser2:function(request,response){
        logger.debug('crud signup addUser');
        const utils =require("../utils");
        const config = require('../config');
        var data={};
        data.userEmail=request.body.userEmail;
        data.username=request.body.username;
        data.role=config.defaultRole;
        if(request.body.social[0]){
            data.social = request.body.social[0];
        }
        if(request.body.location){
            data.geoLocation =  {
            type: "Point",
            coordinates: [
                request.body.location.longitude,
                request.body.location.latitude
            ]
        };
        }
        
        

        data.address ={
            firstName : request.body.firstName,
            lastName : request.body.lastName,
            middleName : request.body.middleName
        }

        if(request.body.address && request.body.address.state){
            data.address.state = request.body.address.state;
        }
        if(request.body.address && request.body.address.country){
            data.address.country = request.body.address.country;
        }
        if(request.body.address && request.body.address.pincode){
            data.address.pincode = request.body.address.pincode;
        }
        if(request.body.address && request.body.address.area){
            data.address.area = request.body.address.area;
        }
        if(request.body.address && request.body.address.city){
            data.address.city = request.body.address.city;
        }
        
        data.gender = request.body.gender;
        data.profilePic = config.AWS_CLOUDFRONT_URL+ '/profile/' + request.body.gender + '.jpeg';
        

        var mobileNumber = request.body.code + request.body.mobile;
        data.mobile = mobileNumber;


        data.password1="social";
        data.communicationEmail = request.body.userEmail;
        data.userId = utils.randomStringGenerate(32);

        data.registrationDate=new Date();
        data.emailVerified=false;
        User.create(data,function(error,result){
            
            if(error){
                logger.error(error);
            }
            else{
                logger.debug('crud result'); 
                commonOperations.sendLink(result.userEmail,"emailactivate","emailActivationToken");
                
                utils.response(response,"success","Registered successfully");
            }
        });
    },

};




module.exports =dbOperations;