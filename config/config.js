'use strict';

const secrets={
    dbUrl:"mongodb://localhost:27017/webskeleton3",
    dbName:"webskeleton3",
  
    userCollection:"users",
    sessionCollection:"appsessions",
    roleCollection:"roles",
   
 
   
    sessionKey:["ggggg","aaaaa","sssssss","hhhhh","ffff","kkkkkk","ttt","aaaa"],
    jwtKey:'supersecret',
    jwtDuration: 86400,  //expires in 24 hours 
    reqUrl:"http://localhost:1234",
    defaultSessionDuration:2*60*60,
    sessionMode: 'jwt',
    sessionType: 'multi',
    superadminEmail:'rohancool3845@gmail.com',
    defaultRole:"superadmin",
    alternateRole0:"user",
    defaultCurrency: '\u20B9',
  
    higherOrderRoles:['superadmin','admin'],
    SMTPS_EMAIL:"codingrohan835@gmail.com",
    SMTPS_PASSWORD:"coding@2021",
    SMTPS_URL:'smtp.gmail.com',
    COMPANY_NAME:'Open City Labs',
    TWILIO_ACCOUNT_SID:'AC0b2132f1cf34e21a6ea933ee86fef0f6',
    TWILIO_AUTH_TOKEN:'c45b613c5e6f778d2a26340c2268c5ff',
    MSG91_AUTH_KEY: '219223A33vQkSXs95b1802d7',
    MSG91_SENDER_ID: 'ROHAN',
    VALID_TWILIO_NUMBER:'+13148885390',

   

}
module.exports=secrets;
/*
const secrets={
    dbUrl:"mongodb://localhost:27017/iluzexdb",
    dbCollection:"ilusers",
    sessionCollection:"appsessions",
    sessionKey:["ggggg","aaaaa","sssssss","hhhhh","ffff","kkkkkk","ttt","aaaa"],
    reqUrl:"http://localhost:1234",
    defaultSessionDuraion:2*60*60,
    SMTPS_EMAIL:"Senders Email",
    SMTPS_PASSWORD:"Password",
    SMTPS_URL:'smtp.gmail.com',
    COMPANY_NAME:'XYZ',
    TWILIO_ACCOUNT_SID:'twilio account sid',
    TWILIO_AUTH_TOKEN:'twilio account password',
    VALID_TWILIO_NUMBER:'twilio account number',
}
module.exports=secrets;
*/