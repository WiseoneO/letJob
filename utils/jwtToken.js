const config = require('../config/default');


// create and send token and save cookie
const sendToken = (user, statusCode, res)=>{
    // create jwt token
    const token =  user.getJwtToken();
    console.log(token)

    

    // options for cookie
    const options = {
        expires : new Date(Date.now() + 5* 24*60*60*1000),
        httpOnly: true
    };

    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        });
} 

module.exports = sendToken;