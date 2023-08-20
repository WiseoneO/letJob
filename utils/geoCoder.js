const nodeGeocoder = require('node-geocoder');
const config = require('../config/default');

const options = {
    provider: config.geocoder_provider,
    httpAdapter: 'https',
    apiKey: config.mapquest_consumer_key,
    formatter: null
}

const geoCoder = nodeGeocoder(options)
module.exports = geoCoder