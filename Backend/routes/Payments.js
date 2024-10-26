// Import the required modules
const express = require("express")
// import {paymentSuccessEmail} from '../mail/templates/paymentSuccessEmail'
const {paymentSuccessEmail}=require("../mail/templates/paymentSuccessEmail")
const router = express.Router()
const {
 capturePayment,verifyPayment,verifySignature
} = require("../controllers/payment")
const { isStudent, auth } = require("../middleware/auth")
// const { auth, isInstructor, isStudent, isAdmin } = require("../middleware/auth")
router.post("/capturePayment", auth, isStudent, capturePayment)

// router.post("/verifyPayment", auth, isStudent, verifyPayment)
router.post(
  "/sendPaymentSuccessEmail",
  auth,
  isStudent,
  paymentSuccessEmail
)
// router.post("/verifySignature", verifySignature)

module.exports = router
