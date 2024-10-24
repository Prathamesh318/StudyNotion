const mongoose=require('mongoose')

const courseSchema=new mongoose.Schema(
    {
        courseName:{
            type:String,
            required:true,
            trim:true
        },
        courseDescription:{
            type:String,
            required:true,
            trim:true
        },
        instructor:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        whatYouWillLearn:{
            type:String
        },
        courseContent:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Section"
        }],
        ratingAndReviews:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"RatingAndReview",
        }],
        price:{
            type:Number,
        },
        thumbnail:{
            type:String,
            required:true,
        }
        ,
        section:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Section"
            }
        ],
        category:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Category",
        },
        tag:{
            type:String,
        },
        studentsEnrolled:[
            {
                type:mongoose.Schema.Types.ObjectId,
                required:true,
                ref:"User"
            }
        ]

    }
)

module.exports=mongoose.model("Course",courseSchema);