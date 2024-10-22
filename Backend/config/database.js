const mongoose=require('mongoose');
require('dotenv').config()


mongoose.connect('mongodb')

exports.connect=()=>{
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    }).then(()=>console.log("DB CONNECTED SUCCESSFULLY"))
    .catch((err)=>{
        console.log("DB CONNECTION FAILED")
        console.error(err);
        process.exit(1);
    })
}