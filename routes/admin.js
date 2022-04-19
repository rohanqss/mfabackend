'use strict';

//Routing for admin factory only calls

const express = require('express');
const router = express.Router();
const utils = require('../config/utils');
const dbOperations = require("../config/crudoperations/profile");
const validate = require("../config/validate");
const logger = require("../config/logger");
const { higherOrderRoles } = require('../config/config')

router.post('/set-new-password', function (request, response) {
    logger.debug('routes admin setNewPassword');
    var isValidEmail = false;
    var isValidPassword = false;
    var passwordObject = request.body;
    var message = "Invalid parameter provided -";
    if (passwordObject.email) {
        isValidEmail = validate.email(passwordObject.email);
    }
    if (!isValidEmail) {
        message += " email";
    }

    if (passwordObject.password) {
        isValidPassword = validate.password(passwordObject.password);
    }
    if (!isValidPassword) {
        message += " password";
    }

    if (isValidEmail && isValidPassword) {
        request.body.password1 = passwordObject.password;
        dbOperations.setNewPassword(request, response, passwordObject.email);
    }
    else {
        utils.response(response, 'unknown', message);
    }
});

router.post('/load-users', function (request, response) {
    logger.debug('routes admin loadUsers');
    dbOperations.loadUsers(request, response, request.userData);

});

router.post('/ban-user', function (request, response) {
    logger.debug('routes admin banUser');
    var isValidEmail = false;

    if (request.body.email) {
        isValidEmail = validate.email(request.body.email);
    }
    const config = require('../config/config');
    if (isValidEmail && request.body.email !== config.superadminEmail) {
        const rolecrud = require('../config/crudoperations/rolecrud');
        rolecrud.assignRole(request.body.email, 'banned', (error, result) => {
            if (error) {
                utils.response(response, 'fail');
            }
            else {
                utils.response(response, 'success', "User banned successfully");
            }
        });
    }
    else {
        utils.response(response, 'unknown', 'Invalid paramter provided - email');
    }

});

router.post('/update-userinfo', function (request, response) {
    logger.debug('routes admin updateUserInfo');
    var message = "Invalid parameter provided -";
    // var key = undefined;
    // var value = undefined;
    var user = undefined;
    var keyValue = undefined;
    // if(request.body.key){
    //     var key = request.body.key;
    // }
    // if(key==undefined){
    //     message+=" key";
    // }

    // if(request.body.value){
    //     var value = request.body.value;
    // }
    // if(value==undefined){
    //     message+=" value";
    // }

    if (request.body.keyValue) {
        keyValue = request.body.keyValue;
    }
    if (keyValue == undefined) {
        message += " keys and values";
    }

    if (request.body.user) {
        user = request.body.user;
    }
    if (user == undefined) {
        message += " user";
    }


    // if (user && key && value) {
    //     dbOperations.getUser(request.body.user, (error, result) => {
    //         if (error) {
    //             // response.json({ "message": "fail" });
    //             // utils.fail(response);
    //             utils.response(response,'fail');
    //         }
    //         else if (result) {
    //             var address = result.address;
    //             address[key] = value;
    //             dbOperations.updateProperty(result.userId, 'address', address, (error, result) => {
    //                 if (error) {
    //                     utils.response(response,'fail');
    //                 
    //                 else {
    //                     utils.response(response,'success',"User updated");
    //                 }
    //             });
    //         }
    //         else {
    //             response.json({ "message": "User not found",success:false,code:404 });
    //         }
    //     });
    // }
    if (user && keyValue) {
        dbOperations.getUser(request.body.user, (error, result) => {
            if (error) {
                utils.response(response, 'fail');
            }
            else if (result) {
                for (var key in keyValue) {
                    var address = result.address;
                    address[key] = keyValue[key];
                }
                dbOperations.updateProperty(result.userId, 'address', address, (error, result) => {
                    if (error) {
                        utils.response(response, 'fail');
                    }
                    else {
                        utils.response(response, 'success', "User updated");
                    }
                })
            }
            else {
                response.json({ "message": "User not found", success: false, code: 404 });
            }
        })
    }
    else {
        // response.json({ "message": "unknown",code:400,success:false });
        utils.response(response, 'unknown', message);
    }

});


router.post('/update-user-mobile', function (request, response) {
    logger.debug('routes admin updateUserMobile');
    var message = "Invalid parameter provided -";
    var mobileObject = request.body;
    var isValidCountryCode = false;
    var isValidMobile = false;
    var isValidUser = false;

    if (mobileObject.user) {
        isValidUser = true;
    }
    if (!isValidUser) {
        message += " user";
    }

    if (mobileObject.countryCode) {
        isValidCountryCode = true;
    }
    if (!isValidCountryCode) {
        message += " countryCode";
    }

    if (mobileObject.mobileNumber) {
        isValidMobile = true;
    }
    if (!isValidMobile) {
        message += " mobileNumber";
    }

    if (isValidCountryCode && isValidMobile && isValidUser) {

        dbOperations.getUser(request.body.user, (error, result) => {
            if (error) {
                utils.response(response, 'fail');
            }
            else if (result) {
                result.temporaryMobile = mobileObject.countryCode + mobileObject.mobileNumber;
                var arr = [result];
                dbOperations.checkMobileExists(arr, response);
            }
            else {
                response.json({ "message": "User not found", code: 404, success: false });
            }
        });
    }
    else {
        utils.response(response, 'unknown', message);
    }

});

router.post('/load-user-by-id', function (request, response) {
    logger.debug('routes admin loadUserById');
    var isValidID = validate.id(request.body.userId);

    if (isValidId) {
        dbOperations.getUser(request.body.userId, (error, result) => {
            if (error) {
                utils.response(response, 'fail');
            }
            else {
                response.send({ message: "success", "success": true, "code": 200, "data": result });
            }
        });
    }
    else {
        utils.response(response, 'unknown');
    }

});

