const nodemailer = require('nodemailer');
const emailUsername = process.env.EMAIL_USERNAME;
const emailPassword = process.env.EMAIL_PASSWORD;
const emailService = process.env.EMAIL_SERVICE;


const sendEmail = async (options) => {
    // 1. Create a transporter - responsible for sending an email based on email credentials
    const transporter = nodemailer.createTransport({
        service: emailService,
        auth: {
            user: emailUsername,
            pass: emailPassword
        }
    });

    // 2. Define the email options - structuring the layout of the email
    const mailOptions = {
        from: emailUsername,
        to: options.email,
        subject: options.subject,
        text: options.message
        // html: 
    }

    // 3. Service to send the email using the created transporter and the defined email structure
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Email sending error:', error);
    }
};

module.exports = sendEmail;