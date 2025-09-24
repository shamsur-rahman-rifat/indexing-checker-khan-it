import { createTransport } from 'nodemailer';

const sendEmail = async (to, text, subject) => {
    const transporter = createTransport({
        service: 'gmail', // Gmail service
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,  // If you use 2FA, use App Password here
        },
        tls: {
            rejectUnauthorized: false  // This is sometimes needed if you're on a corporate network
        },
        host: 'smtp.gmail.com',  // Explicitly specify the Gmail SMTP host
        port: 587,               // Use port 587 (STARTTLS)
        secure: false,           // Use STARTTLS, so it’s not secure by default
    });

    let mailOptions = {
        from: `"Indexing Checker" <${process.env.EMAIL_USER}>`, // sender address
        to: to,                                                    // list of receivers
        subject: subject,                                          // Subject line
        text: text,                                                // plain text body
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export default sendEmail;