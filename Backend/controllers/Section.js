const Section=require("../model/Section");

const SubSection=require("../model/SubSection");

const Course=require("../model/Course");


exports.createSection=async(req,res)=>{
    try {
        const {sectionName,courseId}=req.body;
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:true,
                message:"All fields are required"
            })
        }

        const createdSection=await Section.create({name:sectionName});
        const updatedCourse=await Course.findOneAndUpdate(courseId,{$push:{
            section:createdSection,
        }},{new:true})


        //Populate Section and Subsection
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success:true,
            message:"Something went wrong",
        })
    }
}

exports.updateSection=async(req,res)=>{
    try {
        
    } catch (error) {
        
    }
}

exports.deleteSection=async(req,res)=>{
    try {
        
    } catch (error) {
        
    }
}