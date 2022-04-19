'use strict';

//Routing for superadmin factory only calls

const express = require('express');
const router = express.Router();
const utils = require("../config/utils");
const dbOperations = require("../config/crudoperations/rolecrud");
const validate = require("../config/validate");
const logger = require("../config/logger");
const allUrls = require("../config/registeredUrls");
const authUrls = allUrls.authUrls;

router.get('/get-rights', function (request, response) {
    logger.debug('routes roles getRights');

    response.send({"message":"success","success":true,"code":200,"data":{urls:authUrls}});

});


router.get('/load', function (request, response) {
    logger.debug('routes roles loadRoles');

    dbOperations.loadRoles((error, result) => {
        if (error) {
            // response.json({ "message": "fail" });
            // utils.fail(response);
            utils.response(response,'fail');
        }
        else {
            response.send({"message":"success","code":200,"success":true,"data":{roles:result}});
        }
    });

});

router.post('/create', function (request, response) {
    logger.debug('routes roles createRole');

    var isValidRole = validate.name(request.body.role);

    if (isValidRole) {

        dbOperations.getRole(request.body.role, (error, result) => {
            if (error) {
                // response.json({ "message": "fail" });
                // utils.fail(response);
                utils.response(response,'fail');
            }
            else {
                if (result[0]) {
                    response.json({ "message": "exists",success:false,code:200 });
                }
                else {
                    dbOperations.createRole(request.body.role, (error, result) => {
                        if (error) {
                            // response.json({ "message": "fail" });
                            // utils.fail(response);
                            utils.response(response,'fail');
                        }
                        else {
                            // response.json({ "message": "success" });
                            // utils.success(response);
                            utils.response(response,'success', "Role created successfully");
                        }
                    });
                }
            }
        });
    }
    else {
        // response.json({ "message": "unknown",code:400,success:false });
        utils.response(response,'unknown');
    }
});


router.post('/update-rights', function (request, response) {
    logger.debug('routes roles updateRights');

    var isValidRoleid = validate.id(request.body.roleId);

    if (isValidRoleid) {
        var input = request.body.rights;
        var newRights = [];
        Object.keys(authUrls).forEach(function (key) {
            for (var i = 0; i < authUrls[key].length; i++) {
                if (input.indexOf(authUrls[key][i]) > -1){
                    var right = {
                        name: authUrls[key][i],
                        path: key,
                        url: key + authUrls[key][i]
                    }
                    newRights.push(right);
                }
            }
        });

        dbOperations.fillRights(request.body.roleId, newRights, (error, result) => {
            if (error) {
                // response.json({ "message": "fail" });
                // utils.fail(response);
                utils.response(response,'fail');
            }
            else {
                // response.send({ "message": "success" });
                // utils.success(response);
                utils.response(response,'success', "Rights updated successfully");
            }
        });
    }
    else {
        // response.json({ "message": "unknown",code:400,success:false });
        utils.response(response,'unknown');
    }

});

router.post('/delete', function (request, response) {
    logger.debug('routes roles deleteRole');

    var isValidRoleid = validate.id(request.body.roleId);

    if (isValidRoleid) {
        dbOperations.deleteRole(request.body.roleId, (error, result) => {
            if (error) {
                // response.json({ "message": "fail" });
                // utils.fail(response);
                utils.response(response,'fail');
            }
            else {
                // response.send({ "message": "success" });
                // utils.success(response);
                utils.response(response,'success', "Role deleted successfully");
            }
        });
    }
    else{
            // response.json({ "message": "unknown",code:400,success:false });
            utils.response(response,'unknown');
    }

});

router.post('/assign', function (request, response) {
    logger.debug('routes roles assignRole');

    var isValidEmail = validate.email(request.body.email);
    var isValidRole = validate.name(request.body.role);

    if (isValidEmail && isValidRole && request.body.role!=='superadmin') {
        dbOperations.assignRole(request.body.email, request.body.role, (error, result) => {
            if (error) {
                // response.json({ "message": "fail" });
                // utils.fail(response);
                utils.response(response,'fail');
            }
            else {
                // response.send({ "message": "success" });
                // utils.success(response);
                utils.response(response,'success',"Role assigned successfully");
            }
        });
    }
    else{
            // response.json({ "message": "unknown",code:400,success:false });
            utils.response(response,'unknown');
    }

});

module.exports = router;