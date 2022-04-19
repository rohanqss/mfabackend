'use strict';

const urls = {
    urls: {
        '/': [''],
        '/login/': ['login'],
        '/signup/': ['register'],
        '/forgotpassword/': ['send-link', 'password-reset'],
        '/commonroutes/': ['activate-email', 'check-username','get-username'],
       
    },
    authUrls: {
        '/': ['webindex', 'send-activation-link', 'logout'],
    
        // Admin only apis
        '/admin/': ['load-users' , 'set-new-password', 'update-userinfo', 'update-user-mobile', 'update-user-location', 'ban-user', 'load-user-by-id', 'register-existing', 'delete-user'],
        
        // User allowed apis
        '/profile/': ['change-username', 'update-profile-data', 'update-mobile', 'resend-code', 'verify-code', 'set-new-password', 'upload-pic', 'update-location', 'update-social-links', 'verify-password', 'change-email'],
       
    },
}

module.exports = urls;