const User=require("../model/User");
const mailSender=require("../utils/mailSender")

const bcrypt=require('bcrypt')


exports.resetPasswordToken=async(req,res)=>{
  try {
      //get email from req body
      const email=req.body.email;

      //check user for this email.email validation
  
      const user=await User.findOne({email:email})
  
      if(!user){
          return res.json({
              message:"Your email is not registered with us"
  
          })
      }
      //generate token
      const token=crypto.randomUUID();
  
      //update user by adding token and expiration time
  
      const updatedDetails =await User.findOneAndUpdate({email:email},{
          token:token,
          resetPasswordExpire:Date.now()+5*60*1000,
      },{new:true});
  
      //create url
      const url=`http://localhost:3000/update-password/${token}`
  
      //send mail
      await mailSender(email,"Password Reset Link",`Reset Your Password: ${url}`);
  
  
      return res.json({
          success:true,
          message:'Email sent successfully,Please check email and change password'
      })
    
  } catch (error) {
    console.log("Error occured while reseting password",error);
    res.status(500).json({
        success:true,
        message:'Error while generating link'
    })
  }
} 


exports.resetPassword = async(req,res)=>{

    try {
        const {password,confirmPassword}=req.body;

        // const {token}=req.pa

        if(!token || !password || !confirmPassword){
            return res.json({
                    success:false,
                    message:"All fields required",
                })
        }

        if(password!==confirmPassword){
            return res.json({
                success:false,
                message:"Password Not Matching",
            })
        }
        const user=await User.findOne({token:token});

        if(!user){
            return res.json({
                success:false,
                message:"Invalid Token",
            })
        }
        if(user.resetPasswordExpire<Date.now()){
            return res.json({
                success:false,
                message:"Token Expired",
            })
        }
        const hashedPassword=bcrypt.hash(password,10);

        const updatedUser= await User.findOneAndUpdate({token:token},{password:hashedPassword},{
            new:true,
        })
        return res.json({
            success:true,
            message:"Password Reset Successfull",
            updatedUser
        })
    } catch (error) {

        console.log(error);
        return res.status(500).json({
            success:true,
            message:"Cannot reset password"
        }
        )   
    }
}