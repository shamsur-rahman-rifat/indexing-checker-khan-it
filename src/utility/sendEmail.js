import { createTransport } from 'nodemailer';

const sendEmail = async (to, text, subject) => {
    let transporter = createTransport({
        host: 'mail.bayas.com.bd', // Outgoing server
        port: 465, // SMTP Port
        secure: true, // Use SSL
        auth: {
            user: 'admin@bayas.com.bd', // Your email address
            pass: 'N!Z~DTP*r61JNftH' // Your email password
        }
    });

    let mailOptions = {
        from: '"Indexing Checker" <admin@bayas.com.bd>', // Your from address
        to: to,
        subject: subject,
        text: text
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ', info.response);
        return info;
    } catch (error) {
        console.error('Error sending email: ', error);
        throw error; // Re-throwing the error so it can be handled elsewhere
    }
};

export default sendEmail;