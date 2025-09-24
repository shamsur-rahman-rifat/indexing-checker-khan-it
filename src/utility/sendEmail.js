  import { createTransport } from 'nodemailer';

const sendEmail = async (to, text, subject) => {
    let transporter = createTransport({
      service: 'gmail', // You can use other email providers as well
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS 
      }
    });
  
    let mailOptions = {
      from: `"Indexing Checker" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject, 
      text: text
    };
  
    return await transporter.sendMail(mailOptions);
}

export default sendEmail;