router.post('/register-existing', function (request, response) {
    logger.debug('routes admin register-existing');
    var userObject = request.body;
    var message = "Invalid parameters provided -";
    var isValidUserEmail = false;
    var isValidUsername = false;
    var isValidArea = true;
    var isValidState = true;
    var isValidCity = true;
    var isValidPincode = true;
    var isValidCountry = true;
    var isValidLat = true;
    var isValidLong = true;
    var isValidFname = false;
    var isValidMname = false;
    var isValidLname = false;
    var isValidGender = false;
    var isValidMobile = false;
    var isValidCcode = false;
    var isConnection = false;
    var isSid = false;
    var isAccessToken = true;
    request.body.social = [];
    var obj = {};
    if (userObject.connection) {
        isConnection = true;
        obj.connection = userObject.connection;
    }
    if (userObject.sId) {
        isSid = true;
        userObject.sId = userObject.sId.trim();
        obj.sId = userObject.sId;
    }
    if (userObject.accessToken) {
        obj.accessToken = userObject.accessToken;
    }

    request.body.social.push(obj);

    if (userObject.userEmail) {
        request.body.userEmail = request.body.userEmail.toLowerCase();
        isValidUserEmail = validate.email(userObject.userEmail);
    }
    if (!isValidUserEmail) {
        message += ' userEmail';
    }


    if (userObject.username) {
        request.body.username = request.body.username.toLowerCase();
        isValidUsername = validate.username(userObject.username);
    }
    if (!isValidUsername) {
        message += ' username';
    }





    if (!userObject.location || !userObject.location.latitude) {
        isValidLat = true;
    }
    else {
        isValidLat = !isNaN(userObject.location.latitude);
        isValidLat == true ? message = message : message = message + " latitude";
    }

    if (!userObject.location || !userObject.location.longitude) {
        isValidLong = true;
    }
    else {
        isValidLong = !isNaN(userObject.location.longitude);
        isValidLong == true ? message = message : message = message + " longitude";
    }

    if (!userObject.address || !userObject.address.area) {
        isValidArea = true;
    }
    else {
        isValidArea = validate.string(userObject.address.area);
        isValidArea == true ? message = message : message = message + " area";
    }

    if (!userObject.address || !userObject.address.state) {
        isValidState = true;
    }
    else {
        isValidState = validate.string(userObject.address.state);
        isValidState == true ? message = message : message = message + " state";
    }

    if (!userObject.address || !userObject.address.city) {
        isValidCity = true;
    }
    else {
        isValidCity = validate.string(userObject.address.state);
        isValidCity == true ? message = message : message = message + " city";
    }

    if (!userObject.address || !userObject.address.pincode) {
        isValidPincode = true;
    }
    else {
        isValidPincode = validate.number(userObject.address.pincode);
        isValidPincode == true ? message = message : message = message + " pincode";
    }

    if (!userObject.address || !userObject.address.country) {
        isValidCountry = true;
    }
    else {
        isValidCountry = validate.string(userObject.address.country);
        isValidCountry == true ? message = message : message = message + " country";
    }

    if (userObject.firstName) {
        isValidFname = validate.name(userObject.firstName);
    }
    if (!isValidFname) {
        message += ' firstName';
    }

    if (userObject.middleName) {
        isValidMname = validate.name(userObject.middleName);
    }
    if (!isValidMname) {
        message += ' middleName';
    }

    if (userObject.lastName) {
        isValidLname = validate.name(userObject.lastName);
    }
    if (!isValidLname) {
        message += ' lastName';
    }

    if (userObject.gender) {
        isValidGender = validate.gender(userObject.gender);
    }
    if (!isValidGender) {
        message += ' gender';
    }

    if (userObject.mobile) {
        isValidMobile = validate.mobile(userObject.mobile);
    }
    if (!isValidMobile) {
        message += ' mobile';
    }

    if (userObject.code) {
        isValidCcode = validate.code(userObject.code);
    }
    if (!isValidCcode) {
        message += ' code';
    }
    if (!isConnection) {
        message += ' connection';
    }
    if (!isSid) {
        message += ' sId';
    }

    if (isValidUserEmail && isValidUsername && isConnection && isSid
        && isValidLat && isValidLong && isValidFname && isValidLname && isValidGender
        && isValidMobile && isValidCcode && isValidArea && isValidCity && isValidCountry && isValidState && isValidPincode && isValidMname) {
        const signup = require('../config/crudoperations/signup');

        request.body.sId = request.body.sId.trim();
        request.body.mobile = request.body.mobile.trim();
        request.body.userEmail = request.body.userEmail.trim();


        signup.checkUser2(request, response);
    }
    else {
        utils.response(response, 'unknown', message);
    }
});

router.post('/delete-user', function (request, response) {
    logger.debug('routes admin deleteUser');

    var isValidId = validate.id(request.body.userId);
    if (isValidId) {

        dbOperations.getUser(request.body.userId, (error, result) => {
            if (error) {
                utils.response(response, 'fail');
            }
            else if (result && result.role !== 'superadmin') {

                dbOperations.backupUser(result, (error, result) => {
                    if (error) {
                        utils.response(response, 'fail');
                    }
                    else {
                        dbOperations.deleteUser(request.body.userId, (error, result) => {
                            if (error) {
                                utils.response(response, 'fail');
                            }
                            else {
                                utils.response(response, 'success', "User deleted successfully");
                            }
                        });
                    }
                });

            }
            else {
                response.json({ "message": "User not found", code: 404, success: false });
            }

        });
    }
    else {
        utils.response(response, 'unknown');
    }

});










module.exports = router;