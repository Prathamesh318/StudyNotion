const nodemailer = require("nodemailer")

const mailSender = async (email, title, body) => {
  try {
    console.log('Email',email);
    console.log('title',title);
    console.log('Body :',body)
    console.log('Mail host',process.env.MAIL_HOST)
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      secure: false,
    })

    let info = await transporter.sendMail({
      from: `"Studynotion | CodeHelp" <${process.env.MAIL_USER}>`, // sender address
      to: `${email}`, // list of receivers
      subject: `${title}`, // Subject line
      html: `${body}`, // html body
    })
    console.log("INFORMATION"+info.response)
    return info
  } catch (error) {
    console.log(email)
    console.log("Error occured while sending mai",error.message)
    return error.message
  }
}

module.exports = mailSender
