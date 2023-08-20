const config = require('../config/default');


// create and send token and save cookie
const sendToken = (user, statusCode, res)=>{
    // create jwt token
    const token =  user.getJwtToken();

    // options for cookie
    const Options = {
        expires : new Date(Date.now() + config.cookie_expires_time *24*60*60*1000),
        httpOnly: true
    }

    res.status(statusCode)
        .cookie('token', token, Options)
        .json({
            success: true,
            token
        });
} 

module.exports = sendToken;