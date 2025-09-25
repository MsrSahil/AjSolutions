import nodemailer from 'nodemailer'

const sendEmail = async (to, subject, message) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASSCODE,
            },
        });

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to,
            subject,
            html: message,
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        return true;
    } catch (error) {
        console.log('Email not sent');
        return false;
    }
}

export default sendEmail;