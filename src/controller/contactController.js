import sendEmail from '../utility/sendEmail.js';

export const submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Get admin emails from .env
    const adminEmails = process.env.ADMIN_EMAILS
      ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim())
      : [];

    if (adminEmails.length === 0) {
      console.error('❌ No admin emails configured in .env');
      return res.status(500).json({ error: 'Email configuration missing.' });
    }

    // Email content for admin(s)
    const mailSubj = `📩 New Contact Form Submission from ${name}`;
    const text = `
      You have received a new message from your website contact form:

      Name: ${name}
      Email: ${email}
      Subject: ${subject}
      Message:
      ${message}
    `;

    // Send to admins
    await sendEmail(adminEmails, text, mailSubj);

    // Confirmation for the user
    const confirmationText = `
      Hi ${name},

      Thanks for contacting us! We’ve received your message and will get back to you soon.

      — The Index Checker Team
    `;
    await sendEmail(email, confirmationText, 'Index Checker Team have received your message!');

    return res.status(200).json({ success: true, message: 'Message sent successfully.' });
  } catch (error) {
    console.error('❌ Error in contact form submission:', error);
    return res.status(500).json({ error: 'Failed to send message.' });
  }
};
