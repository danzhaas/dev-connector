const mongoose = require('mongoose');   //using this to connect
const config = require('config');   //allows us to access other json files 
const db = config.get('mongoURI');  //takes the referenced mongo cloud database URI from the default file

const connectDB = async ( ) => {    //When called, will connect to the database.
    try {   //error handling
        await mongoose.connect(db, {    //  returns a promise - if successful, logs success; if fails, catches error and exits process with failure
            useNewUrlParser:true,    //added these to fix deprecation warnings
            useFindAndModify:false,
            useCreateIndex:true,
            useUnifiedTopology:true
        }); 

        console.log('MongoDB Connected...')
    } catch(err) {  //if there is an error...
        console.error(err.message); //log error message
        process.exit(1);    //exit process with failure
    }
}

module.exports = connectDB;