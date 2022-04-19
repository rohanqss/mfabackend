'use strict';

const express = require('express');
const path = require('path');
const logger = require('morgan');
//var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mfavicon = require("express-favicon");
const authenticator = require('./config/session');
// const busboy = require('connect-busboy');
// const busboyBodyParser = require('busboy-body-parser');
const app = express();

const config = require('./config/config');
const init = require('./config/init');



app.use(function (request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, x-csrf-token, Accept, Authorization");
    next();
});

//Limit request per IP

// app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)
 
// var limiter = new RateLimit({
//   windowMs: 24*60*60*1000, // 24 hours/ 1 day
//   max: 100, // limit each IP to 100 requests per windowMs
//   delayAfter: 50, // begin slowing down responses after the 50th request
//   delayMs: 200, // disable delaying - full speed until the max limit is reached
//   handler: function (req, res, next) {
//     res.format({
//     json: function(){
//       res.status(401).json({ message: 'Too many requests, please try again later.',code:401,success:false });
//     }
//   });
// }
// });
 
// //  apply to all requests
// app.use(limiter);

// const otpLimiter = RateLimit({
//     windowMs: 24 * 60 * 60 * 1000, // 24 hours
//     max: 3
//   });
   
//   // only apply to requests that begin with /api/
//  app.use("/profile/resend-code", otpLimiter);


//app.use(cookieParser());

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.use(busboy());
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(busboyBodyParser());
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(mfavicon(__dirname + '/public/favicon.ico'));

require('crashreporter').configure({
    outDir: './logs', // default to cwd
    exitOnCrash: true, // if you want that crash reporter exit(1) for you, default to true,
    maxCrashFile: 100, // older files will be removed up, default 5 files are kept
    // mailEnabled: true,
    // mailTransportName: 'SMTP',
    // mailTransportConfig: {
    //     service: 'Gmail',
    //     auth: {
    //         user: "yourmail@gmail.com",
    //         pass: "yourpass"
    //     }
    // },
    // mailSubject: 'advanced.js crashreporter test',
    // mailFrom: 'crashreporter <yourmail@gmail.com>',
    // mailTo: 'yourmail@gmail.com'
});

if (config.sessionMode === 'jwt') {
    app.use(authenticator.jwtSession);
}
else {
    const session = require('express-session');
    const mongoStore = require('connect-mongo')(session);
    
    app.use(session({
        secret: config.sessionKey,
        saveUninitialized: false,
        resave: true,
        //httpOnly: true, //default true
        //secure: true,
        //ssl
        //ephemeral: true
        store: new mongoStore({
            url: config.dbUrl,
            //ttl: 14 * 24 * 60 * 60,//14 days 
            ttl: config.defaultSessionDuration,// 2 hours 
            //mongoOptions: advancedOptions // See below for details 
        })
    }));
    app.use(authenticator.webSession);
}

module.exports = app;

const index = require('./routes/index');
const roles = require('./routes/roles');
const commonroutes = require('./routes/commonroutes');
const signup = require('./routes/signup');
const login = require('./routes/login');
const profile = require('./routes/profile');
const forgotpassword = require('./routes/forgotpassword');

//app.use(session({ secret:"string"}));
app.use('/', index);
app.use('/roles', roles);
app.use('/commonroutes', commonroutes);
app.use('/signup', signup);
app.use('/login', login);
app.use('/profile', profile);
app.use('/forgotpassword', forgotpassword);

app.use('*', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//Error handler //comment in production
const vm = require('vm');
const logger2 = require('./config/logger');
// const Debug = vm.runInDebugContext('Debug'); // Obtain Debug object

// Debug.setListener((type, _, e) => { // listen for all debug events
//   if (type == Debug.DebugEvent.Exception) {
//     logger2.error(e.exception().stack) // e is an event object
//   }
// });

// Debug.setBreakOnException(); // this is required for Exception event to fire

// // error handler
// app.use(function (err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};

//     // render the error page
//     res.status(err.status || 500);
//     //   res.render('error');
// });

init.superAdmin();
// schedular.compressCron();
// schedular.productCron();
// schedularBusiness.compressCron();
// schedularBusiness.businessCron();

module.exports = app;

app.listen(1234, function () {
    console.log("Server listening at port 1234..");
})

