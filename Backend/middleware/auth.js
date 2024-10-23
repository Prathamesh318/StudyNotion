const jwt=require("jsonwebtoken")

require("dotenv").config();

const User=require("../model/User");


exports.auth = async (req, res, next) => {
    try {
      // Extract token from cookies, header, or body
      const token = req.cookies.token || req.header("Authorization").replace("Bearer ", "") || req.body.token;
  
      // If token is missing, return 401 response
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Token is missing",
        });
      }
 // Verify the token (code omitted for brevity)
      try {
        const decode=await jwt.verify(token,process.env.JWT_SECRET);

        console.log(decode);
        req.user=decode;
      } catch (error) {
        return res.status(401).json({
            success:false,
            message:"Invalid Token"
        })
      }

      next();
    } catch (error) {
      // Handle errors (code omitted for brevity)

      res.status(401).json({
        success:false,
        message:"Something went wrong while validating the token"
      })
    }
  };


  exports.isStudent=async(req,res,next)=>{
    try {
        if(req.user.accountType!=="Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for students only"
            });
        }
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"User role cannot be verified,please try again"
          })
    }
  }

  exports.isInstructor=async(req,res,next)=>{
    try {
        if(req.user.accountType!=="Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Instructor only"
            });
        }
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"User role cannot be verified,please try again"
          })
    }
  }


  exports.isInstructor=async(req,res,next)=>{
    try {
        if(req.user.accountType!=="Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for admin only"
            });
        }
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"User role cannot be verified,please try again"
          })
    }
  }