const express=require('express');

const router=express.Router();

const otpGenerator=require('otp-generator')

const User=require("../model/User")
const OTP=require("../model/OTP")
const Profile=require("../model/Profile")

const bcrypt=require('bcrypt')

const jwt=require("jsonwebtoken")

require("dotenv").config();
const mailSender = require("../utils/mailSender");


//sendOtp

exports.sendOtp=async(req,res)=>{
   try {
        const {email}=req.body;
        const checkUserPresent=await User.findOne({email});
            if(checkUserPresent){
                return res.status(401).json({
                    success:false,
                    message:"User already registered"

                })
              }
        var otp=otpGenerator.generate(6,{
            upperCaseAlphabet:false,
            lowerCaseAlphabet:false,
            specialChars:false
        });

        console.log("OTP GENERATED",otp);

        //check unique otp or not
        var result=await OTP.findOne({otp:otp});

        while(result){
            otp=otpGenerator(
                6,
                {
                    upperCaseAlphabet:false,
                    lowerCaseAlphabet:false,
                    specialChars:false
                }
            )
          result=await OTP.findOne({otp:otp});

        }
        const otpPayload={email,otp};

        //create an entry in db
        const otpbody=await OTP.create(otpPayload);
        console.log(otpbody);
        res.status(200).json({
            success:true,
            message:'OTP SENT SUCCESSFULLY',
            otp,
        })

        
   } catch (error) {
       console.log(error);
    return res.status(500).json({
        success:false,
        message:error.message
    })
   }

}


//signup

exports.signUp=async(req,res)=>{
    try {
        //data fetch from request body
        const {firstName,lastName,email,phoneNumber,password,confirmPassword,accountType,contactNumber,otp}=req.body;

        if(!firstName || !lastName || !email || !password ||!confirmPassword || !otp){
           return res.status(403).json({
                success:false,
                message:"All Fields required"
            })
            
        }

        //Check exitsing user
        const existingUser=await User.findOne({email})
        if(existingUser){
            return res.status(500).json({
                success:false,
                message:"User Already Exist"
            })
           
        }
        //Check pass and confirm pass match
        if(data.password!=data.confirmPassword){
           return  res.status(500).json({
                success:false,
                message:"Password doesnt match"
            })
            
        }

        //get Recent otp
        const recentOtp=await OTP.find({email}).sort({createdAt:-1}).limit(1);

        console.log("OTP",recentOtp);

        if(recentOtp.length==0){
            return res.status(400).json({
                success:false,
                message:'OTP NOT FOUND'
            })
        }
        else if(otp!==recentOtp){
            return res.status(400).json({
                success:false,
                message:"Invalid Otp"
            })
        }

        const hashedPassword=await bcrypt.hash(password,10);

        const profileDetails= await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null
        })

        const user=await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType,
            additionalDetails:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`

        })


        return res.status(200).json({
            success:true,
            message:"Registration Successfully",
            user
        })
    } catch (error) {


        console.log("Error occured while registration",error);

        return res.status(500).json({
            success:false,
            message:"Registration successfull"
        })
        
    }
}


exports.login=async(req,res)=>{

    try {
        const {email,password}=req.body;

        const user=await User.findOne({email}).populate("additionalDetails");

        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"All fields required"
            })
        }

        if(!user){
            return res.status(403).json({
                success:false,
                message:"Email Not Found. Kindly Register"
            })
        }
        // const hashedPassword=await bcrypt.hash(password,10);
        if(await bcrypt.compare(password,user.password)){
            const payload={
                email:user.email,
                id:user._id,
                accountType:user.accountType
            }
                const token=jwt.sign(payload,process.env.JWT_SECRET,{
                    expiresIn:"2h",
                })

                user.token=token;
                user.password=undefined;
                const options={
                    expires:new Date(Date.now())+3*24*60*60*1000,
                    httpOnly:true
                }
                res.cookie("token",token,options).status(200).json({
                    success:true,
                    token,
                    user,
                    message:"Loggen In successfully"
                })
        }
        else{
            return res.status(401).json({
                success:false,
                message:"Password is incorrect"
            })
        }

    } catch (error) {
        console.log("Login failes",error);
        return res.status(400).json({
            success:false,
            message:"Login Failed"
        })
        
    }

} 

exports.changePassword=async(req,res)=>{
        try {

            const {email,oldpassword,newPassword,confirmPassword}=req.body;

            if(!oldpassword|| ! newPassword || !confirmPassword){
                return res.status(400).json({
                    success:false,
                    message:"All fields required"
                })
            }
            if(newPassword!==confirmPassword){
                return  res.status(500).json({
                    success:false,
                    message:"Password doesnt match"
                })
            }

            const user=await User.findOne({email});
            if(!user){
                return  res.status(404).json({
                    success:false,
                    message:"User doesnt exist"
                })
            }
            if(await bcrypt.compare(oldpassword,user.password)){

                const hashedPassword=await bcrypt.hash(newPassword,10);
                const updatedUser=await User.updateOne({email:email,password:hashedPassword});

                const mailResponse=await mailSender(email,"Password Successfully Changes",email);

                console.log("Mail response",mailResponse)

                return res.status(200).json({
                    success:true,
                    message:"Password Successfully Updated",
                    updatedUser
                }
                )
            }
            else{
                return res.status(400).json({
                    success:false,
                    message:"Incorrect Password"
                })
            }
            
        } catch (error) {

            console.log("Password Cannot be changes",error);
            res.status(400).json({
                success:false,
                message:"Error while changing password"
            })
            
        }
}