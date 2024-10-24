const Profile=require("../model/Profile");
const User=require("../model/User.js");


exports.updateProfile=async(res,res)=>{
    try {
        
        const {dateOfBirth="",about="",contactNumber,gender}=req.body;

        const id=req.user.id;

        if(!contactNumber || !gender){
            return res.status(400).json({
                success:false,
                message:"All field are required"
            }
            );
        }

        const user=await User.findById(id);
        const profileId=user.additionalDetails;

        const profileDetails=await Profile.findById(profileId);


        profileDetails.dateOfBirth=dateOfBirth;
        profileDetails.about=about;
        profileDetails.gender=gender;
        profileDetails.contactNumber=contactNumber;

        await profileDetails.save()

        return res.status(200).json({
            success:true,
            message:"Profile updated successfully",
            profileDetails
        }
        );



    } catch (error) {
        console.log("Error while creating profile",error);
        return res.status(500).json({
            success:false,
            message:"Updation failed",
            error:error.message
        })
    }
}

exports.getProfile=async(req,res)=>{
    try {
        const id=req.user.id;
        if(!id){
            return res.status(400).json({
                success:false,
                message:"All field are required"
            }
            );
        };

        const user=await User.findById({_id:id}).populate("additionalDetails").exec();

        // const profile=await Profile.findById(user.additionalDetails);

      
            return res.status(200).json({
                success:true,
                message:"User Data fetched successfully"
            }
            );
        
    } catch (error) {
        console.log("Error while getting profile",error);
        return res.status(500).json({
            success:false,
            message:"Deletion failed",
            error:error.message
        })
    }
}

exports.deleteAccount=async(req,res)=>{
    try {
        const id=req.user.id;
        if(!id){
            return res.status(400).json({
                success:false,
                message:"All field are required"
            }
            );
        }


        const userDetails=await User.findById(id);

        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"User not found"
            }
            );
        }

        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        //TODO:Unenroll the user from all enrolled courses

        await User.findByIdAndDelete({_id:id});


      
            return res.status(200).json({
                success:true,
                message:"User Deleted "
            }
            );
        

         

      
    } catch (error) {
        console.log("Error while updatin profile",error);
        return res.status(500).json({
            success:false,
            message:"Deletion failed",
            error:error.message
        })
    }
}