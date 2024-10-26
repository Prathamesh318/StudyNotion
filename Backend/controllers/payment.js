const {instance}=require("../config/razorpay");
const User=require("../models/User")
const Course=require("../models/Course")
const mailSender=require("../utils/mailSender")

const {courseEnrollmentEmail}=require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");


//capture the payment and initiate the razorpay order

exports.capturePayment=async(req,res)=>{
    try {
        const {course_id}=req.body;
        const userId=req.user.id;

        if(!course_id){
            return res.json({
                success:false,
                messagee:"Please provide valid course ID"
            })
        }

        let course;
        try {
            course=await Course.findById(course_id)
            if(!course){
                return res.json({
                    success:false,
                    message:"Could Not Find Students"
                })
            }
            //User already pay for the same course

            const uid=new mongoose.Types.ObjectId(userId);

            if(course.studentsEnrolled.includes(uid)){
                return res.status(200).json({
                    success:false,
                    message:"STudent already enrolled"
                })
            }
        } catch (error) {
            console.error("Error while fetching Students",error);
            return res.status(200).json({
                success:false,
                message:error.message
            })
        }
        //Create Order
        const amount=course.price;
        const currency="INR";

        const options={
            amount:amount*100,
            currency,
            receipt:Math.random(Date.now()).toString(),
            notes:{
                courseId:course_id,
                userId,

            }
        }

        try {
            //initiate the payment using the razorpay

            const paymentResponse=await instance.orders.create(options);
            console.log(paymentResponse);

            return res.status(200).json({
                success:true,
                courseNamee:course.courseName,
                courseDescription:courseDescription,
                thumbnail:course.thumbnail,
                orderId:paymentResponse.id,
                currency:paymentResponse.currency,
                amount:paymentResponse.amount
            })
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success:false,
                message:"Course order could not be created"
            }
            )
        }

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Course order could not be created"
        }
    );
    }
}


exports.verifySignature=async(req,res)=>{
    try {
        const webhookSecret="12345678";

        const signature=req.headers["x-razorpay-signature"]

        const shasum=crypto.createHmac("sha256",webhookSecret);

        shasum.update(JSON.stringify(req.body));

        const digest=shasum.digest("hex");

        if(signature===digest){
            console.log("Payment is Authorized");
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Verification Failed"
        }
    );
    }
}
