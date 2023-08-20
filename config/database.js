const mongoose = require('mongoose');
const config = require('./default');

const connectDatabase = ()=>{mongoose.connect(config.db_local_uri,{
    useUnifiedTopology: true,
    }).then(con =>{
        console.log(`MongoDB database with host: ${con.connection.host}`)
    });
};

module.exports = connectDatabase;