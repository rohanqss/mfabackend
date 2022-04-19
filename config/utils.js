'use strict';

const config = require("./config");
const Session = require('../config/schemas/sessionschema');
const logger = require("./logger");
const slugo = require('slugo');
var path = require('path');
var public_path = path.normalize(__dirname + "/..");



const utils = {

    fillWebSession: function (request, userData) {
        logger.debug('config utils fillWebSession');
        request.session.user = userData;
        request.session.save();
        if (userData.rememberMe == true) {
            var thirtyDays = 30 * 24 * 60 * 60 * 1000;
            request.session.cookie.expires = new Date(Date.now() + thirtyDays);
        }
    },

    fillAppSession: function (userData, responseObject, response) {
        logger.debug('config utils fillAppSession');

        userData._id = undefined; //prevent duplicate record error
        userData = userData.toObject();
        userData.sessionId = responseObject.sessionId;
        userData.uuid = "xxxxxxxxxx";

        Session.create(userData, function (error, result) {
            if (error) {
                logger.error(error);
            }
            else {
                response.send(responseObject);
            }
        });
    },

    fillSession: function (request, response, result, responseObject) {
        logger.debug('config utils fillSession');

        //data is freezed object so no issue till not adding any new property
        var userData = result;
        userData.password1 = undefined;
        userData.salt = undefined;
        userData.passwordTokenStamp = undefined;
        userData.emailActivationToken = undefined;
        userData.forgotPasswordToken = undefined;
        userData.mobileVerificationCode = undefined;
        userData.mobileTokenStamp = undefined;
        userData.locationHistory = undefined;
        
        userData.chats = undefined;
        userData.communitiesCreated = undefined;
        userData.communitiesJoined = undefined;
        userData.products = undefined;
        userData = userData.toObject();
        if(userData.social && userData.social[0] && userData.social[0].sId)
        {
            userData.connectionType = userData.social[0].connection;
            userData.social = true;
        }
        userData.social = undefined;

        if (userData.temporaryMobile && userData.countryCode) {
            userData.temporaryMobile = userData.temporaryMobile.split(userData.countryCode)[1];
        }

        if (userData.mobile && userData.countryCode) {
            userData.mobile = userData.mobile.split(userData.countryCode)[1];
        }

        if (responseObject.business) {
            userData.businesses = [responseObject.business.businessId];
        }

        if (config.sessionMode === 'jwt') {
            const jwtOps = require('./jwt');
            jwtOps.fillJwtSession(request, userData, function (userData2) {
                if (userData2) {
                    userData2.uuid = undefined;
                    responseObject.sessionId = userData2.sessionId;
                    userData2.sessionId = undefined;
                    
                    responseObject.data = { "profile": userData2 };
                    if (responseObject.data.profile.address) {
                        responseObject.data.profile.firstName = responseObject.data.profile.address.firstName;
                        responseObject.data.profile.middleName = responseObject.data.profile.address.middleName;
                        responseObject.data.profile.lastName = responseObject.data.profile.address.lastName;
                        responseObject.data.profile.bio = responseObject.data.profile.address.bio;
                        responseObject.data.profile.address.firstName = undefined;
                        responseObject.data.profile.address.lastName = undefined;
                        responseObject.data.profile.address.middleName = undefined;
                        responseObject.data.profile.address.bio = undefined;
                    }
                    if (responseObject.business) {
                        responseObject.data.business = responseObject.business;
                        responseObject.business = undefined;
                    }
                    console.log(responseObject);
                    response.send(responseObject);
                    if (responseObject.callback) {
                        responseObject.message = "authenticated successfully";
                        responseObject.code = 200;
                        responseObject.success = true;
                        responseObject.callback(null, responseObject);

                    }
                }
            });
        }
        else {
            //obsolete
            if (request.body.appCall === true) {
                if (request.body.sessionId != undefined) {
                    Session.find({ sessionId: request.body.sessionId }).remove(function (error, result) {
                        if (error) {
                            logger.error(error);
                        }
                    });
                }
                var randomString = this.randomStringGenerate(32);
                responseObject.sessionId = randomString + userData.username;
                var sid = responseObject.sessionId;
                responseObject.data = { "profile": userData };
                this.fillAppSession(userData, responseObject, response);
                if (responseObject.callback) {
                    responseObject.callback(null, { sessionId: sid });
                }
            }
            else {
                this.fillWebSession(request, userData);
                responseObject.data = { "profile": userData2 };
                response.send(responseObject);
                if (responseObject.callback) {
                    responseObject.callback(null);
                }
            }
        }
    },

    webSessionDestroy: function (request, response) {
        logger.debug('config utils webSessionDestroy');
        request.session.destroy(function (error) {
            if (error) {
                logger.error(error);
            }
            else {
                // utils.success(response);
                utils.response(response, 'success', "Logged out successfully");
                // response.json({ message: "success",code:200,success:true});
            }
        });
    },

    appSessionDestroy: function (id, response) {
        logger.debug('config utils appSessionDestroy');

        Session.find({ sessionId: id }).remove(function (error, result) {
            if (error) {
                logger.error(error);
            }
            else {
                logger.debug('crud result');
                // response.json({ message: "success" });
                // utils.success(response);
                utils.response(response, 'success', "Logged out successfully");
            }
        });
    },

    sendMail: function (To, Subject, EmailText, Html_Body) {
        logger.debug('config utils sendMail');
        const nodeMailer = require("nodemailer");
        var URL = "smtps://" + config.SMTPS_EMAIL + ":" + config.SMTPS_PASSWORD + "@" + config.SMTPS_URL;
        var transporter = nodeMailer.createTransport(URL);
       
        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: config.COMPANY_NAME + '<h=' + config.SMTPS_EMAIL + '>', // sender address
            to: To, // list of receivers
            subject: Subject, // Subject line
            text: EmailText, // plaintext body
            html: Html_Body, // html ,
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                logger.error(error);
                console.log("Error", error);
            }
            if (info != undefined) {
                logger.info('Message sent: ' + info.response);
                console.log("mail sent", info.response);
            } else {
                logger.error("error sending mail");
                console.log("mail errore");
            }
        });
    },

    randomStringGenerate: function (x) {
        logger.debug('config utils randomStringGenerate');
        const randomString = require("randomstring");
        return randomString.generate(x);
    },

    randomNumberGenerate: function (min, max) {
        logger.debug('utils randomNumberGenerate');
        return Math.floor(Math.random() * (max - min + 1) + min);
    },

    sendSms: function (number, body) {
    //    const msg91 = require('msg91')('361330ADluy5BU60ad12f0P1', 'alaromaleafs', 4);
    // msg91.send(number, body, function (error, response) {
    //   if (error) {
    //     logger.error(error);
    //   } else {
    //     logger.info(response);
    //   }
    // });
    var accountSid = "ACb0b9cc1b92409727583e3d354d405dad";
    var authToken = "1f381d653784842882a0f096677f1ac4";

    const client = require('twilio')(accountSid, authToken);


    client.messages.create({
        body: body,
        to: number,  // Text this number
        from: "+1 201 817 4355", // From a valid Twilio number
    }, function (error, message) {
        if (error) {
            logger.error(error);
        }
        else {
            logger.info(message.sid);
        }
    });

    },

    ReadExcelFile: function (file, sheet_no, callback) {
        // console.log('hey');
        var excelParser = require('excel-parser');

        var file_path = path.join(public_path, '/public/xlsx_files/' + file);
        // console.log(public_path);
        excelParser.parse({
            inFile: file_path,
            worksheet: sheet_no,
        }, function (err, records) {
            if (err) callback(err, null);
            callback(null, records);
        });
    },

    sendSms2: function (number, body) {
        logger.debug('config utils sendSms');
        const twilio = require("twilio");
        var accountSid = config.TWILIO_ACCOUNT_SID;
        var authToken = config.TWILIO_AUTH_TOKEN;

        var client = new twilio.RestClient(accountSid, authToken);

        client.messages.create({
            body: body,
            to: number,  // Text this number
            from: config.VALID_TWILIO_NUMBER, // From a valid Twilio number
        }, function (error, message) {
            if (error) {
                logger.error(error);
            }
            else {
                logger.info(message.sid);
            }
        });
    },

    stringInject: function (str, data) {
        if (typeof str === 'string' && data instanceof Array) {

            return str.replace(/({\d})/g, function (i) {
                return data[i.replace(/{/, '').replace(/}/, '')];
            });
        } else if (typeof str === 'string' && data instanceof Object) {

            for (var key in data) {
                return str.replace(/({([^}]+)})/g, function (i) {
                    var key = i.replace(/{/, '').replace(/}/, '');
                    if (!data[key]) {
                        return i;
                    }

                    return data[key];
                });
            }
        } else {

            return false;
        }
    },

    createMail: function (userdata, type) {
        var that = this;
        logger.debug('utils create mail', type, userdata);
        const emails = require('./emails');
        var that = this;
        var text = "";
        switch (type) {
            case "verificationlink":
                text = "Your token is " + userdata.url;
                var payload = '/activate/email?token=' + userdata.token + '&email=' + userdata.email;
                var emailString = emails.verification.htmlBody;
                var finalBody = that.stringInject(emailString, { activationLink: 'https://opencitylabs.com' + payload });

                that.sendMail(userdata.email, emails.verification.subject, text, finalBody);
                break;
           case "verification2fa":
            text = "Your otp is " + userdata.mobileVerificationCode;
            var emailString = emails.verification2fa.htmlBody;
            var finalBody = that.stringInject(emailString, { otp: userdata.mobileVerificationCode });

            that.sendMail(userdata.userEmail, emails.verification2fa.subject, text, finalBody);
            case "forgotpassword":
                var payload = '/password/reset/' + userdata.email + '?token=' + userdata.token;
                userdata.url = 'https://opencitylabs.com' + payload;
                text = "Set a new password by clicking " + userdata.url;
                var emailString = emails.password.htmlBody;
                var finalBody = that.stringInject(emailString, { newPassLink: 'https://opencitylabs.com' + payload, userEmailId: userdata.email });
                that.sendMail(userdata.email, emails.password.subject, text, finalBody);
                break;

            case "signupadmin":
                var to = [emails.admin];
                text = "New " + userdata.role + " registered with email: " + userdata.userEmail;
                that.sendMail(to, emails.signupAdmin.subject, text, emails.signupAdmin.htmlBody);
                break;

         
        }
    },

    response: function (response, type, message, data) {
        var message1 = "";
        switch (type) {
            case 'success': message1 = message || 'success'; response.json({ message: message1, code: 200, success: true, data: data }); break;
            case 'fail': message1 = message || 'Some error has occured, please try again later'; response.json({ message: message1, code: 403, success: false }); break;
            case 'unknown': message1 = message || 'Invalid Parameters'; response.json({ message: message1, code: 400, success: false }); break;
        };

    },

    returnSlug: function (string) {
        logger.debug('slug function on: ', string);
        return slugo(string);
    },


    replaceMessage: function (message) {
        var emailExp = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/img;
        var phoneExp = /(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/img;

        message = message.replace(emailExp, '*********').replace(phoneExp, '##########');
        return message;
    },

};


module.exports = utils;