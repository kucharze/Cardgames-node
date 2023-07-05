const mongoose = require('mongoose');

const connectDB = async () =>{
    try{//process.env.DATABASE_URI
        await mongoose.connect(
            await "mongodb+srv://admin:Zekxlr8323%21@node-deploy.z0pjs.mongodb.net/?retryWrites=true&w=majority",
            {//Help prevent warnings that MongoDB would normally generate
                useUnifiedTopology: true,
                useNewUrlParser: true
            }
        )
    }
    catch(err){
        console.error(err);
    }
}

module.exports = connectDB