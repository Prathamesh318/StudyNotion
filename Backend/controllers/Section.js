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


        return res.status(200).json({
            success:true,
            message:"Section created successfully",
            updatedCourse
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:true,
            message:"Unable to create section",
            error:error.message
        })
    }
}

exports.updateSection=async(req,res)=>{
    try {

        const {sectionName,sectionId}=req.body;


        if(!sectionId || !sectionId){
            return res.status(400).json({
                success:false,
                message:"All field required",
                updatedCourse
            })
        }

        const section=await Section.findByIdAndUpdate(sectionId,{sectionName:sectionName},{new:true});


        return res.status(200).json({
            success:true,
            message:"Section Updated successfully",
            section
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:true,
            message:"Unable to update section",
            error:error.message
        })
    }
}

exports.deleteSection=async(req,res)=>{
    try {

        //Assuming that we are sending id
        const {sectionId}=req.params;

        if(!sectionId){
            return res.status(400).json({
                success:false,
                message:"All field required",
                updatedCourse
            })
        }

        const section=await Section.findByIdAndDelete(sectionId);

        //TODO do we need to delete the entry from the course [Testing]schema
        // const course=await Section

        return res.status(200).json({
            success:true,
            message:"Section deleted successfully",
            section
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:true,
            message:"Unable to delete message",
            error:error.message
        })
    }
}