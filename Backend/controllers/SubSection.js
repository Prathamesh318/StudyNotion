const Section=require("../model/Section")
const SubSection=require("../model/SubSection");



exports.createSubSection=async(req,res)=>{
    try {
        const{title,description,timeDuration,sectionId}=req.body;
        const{video}=res.files;

        if(!title || !description || !timeDuration || !video ||!sectionId){
            return res.status(400).json({
                success:true,
                message:"ALL fields are required",
            
            })
        }

        const uploadDetails=await uploadImageToCloudinary(video,process.env.FOLDER_NAME);

        const createdSubsection=await SubSection.create({
            title:title,
            description:description,
            timeDuration:timeDuration,
            videoUrl:uploadDetails.secure_url,
        });

        const updateSection=await Section.findByIdAndUpdate(sectionId,{
            $push:{
                subSection:sectionId
            }
        },{
            new:true
        })



        return res.status(200).json({
            success:true,
            message:"Sub section created successfully",
            updateSection,
            createdSubsection
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:true,
            message:"Unable to create message",
            error:error.message
        })
    }
}

exports.updateSubSection=async(req,res)=>{
    try {
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:true,
            message:"Unable to update subsection",
            error:error.message
        })
    }
}

exports.deleteSubsection=async(req,res)=>{
    try {
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:true,
            message:"Unable to delete subsection",
            error:error.message
        })
    }
}