const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1. Create a transporter - responsible for sending an email based on email credentials
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // 2. Define the email options - structuring the layout of the email
    const mailOptions = {
        from: 'Flowstate support<dswfullstack@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
        // html: 
    }

    // 3. Service to send the email using the created transporter and the defined email structure
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;