const mongoose=require('mongoose');
require('dotenv').config()


mongoose.connect('mongodb')

exports.connect=()=>{
    mongoose.connect("mongodb://localhost:27017/StudyNotion",{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    }).then(()=>console.log("DB CONNECTED SUCCESSFULLY"))
    .catch((err)=>{
        console.log("DB CONNECTION FAILED")
        console.error(err);
        process.exit(1);
    })
}