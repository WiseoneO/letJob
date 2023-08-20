require('dotenv').config();

const config = {
    port: process.env.PORT || 6000,
    node_env: process.env.NODE_ENV,
    db_local_uri: process.env.DB_LOCAL_URI,
    jwt_secret : process.env.JWT_SECRET,
    cookie_expires_time: process.env.COOKIE_EXPIRES_TIME,
    jwt_expires_in : process.env.JWT_EXPIRES_IN,
    geocoder_provider: process.env.GEOCODER_PROVIDER,
    mapquest_consumer_key: process.env.MAPQUEST_CONSUMER_KEY
}

module.exports = config;