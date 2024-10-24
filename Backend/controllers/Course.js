const Course=require('../model/Course');
const User=require("../model/User.js");
const Tag=require('../model/Category.js');

const {uploadImageToCloudinary}=require("../utils/imageUploader.js")


//createCourse

exports.createCourse=async(req,res)=>{
    try {
    
        const {courseName,courseDescription,whatYouWillLearn,price,tag}=req.body;

        const thumbnail=req.files.thumbnailImage;

        if(!courseName||!courseDescription||!whatYouWillLearn||!price || !tag || !thumbnail){
            return res.status(400).json({
                success:false,
                message:"All field are required"
            })
        }
        //check for instructor
        const userID=req.user.id;

        const instructorDetails=await User.findById(userID);
        console.log("Instructor:",instructorDetails);

        if(!instructorDetails){
            return res.status(400).json({
                success:false,
                message:"Instructor details not found"
            })
        }
         
        //check fro valid tag
        const tagDetails=await Tag.findById(tag);

        if(!tagDetails){
            return res.status(400).json({
                success:false,
                message:"tag Details not found"
            })
        }

        const thumbnailImage=await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME)

        //Create an entru for new course
        const newCourse=await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn:whatYouWillLearn,
            price,
            tag:tagDetails._id,
            thumbnail:thumbnailImage.secure_url,
        })

        //Update User:
        const updatedUser=await User.findByIdAndUpdate({id:instructorDetails._id},{$push:{
            courses:newCourse._id,
        }},{new:true})

        //Update tag schema
        const updatetag=await Tag.findByIdAndUpdate({_id:tagDetails._id},{
            $push:{
                courses:newCourse._id
            }
        })

        return res.status(200).json({
            success:true,
            message:"Course Created successfully"
        })

        
    } catch (error) {
           console.log("Error while creating coures",error);
        return res.status(400).json({
            success:false,
            message:"Retrieving failed",
            error:error.message
        })
    }
}







//getAllCoursee

exports.getAllCourses=async(req,res)=>{
    try {
        
        const courses=await Course.find({},{courseName:true,courseDescription:true,price:true,thumbnail:true,instructor:true,
            ratingAndReviews:true,
            studentsEnrolled:true
        }).populate("instructor").exec()

        return res.status(200).json({
            success:true,
            message:"Courses Found successfully",
            data:courses
        })
    } catch (error) {
        console.log("Error while retrieving coures",error);
        return res.status(400).json({
            success:false,
            message:"Cannot fetch courses",
            error:error.message
        })
    }
}